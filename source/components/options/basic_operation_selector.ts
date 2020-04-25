import Vue, { VNode } from 'vue';
import Component from 'vue-class-component';

import { QuestionGenerator, BASIC_GENERATORS } from '../../util/question_generators/generators';
import RadioGroupComponent from '../shared/radio_group';

const BasicOperationSelectorProps = Vue.extend({
  // No props
});

@Component({
  components: {
    radioGroup: RadioGroupComponent,
  },
})
export default class BasicOperationSelectorComponent extends BasicOperationSelectorProps {
  // Data
  selectedType: 'add'|'mult'|'square' = 'add';
  selectedMin: number = 1;
  selectedMax: number = 12;

  // Computed
  get selectedGenerator(): QuestionGenerator {
    switch (this.selectedType) {
      case 'add':
        return BASIC_GENERATORS.additonTable(this.selectedMin, this.selectedMax);
      case 'mult':
        return BASIC_GENERATORS.multiplicationTable(this.selectedMin, this.selectedMax);
      case 'square':
        return BASIC_GENERATORS.squares(this.selectedMin, this.selectedMax);
    }
  }

  // Methods
  typeChange(value: 'add'|'mult'|'square'): void {
    this.selectedType = value;
    this.onChange();
  }

  minChange(event: any): void {
    this.selectedMin = Number.parseInt(event.target.value);
    this.onChange();
  }

  maxChange(event: any): void {
    this.selectedMax = Number.parseInt(event.target.value);
    this.onChange();
  }

  onChange(): void {
    this.$emit('change', this.selectedGenerator);
  }

  // Hooks
  render(): VNode {
    const radioGroup = this.$createElement('radioGroup', {
      class: {
        flex: true,
      },
      props: {
        name: 'operator',
        legend: 'Operation',
        values: [
          'add',
          'mult',
          'square',
        ],
        valueDisplayNames: [
          'Addition',
          'Multiplication',
          'Square',
        ],
        initialValue: this.selectedType,
      },
      on: {
        change: this.typeChange,
      },
    });

    const minTextNode: VNode = this.$createElement('label', {
      attrs: {
        for: 'min_input',
      },
    }, 'Min:');
    const minInput = this.$createElement('input', {
      attrs: {
        id: 'min_input',
        type: 'number',
        step: 1,
        value: this.selectedMin,
        size: 3,
      },
      on: {
        change: this.minChange,
      },
    });

    const maxTextNode: VNode = this.$createElement('label', {
      attrs: {
        for: 'max_input',
      },
    }, 'Max:');
    const maxInput = this.$createElement('input', {
      attrs: {
        id: 'max_input',
        type: 'number',
        step: 1,
        value: this.selectedMax,
        size: 3,
      },
      on: {
        change: this.maxChange,
      },
    });

    const rangeGroup = this.$createElement('fieldset', {
      class: {
        flex: true,
      },
    },
    [
      this.$createElement('legend', 'Range'),
      this.$createElement('div', [
        minTextNode,
        minInput,
      ]),
      this.$createElement('div', [
        maxTextNode,
        maxInput,
      ]),
    ]);

    return this.$createElement('div', [
      radioGroup,
      this.$createElement('br'),
      rangeGroup,
    ]);
  }
}
