import Vue, { VNode } from 'vue';
import { GENERATORS } from '../../util/question_generators/generators';
import SingleTrickSelectorComponent from './single_trick_selector';
import { MultipleTricksSelectorComponent } from './multiple_tricks_selector';
import { RadioGroupComponent } from '../shared/radio_group';

const TRICK_NAMES: string[] = GENERATORS.map((g) => g.name);

enum TrickSelectorType {
  SINGLE_TRICK,
  ALL_TRICKS_UP_TO,
  MULTIPLE_TRICKS,
}

const singleSelectorRef = 'single_selector_ref';
const multipleSelectorRef = 'multiple_selector_ref';

export const OptionsComponent = Vue.extend({
  components: {
    singleSelector: SingleTrickSelectorComponent,
    multipleSelector: MultipleTricksSelectorComponent,
    radioGroup: RadioGroupComponent,
  },
  data: function() {
    return {
      // Create an array with GENERATORS.length elements, all initialized to false.
      includedTricks: GENERATORS.map(() => false),
      trickSelectorType: TrickSelectorType.SINGLE_TRICK,
    };
  },
  computed: {
    atLeastOneTrickIncluded(): boolean {
      for (const isTrickIncluded of this.includedTricks) {
        if (isTrickIncluded) {
          return true;
        }
      }
      return false;
    },
  },
  methods: {
    processSelectorTypeSelection(selection: string): void {
      this.updateSelectorType(parseInt(selection));
    },
    updateSelectorType(type: TrickSelectorType): void {
      this.trickSelectorType = type;
      switch (this.trickSelectorType) {
        case TrickSelectorType.SINGLE_TRICK:
        case TrickSelectorType.ALL_TRICKS_UP_TO: {
          const singleTrickComponent: any = this.$refs[singleSelectorRef];
          this.updateSelectedTrick(singleTrickComponent.selectedTrick);
          break;
        }
        case TrickSelectorType.MULTIPLE_TRICKS: {
          const multipleTricksComponent: any = this.$refs[multipleSelectorRef];
          this.updateIncludedTricks(multipleTricksComponent.includedTricks.slice());
          break;
        }
      }
    },
    updateSelectedTrick(selectedTrick: number): void {
      this.includedTricks = GENERATORS.map(() => false);
      switch (this.trickSelectorType) {
        case TrickSelectorType.SINGLE_TRICK:
          this.includedTricks[selectedTrick] = true;
          break;
        case TrickSelectorType.ALL_TRICKS_UP_TO:
          for (let i = 0; i <= selectedTrick; ++i) {
            this.includedTricks[i] = true;
          }
          break;
        default:
          throw new Error(
            `updateSelectedTrick should only be called if the trick selection type is SINGLE_TRICK
            or ALL_TRICKS_UP_TO`);
      }
    },
    updateIncludedTricks(includedTricks: boolean[]): void {
      this.includedTricks = includedTricks;
    },
    startButtonPressed(): void {
      this.$emit('start', this.includedTricks);
    },
  },
  mounted(): void {
    this.updateSelectorType(this.trickSelectorType);
  },
  render(createElement): VNode {
    const elements: VNode[] = [];

    elements.push(createElement('legend', 'Options'));

    elements.push(createElement('radioGroup', {
      props: {
        name: 'selector_type',
        values: [
          '' + TrickSelectorType.SINGLE_TRICK,
          '' + TrickSelectorType.ALL_TRICKS_UP_TO,
          '' + TrickSelectorType.MULTIPLE_TRICKS,
        ],
        valueDisplayNames: [
          'Practice Single Trick',
          'Practice All Tricks Up To',
          'Practice Multiple Tricks',
        ],
        initialValue: '' + this.trickSelectorType,
      },
      on: {
        change: this.processSelectorTypeSelection,
      },
    }));

    elements.push(createElement('br'));
    elements.push(createElement('br'));

    elements.push(createElement('singleSelector', {
      ref: singleSelectorRef,
      props: {
        optionsArray: TRICK_NAMES,
      },
      attrs: {
        hidden: ![
          TrickSelectorType.SINGLE_TRICK,
          TrickSelectorType.ALL_TRICKS_UP_TO,
        ].includes(this.trickSelectorType),
      },
      on: {
        updateSelectedTrick: this.updateSelectedTrick,
      },
    }));

    elements.push(createElement('multipleSelector', {
      ref: multipleSelectorRef,
      props: {
        optionsArray: TRICK_NAMES,
      },
      attrs: {
        hidden: this.trickSelectorType !== TrickSelectorType.MULTIPLE_TRICKS,
      },
      on: {
        updateIncludedTricks: this.updateIncludedTricks,
      },
    }));

    elements.push(createElement('br'));
    elements.push(createElement('br'));

    const startButton = createElement('button', {
      attrs: {
        disabled: !this.atLeastOneTrickIncluded,
      },
      on: {
        click: this.startButtonPressed,
      },
    }, 'Start!');
    elements.push(startButton);

    return createElement('fieldset', elements);
  },
});
