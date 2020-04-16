import Vue, { VNode } from 'vue';
import Component from 'vue-class-component';

const MultipleTricksSelectorProps = Vue.extend({
  props: {
    optionsArray: {
      type: Array,
      required: true,
    },
  },
});

@Component
export default class MultipleTricksSelectorComponent extends MultipleTricksSelectorProps {
  // Data
  includedTricks: boolean[] = this.optionsArray.map(() => false);

  // Computed
  get options(): string[] {
    return this.optionsArray.map((x) => '' + x);
  }

  // Methods
  private processCheckbox(event: any): void {
    const index = parseInt(event.target.value);
    this.includedTricks[index] = event.target.checked;
    this.$emit('updateIncludedTricks', this.includedTricks.slice());
  }

  private createCheckBoxWithLabel(index: number): VNode {
    const checkbox: VNode = this.$createElement('input', {
      attrs: {
        id: 'include_trick_' + index,
        type: 'checkbox',
        checked: this.includedTricks[index],
        value: index,
      },
      on: {
        change: this.processCheckbox,
      },
    });
    const label: VNode = this.$createElement('label', {
      attrs: {
        for: 'include_trick_' + index,
      },
    }, (index + 1) + '. ' + this.options[index]);
    return this.$createElement('div', [checkbox, label]);
  }

  // Hooks
  render(): VNode {
    const elements: VNode[] = [];

    for (let i = 0; i < this.includedTricks.length; ++i) {
      elements.push(this.createCheckBoxWithLabel(i));
    }

    return this.$createElement('div', elements);
  }
}
