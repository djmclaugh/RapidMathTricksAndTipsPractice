import Vue, { VNode } from 'vue';
import Component from 'vue-class-component';
import { GENERATORS } from '../../util/question_generators/generators';
import MultipleTricksSelectorComponent from './multiple_tricks_selector';
import RadioGroupComponent from '../shared/radio_group';
import SelectorComponent from '../shared/selector';

const TRICK_NAMES: string[] = GENERATORS.map((g) => g.name);

enum TrickSelectorType {
  SINGLE_TRICK,
  ALL_TRICKS_UP_TO,
  MULTIPLE_TRICKS,
}

const OptionsProps = Vue.extend({
  props: {
    // No props needed
  },
});

@Component({
  components: {
    selector: SelectorComponent,
    multipleSelector: MultipleTricksSelectorComponent,
    radioGroup: RadioGroupComponent,
  },
})
export default class OptionsComponent extends OptionsProps {
  // $refs override
  selectorRef = 'selector';
  multipleSelectorRef = 'multipleSelector';
  $refs!: {
    selector: SelectorComponent,
    multipleSelector: MultipleTricksSelectorComponent,
  }

  // Data
  includedTricks: boolean[] = GENERATORS.map(() => false);
  trickSelectorType: TrickSelectorType = TrickSelectorType.SINGLE_TRICK;

  // Computed
  get atLeastOneTrickIncluded(): boolean {
    for (const isTrickIncluded of this.includedTricks) {
      if (isTrickIncluded) {
        return true;
      }
    }
    return false;
  }

  // Methods
  private processSelectorTypeSelection(selection: string): void {
    this.updateSelectorType(parseInt(selection));
  }

  private updateSelectorType(type: TrickSelectorType): void {
    this.trickSelectorType = type;
    switch (this.trickSelectorType) {
      case TrickSelectorType.SINGLE_TRICK:
      case TrickSelectorType.ALL_TRICKS_UP_TO: {
        this.updateSelectedTrick(this.$refs.selector.selectedIndex);
        break;
      }
      case TrickSelectorType.MULTIPLE_TRICKS: {
        this.updateIncludedTricks(this.$refs.multipleSelector.includedTricks.slice());
        break;
      }
    }
  }

  private updateSelectedTrick(selectedTrick: number): void {
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
  }

  private updateIncludedTricks(includedTricks: boolean[]): void {
    this.includedTricks = includedTricks;
  }

  private startButtonPressed(): void {
    this.$emit('start', this.includedTricks);
  }

  // Hooks
  mounted(): void {
    this.updateSelectorType(this.trickSelectorType);
  }

  render(): VNode {
    const elements: VNode[] = [];

    elements.push(this.$createElement('legend', 'Options'));

    elements.push(this.$createElement('radioGroup', {
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

    elements.push(this.$createElement('br'));
    elements.push(this.$createElement('br'));

    elements.push(this.$createElement('selector', {
      ref: this.selectorRef,
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
        change: this.updateSelectedTrick,
      },
    }));

    elements.push(this.$createElement('multipleSelector', {
      ref: this.multipleSelectorRef,
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

    elements.push(this.$createElement('br'));
    elements.push(this.$createElement('br'));

    const startButton = this.$createElement('button', {
      attrs: {
        disabled: !this.atLeastOneTrickIncluded,
      },
      on: {
        click: this.startButtonPressed,
      },
    }, 'Start!');
    elements.push(startButton);

    return this.$createElement('fieldset', elements);
  }
}
