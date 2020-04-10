import Vue, { VNode } from "vue";
import { GENERATORS } from "../../util/question_generators/generators";
import { SingleTrickSelectorComponent } from "./single_trick_selector";
import { MultipleTricksSelectorComponent } from "./multiple_tricks_selector";

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
  "Check multiplications and divisions",
  "Multiplying by 125",
  "Dividing by 125",
  "Multiplying by 9",
  "Multiplying by 12",
  "Multiplying by 15",
  "Multiplying numbers with a special relationship",
  "Multiplying by x.5",
  "Dividing by x.5",
  "Square two digit number starting with a 5",
  "Square two digit number ending with a 1",
  "Two digit numbers",
  "Multiplying two numbers whose difference is 4",
];

enum TrickSelectorType {
  SINGLE_TRICK,
  ALL_TRICKS_UP_TO,
  MULTIPLE_TRICKS,
}

const singleSelectorRef = "single_selector_ref";
const multipleSelectorRef = "multiple_selector_ref";

if (TRICK_NAMES.length < GENERATORS.length) {
  throw new Error("Some tricks are missing display names");
}

export const OptionsComponent = Vue.extend({
  components: {
    singleSelector: SingleTrickSelectorComponent,
    multipleSelector: MultipleTricksSelectorComponent,
  },
  data: function() {
    return {
      // Create an array with GENERATORS.length elements, all initialized to false.
      includedTricks: GENERATORS.map(() => false),
      trickSelectorType: TrickSelectorType.SINGLE_TRICK,
    }
  },
  computed: {
    atLeastOneTrickIncluded(): boolean {
      for (const isTrickIncluded of this.includedTricks) {
        if (isTrickIncluded) {
          return true;
        }
      }
      return false;
    },
  },
  methods: {
    processSelectorTypeSelection(event: any): void {
      this.updateSelectorType(parseInt(event.target.value));
    },
    updateSelectorType(type: TrickSelectorType): void {
      this.trickSelectorType = type;
      switch(this.trickSelectorType) {
        case TrickSelectorType.SINGLE_TRICK:
        case TrickSelectorType.ALL_TRICKS_UP_TO:
          const singleTrickComponent: any = this.$refs[singleSelectorRef];
          this.updateSelectedTrick(singleTrickComponent.selectedTrick);
          break;
        case TrickSelectorType.MULTIPLE_TRICKS:
          const multipleTricksComponent: any = this.$refs[multipleSelectorRef];
          this.updateIncludedTricks(multipleTricksComponent.includedTricks.slice())
          break;
      }
    },
    updateSelectedTrick(selectedTrick: number): void {
      this.includedTricks = GENERATORS.map(() => false);
      switch (this.trickSelectorType) {
        case TrickSelectorType.SINGLE_TRICK:
          this.includedTricks[selectedTrick] = true;
          break;
        case TrickSelectorType.ALL_TRICKS_UP_TO:
          for (let i = 0; i <= selectedTrick; ++i) {
            this.includedTricks[i] = true;
          }
          break;
        default:
          throw new Error("updateSelectedTrick should only be called if the trick selection type is SINGLE_TRICK or ALL_TRICKS_UP_TO");
      }
    },
    updateIncludedTricks(includedTricks: boolean[]): void {
      this.includedTricks = includedTricks;
    },
    startButtonPressed(event: any): void {
      this.$emit("start", this.includedTricks);
    },
  },
  mounted(): void {
    this.updateSelectorType(this.trickSelectorType);
  },
  render(createElement): VNode {
    const elements: VNode[] = [];

    elements.push(createElement("legend", "Options"));

    elements.push(createElement("input", {
      attrs: {
        id: "selector_type_single_trick_radio",
        name: "selector_type",
        type: "radio",
        value: TrickSelectorType.SINGLE_TRICK,
        checked: this.trickSelectorType == TrickSelectorType.SINGLE_TRICK,
      },
      on: {
        change: this.processSelectorTypeSelection,
      },
    }));
    elements.push(createElement("label", {
      attrs: {
        for: "selector_type_single_trick_radio",
      }
    }, "Practice Single Trick"));

    elements.push(createElement("input", {
      attrs: {
        id: "selector_type_all_tricks_up_to_radio",
        name: "selector_type",
        type: "radio",
        value: TrickSelectorType.ALL_TRICKS_UP_TO,
        checked: this.trickSelectorType == TrickSelectorType.ALL_TRICKS_UP_TO,
      },
      on: {
        change: this.processSelectorTypeSelection,
      },
    }));
    elements.push(createElement("label", {
      attrs: {
        for: "selector_type_all_tricks_up_to_radio",
      }
    }, "Practice All Tricks Up To"));

    elements.push(createElement("input", {
      attrs: {
        id: "selector_type_multiple_tricks_radio",
        name: "selector_type",
        type: "radio",
        value: TrickSelectorType.MULTIPLE_TRICKS,
        checked: this.trickSelectorType == TrickSelectorType.MULTIPLE_TRICKS,
      },
      on: {
        change: this.processSelectorTypeSelection,
      },
    }));
    elements.push(createElement("label", {
      attrs: {
        for: "selector_type_multiple_tricks_radio",
      }
    }, "Practice Multiple Tricks"));

    elements.push(createElement("br"));

    elements.push(createElement("singleSelector", {
      ref: singleSelectorRef,
      props: {
        optionsArray: TRICK_NAMES,
      },
      attrs: {
        hidden: ![
          TrickSelectorType.SINGLE_TRICK,
          TrickSelectorType.ALL_TRICKS_UP_TO
        ].includes(this.trickSelectorType),
      },
      on: {
        updateSelectedTrick: this.updateSelectedTrick
      },
    }));

    elements.push(createElement("multipleSelector", {
      ref: multipleSelectorRef,
      props: {
        optionsArray: TRICK_NAMES,
      },
      attrs: {
        hidden: this.trickSelectorType !== TrickSelectorType.MULTIPLE_TRICKS,
      },
      on: {
        updateIncludedTricks: this.updateIncludedTricks
      },
    }));

    elements.push(createElement("br"));

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
