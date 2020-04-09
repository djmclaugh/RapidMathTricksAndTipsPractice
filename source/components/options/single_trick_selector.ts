import Vue, { VNode } from "vue";

export const SingleTrickSelectorComponent = Vue.extend({
  data: function() {
    return {
      selectedTrick: 0,
    }
  },
  props: {
    optionsArray: Array
  },
  computed: {
    options(): string[] {
      return this.optionsArray.map((x) => '' + x);
    }
  },
  methods: {
    processChange(event: any): void {
      this.selectedTrick = parseInt(event.target.value);
      this.$emit("updateSelectedTrick", this.selectedTrick);
    },
  },
  render(createElement): VNode {
    const optionElements: VNode[] = [];

    for (let i = 0; i < this.options.length; ++i) {
      optionElements.push(createElement("option", {
        attrs: {
          value: i
        }
      }, (i + 1) + ". " + this.options[i]))
    }

    return createElement("select", {
      attrs: {
        id: "trick_selector",
      },
      on: {
        change: this.processChange,
      }
    }, optionElements);
  }
});
