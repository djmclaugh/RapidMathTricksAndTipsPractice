import Vue, { CreateElement, VNode } from 'vue';
import Component from 'vue-class-component';

const SingleTrickSelectorProps = Vue.extend({
  props: {
    optionsArray: Array,
  },
});

@Component
export default class SingleTrickSelectorComponent extends SingleTrickSelectorProps {
  // Data
  selectedTrick: number = 0;

  // Computed
  get options(): string[] {
    return this.optionsArray.map((x) => '' + x);
  }

  // Methods
  private processChange(event: any): void {
    this.selectedTrick = parseInt(event.target.value);
    this.$emit('updateSelectedTrick', this.selectedTrick);
  }

  private createOptionElement(index: number): VNode {
    return this.$createElement('option', {
      attrs: {
        value: index,
        selected: this.selectedTrick === index,
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
      attrs: {
        id: 'trick_selector',
      },
      on: {
        change: this.processChange,
      },
    }, optionElements);
  }
}
