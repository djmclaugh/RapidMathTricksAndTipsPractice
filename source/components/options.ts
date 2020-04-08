import Vue, { VNode } from "vue";
import { GENERATORS } from "../util/question_generators/generators";

const TRICK_NAMES: string[] = [
  "Multiplying and dividing with zeroes",
  "Multiplying and dividing with decimal points",
  "Multiplying by 4",
  "Dividing by 4",
  "Multiplying by 5",
  "Dividing by 5",
  "Square a number ending in 5",
  "Multiply 2 digits by 11",
  "Multiplying by 25",
  "Dividing by 25",
  "Multiplying a one/two digit number by 99",
  "Multiplying a one/two digit number by 101",
  "Multiplying two numbers whose difference is 2",
];

if (TRICK_NAMES.length < GENERATORS.length) {
  throw new Error("Some tricks are missing display names");
}

export const OptionsComponent = Vue.extend({
  data: function() {
    return {
      // Create an array with GENERATORS.length elements, all initialized to false.
      includeTrick: GENERATORS.map(() => false),
    }
  },
  computed: {
    atLeastOneTrickIncluded(): boolean {
      for (const isTrickIncluded of this.includeTrick) {
        if (isTrickIncluded) {
          return true;
        }
      }
      return false;
    },
  },
  methods: {
    processCheckbox(event: any): void {
      const index = parseInt(event.target.value);
      Vue.set(this.includeTrick, index, event.target.checked);
    },
    startButtonPressed(event: any): void {
      this.$emit("start", this.includeTrick);
    },
  },
  render(createElement): VNode {
    const elements: VNode[] = [];

    elements.push(createElement("legend", "Options"));

    for (let i = 0; i < this.includeTrick.length; ++i) {
      const checkbox: VNode = createElement("input", {
        attrs: {
          id: "include_trick_" + i,
          type: "checkbox",
          checked: this.includeTrick[i],
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
      }, (i + 1) + ". " + TRICK_NAMES[i]);

      elements.push(createElement("div", [checkbox, label]));
    }

    const startButton = createElement("button", {
      attrs: {
        disabled: !this.atLeastOneTrickIncluded,
      },
      on: {
        click: this.startButtonPressed,
      }
    }, "Start!")
    elements.push(startButton);

    return createElement("fieldset", elements);
  },
});
