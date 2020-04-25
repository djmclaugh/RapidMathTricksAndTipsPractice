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
  BASIC,
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
    return this.$createElement('radioGroup', {
      class: {
        flex: true,
      },
      props: {
        name: 'selector_type',
        legend: 'Trick Selection Type',
        values: [
          TrickSelectorType[TrickSelectorType.SINGLE_TRICK],
          TrickSelectorType[TrickSelectorType.ALL_TRICKS_UP_TO],
          TrickSelectorType[TrickSelectorType.MULTIPLE_TRICKS],
          TrickSelectorType[TrickSelectorType.BASIC],
        ],
        valueDisplayNames: [
          'Single Trick',
          'All Tricks Up To',
          'Multiple Tricks',
          'Tables',
        ],
        initialValue: TrickSelectorType[this.selectedType],
      },
      on: {
        change: this.processChange,
      },
    });
  }
}
