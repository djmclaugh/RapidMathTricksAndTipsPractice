import Vue, { VNode } from "vue";

export const MultipleTricksSelectorComponent = Vue.extend({
  props: {
    optionsArray: Array
  },
  data: function() {
    return {
      includedTricks: this.optionsArray.map((x) => false),
    }
  },
  computed: {
    options(): string[] {
      return this.optionsArray.map((x) => '' + x);
    }
  },
  methods: {
    processCheckbox(event: any): void {
      const index = parseInt(event.target.value);
      this.includedTricks[index] = event.target.checked;
      this.$emit("updateIncludedTricks", this.includedTricks.slice())
    },
  },
  render(createElement): VNode {
    const elements: VNode[] = [];

    for (let i = 0; i < this.includedTricks.length; ++i) {
      const checkbox: VNode = createElement("input", {
        attrs: {
          id: "include_trick_" + i,
          type: "checkbox",
          checked: this.includedTricks[i],
          value: i,
        },
        on: {
          change: this.processCheckbox
        }
      });
      const label: VNode = createElement("label", {
        attrs: {
          for: "include_trick_" + i
        },
      }, (i + 1) + ". " + this.options[i]);

      elements.push(createElement("div", [checkbox, label]));
    }

    return createElement("div", elements);
  },
});
