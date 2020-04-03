import Vue, { VNode } from "vue";
import { Question, QuestionType, getAnwser } from "../util/question";

const anwserInputRef = "QUESTIONT_CARD_COMPONENT_ANWSER";

function assertNever(x: never): never {
    throw new Error("Unexpected object: " + x);
}

function symboleForQuestionType(type: QuestionType): string {
  switch(type) {
    case QuestionType.ADDITION:
      return "+";
    case QuestionType.SUBTRACTION:
      return "-";
    case QuestionType.MULTIPLICATION:
      return "*";
    case QuestionType.DIVISION:
      return "/";
    default:
      return assertNever(type);
  }
}

export const QuestionCardComponent = Vue.extend({
  data: function() {
    return {
      isSolved: false,
      numberOfAttempts: 0
    }
  },
  props: {
    questionData: Object
  },
  computed: {
    question(): Question {
      return this.questionData as Question;
    },
    anwser(): number {
      return getAnwser(this.question);
    },
    questionText(): string {
      const operands = this.question.operands;
      return operands[0] + " " + symboleForQuestionType(this.question.type) + " " + operands[1];
    },
    borderColor(): string|undefined {
      if (this.numberOfAttempts == 0) {
        return undefined;
      }
      return this.isSolved ? "green" : "red";
    },
    icon(): string|undefined {
      if (this.numberOfAttempts == 0) {
        return undefined;
      }
      return this.isSolved ? "✓" : "✗";
    }
  },
  methods: {
    checkAnwser(event: any): void {
      this.numberOfAttempts += 1;
      const value = event.target.valueAsNumber;
      if (value == this.anwser) {
        this.isSolved = true;
        this.$emit("correct", this.numberOfAttempts);
      } else {
        this.$emit("incorrect", this.numberOfAttempts);
        const anwserInput: HTMLInputElement = this.$refs[anwserInputRef] as HTMLInputElement;
        anwserInput.select();
      }
    }
  },
  mounted(): void {
    const anwserInput: HTMLElement = this.$refs[anwserInputRef] as HTMLElement;
    anwserInput.focus();
  },
  render(createElement): VNode {
    const elements: VNode[] = [];

    const questionTextNode: VNode = createElement("label", {
      attrs: {
        for: "anwser"
      }
    }, this.questionText + ": ");
    elements.push(questionTextNode);

    const anwserNode: VNode = createElement("input", {
      ref: anwserInputRef,
      style: {
        "border-color": this.borderColor
      },
      attrs: {
        id: "anwser",
        type: "number",
        step: "any",
        disabled: this.isSolved
      },
      on: {
        change: this.checkAnwser
      }
    });
    elements.push(anwserNode)

    for (let i = 0; i < this.numberOfAttempts - 1; ++i) {
      const resultIcon: VNode = createElement("span", {
        style: {
          color: "red",
          "margin-left": "8px"
        }
      }, "✗")
      elements.push(resultIcon);
    }
    if (this.numberOfAttempts > 0) {
      const resultIcon: VNode = createElement("span", {
        style: {
          color: this.borderColor,
          "margin-left": "8px"
        }
      }, this.icon)
      elements.push(resultIcon);
    }

    return createElement("div", elements);
  },
});
