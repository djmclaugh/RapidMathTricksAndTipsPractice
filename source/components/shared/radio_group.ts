import Vue, { VNode } from 'vue';

export const RadioGroupComponent = Vue.extend({
  props: {
    name: String,
    values: Array,
    valueDisplayNames: Array,
    initialValue: String,
    disabled: Boolean,
  },
  data: function() {
    return {
      selectedValue: this.initialValue,
    };
  },
  methods: {
    processSelection(event: any): void {
      this.selectedValue = event.target.value;
      this.$emit('change', this.selectedValue);
    },
  },
  render(createElement): VNode {
    const elements: VNode[] = [];

    for (let i = 0; i < this.values.length; ++i) {
      const value = this.values[i];
      const buttonId = [this.name, value, 'radio_button'].join('_');

      const inputElement = createElement('input', {
        attrs: {
          id: buttonId,
          name: this.name,
          type: 'radio',
          value: value,
          checked: this.selectedValue === value,
          disabled: this.disabled,
        },
        on: {
          change: this.processSelection,
        },
      });

      const labelElement = createElement('label', {
        attrs: {
          for: buttonId,
        },
      }, this.valueDisplayNames[i] as string);

      elements.push(createElement('span', {
        class: {
          nobreak: true,
        },
      }, [inputElement, labelElement]));
    }

    return createElement('span', elements);
  },
});
