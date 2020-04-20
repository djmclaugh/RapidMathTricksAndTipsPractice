import Vue, { VNode } from 'vue';
import Component from 'vue-class-component';

import RadioGroupComponent from '../shared/radio_group';

const TrickSelectorTypeSelectorProps = Vue.extend({
  props: {
    // No props
  },
});

export enum TrickSelectorType {
  SINGLE_TRICK,
  ALL_TRICKS_UP_TO,
  MULTIPLE_TRICKS,
}

@Component({
  components: {
    radioGroup: RadioGroupComponent,
  },
})
export default class TrickSelectorTypeSelectorComponent extends TrickSelectorTypeSelectorProps {
  // Data
  selectedType: TrickSelectorType = TrickSelectorType.SINGLE_TRICK;

  // Computed

  // Methods
  private processChange(selection: keyof typeof TrickSelectorType): void {
    this.selectedType = TrickSelectorType[selection];
    this.$emit('change', this.selectedType);
  }

  // Hooks
  render(): VNode {
    const legend = this.$createElement('legend', 'Trick Selection Type');

    const radioGroup = this.$createElement('radioGroup', {
      props: {
        name: 'selector_type',
        values: [
          TrickSelectorType[TrickSelectorType.SINGLE_TRICK],
          TrickSelectorType[TrickSelectorType.ALL_TRICKS_UP_TO],
          TrickSelectorType[TrickSelectorType.MULTIPLE_TRICKS],
        ],
        valueDisplayNames: [
          'Single Trick',
          'All Tricks Up To',
          'Multiple Tricks',
        ],
        initialValue: TrickSelectorType[this.selectedType],
      },
      on: {
        change: this.processChange,
      },
    });

    return this.$createElement('fieldset', [legend, radioGroup]);
  }
}
