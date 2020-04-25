import Vue, { VNode } from 'vue';
import Component from 'vue-class-component';

import { TRICK_GENERATORS, QuestionGenerator } from '../../util/question_generators/generators';
import BasicOperationSelectorComponent from './basic_operation_selector';
import MultipleTricksSelectorComponent from './multiple_tricks_selector';
import TrickSelectorTypeSelectorComponent, {
  TrickSelectorType,
} from './trick_selector_type_selector';
import SelectorComponent from '../shared/selector';

const TRICK_NAMES: string[] = TRICK_GENERATORS.map((g) => g.name);

const OptionsProps = Vue.extend({
  props: {
    // No props needed
  },
});

@Component({
  components: {
    trickSelectorTypeSelector: TrickSelectorTypeSelectorComponent,
    selector: SelectorComponent,
    multipleSelector: MultipleTricksSelectorComponent,
    basicSelector: BasicOperationSelectorComponent,
  },
})
export default class OptionsComponent extends OptionsProps {
  // $refs override
  private typeSelectorRef = 'typeSelector';
  private selectorRef = 'selector';
  private multipleSelectorRef = 'multipleSelector';
  private basicSelectorRef = 'basicSelector';
  $refs!: {
    typeSelector: TrickSelectorTypeSelectorComponent,
    selector: SelectorComponent,
    multipleSelector: MultipleTricksSelectorComponent,
    basicSelector: BasicOperationSelectorComponent,
  }

  // Data
  includedTricks: QuestionGenerator[] = [];

  // Computed
  get atLeastOneTrickIncluded(): boolean {
    return this.includedTricks.length > 0;
  }

  // Methods
  private trickSelectorType(): TrickSelectorType {
    if (this.$refs.typeSelector) {
      return this.$refs.typeSelector.selectedType;
    } else {
      // If the type selector component hasn't been mounted yet, return any selection type.
      return TrickSelectorType.SINGLE_TRICK;
    }
  }

  private updateSelectorType(): void {
    switch (this.trickSelectorType()) {
      case TrickSelectorType.SINGLE_TRICK:
      case TrickSelectorType.ALL_TRICKS_UP_TO: {
        this.updateSelectedTrick(this.$refs.selector.selectedIndex);
        break;
      }
      case TrickSelectorType.MULTIPLE_TRICKS: {
        this.updateIncludedTricks(this.$refs.multipleSelector.includedTricks.slice());
        break;
      }
      case TrickSelectorType.BASIC: {
        this.setGenerator(this.$refs.basicSelector.selectedGenerator);
        break;
      }
    }
  }

  private updateSelectedTrick(selectedTrick: number): void {
    this.includedTricks = [];
    switch (this.trickSelectorType()) {
      case TrickSelectorType.SINGLE_TRICK:
        this.includedTricks.push(TRICK_GENERATORS[selectedTrick]);
        break;
      case TrickSelectorType.ALL_TRICKS_UP_TO:
        for (let i = 0; i <= selectedTrick; ++i) {
          this.includedTricks.push(TRICK_GENERATORS[i]);
        }
        break;
      default:
        throw new Error(
          `updateSelectedTrick should only be called if the trick selection type is SINGLE_TRICK
          or ALL_TRICKS_UP_TO`);
    }
  }

  private updateIncludedTricks(includedTricks: boolean[]): void {
    this.includedTricks = [];
    for (let i = 0; i <= includedTricks.length; ++i) {
      if (includedTricks[i]) {
        this.includedTricks.push(TRICK_GENERATORS[i]);
      }
    }
  }

  private setGenerator(generator: QuestionGenerator|null): void {
    this.includedTricks = [];
    if (generator) {
      this.includedTricks.push(generator);
    }
  }

  private startButtonPressed(): void {
    this.$emit('start', this.includedTricks);
  }

  // Hooks
  mounted(): void {
    this.updateSelectorType();
  }

  render(): VNode {
    const elements: VNode[] = [];

    elements.push(this.$createElement('trickSelectorTypeSelector', {
      ref: this.typeSelectorRef,
      on: {
        change: this.updateSelectorType,
      },
    }));

    elements.push(this.$createElement('br'));

    const trickSelectorLegend: VNode = this.$createElement('legend', 'Trick Selection');
    const singleTrickSelector: VNode = this.$createElement('selector', {
      ref: this.selectorRef,
      props: {
        optionsArray: TRICK_NAMES,
      },
      attrs: {
        hidden: ![
          TrickSelectorType.SINGLE_TRICK,
          TrickSelectorType.ALL_TRICKS_UP_TO,
        ].includes(this.trickSelectorType()),
      },
      on: {
        change: this.updateSelectedTrick,
      },
    });
    const multipleTrickSelector: VNode = this.$createElement('multipleSelector', {
      ref: this.multipleSelectorRef,
      props: {
        optionsArray: TRICK_NAMES,
      },
      attrs: {
        hidden: this.trickSelectorType() !== TrickSelectorType.MULTIPLE_TRICKS,
      },
      on: {
        updateIncludedTricks: this.updateIncludedTricks,
      },
    });
    const basicOperationSelector: VNode = this.$createElement('basicSelector', {
      ref: this.basicSelectorRef,
      attrs: {
        hidden: this.trickSelectorType() !== TrickSelectorType.BASIC,
      },
      on: {
        change: this.setGenerator,
      },
    });
    const trickSelectionFieldSet: VNode = this.$createElement('fieldset', {
      class: {
        flex: true,
      },
    }, [
      trickSelectorLegend,
      singleTrickSelector,
      multipleTrickSelector,
      basicOperationSelector,
    ]);
    elements.push(trickSelectionFieldSet);

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

    return this.$createElement('div', elements);
  }
}
