import Vue, { CreateElement, VNode } from 'vue';
import Component from 'vue-class-component';

const SelectorProps = Vue.extend({
  props: {
    optionsArray: {
      type: Array,
      required: true,
    },
  },
});

@Component
export default class SelectorComponent extends SelectorProps {
  // Data
  selectedIndex: number = 0;

  // Computed
  get options(): string[] {
    return this.optionsArray.map((x) => '' + x);
  }

  // Methods
  private processChange(event: any): void {
    this.selectedIndex = parseInt(event.target.value);
    this.$emit('change', this.selectedIndex);
  }

  private createOptionElement(index: number): VNode {
    return this.$createElement('option', {
      attrs: {
        value: index,
        selected: this.selectedIndex === index,
      },
    }, (index + 1) + '. ' + this.options[index]);
  }

  // Hooks
  render(createElement: CreateElement): VNode {
    const optionElements: VNode[] = [];

    for (let i = 0; i < this.options.length; ++i) {
      optionElements.push(this.createOptionElement(i));
    }

    return createElement('select', {
      on: {
        change: this.processChange,
      },
    }, optionElements);
  }
}
