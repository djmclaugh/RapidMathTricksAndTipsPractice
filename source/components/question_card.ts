import Vue, { CreateElement, VNode } from "vue";
import { Question, QuestionType, getBooleanAnswer, getNumberAnswer, QUESTION_TYPES_WITH_BOOLEAN_ANSWER, QUESTION_TYPES_WITH_NUMBER_ANSWER } from "../util/question";

const answerInputRef = "QUESTIONT_CARD_COMPONENT_ANSWER";

enum InputType {
  NUMBER,
  POSSIBLY_CORRECT_OR_DEFINITLY_INCORRECT,
}

function assertNever(x: never): never {
    throw new Error("Unexpected object: " + x);
}

function stringForQuestion(question: Question): string {
  const operands = question.operands;
  switch(question.type) {
    case QuestionType.ADDITION:
      return `${operands[0]} + ${operands[1]}`;
    case QuestionType.SUBTRACTION:
      return `${operands[0]} - ${operands[1]}`;
    case QuestionType.MULTIPLICATION:
      return `${operands[0]} * ${operands[1]}`;
    case QuestionType.DIVISION:
      return `${operands[0]} / ${operands[1]}`;
    case QuestionType.MULTIPLICATION_DIGIT_SUM_CHECK:
      return `${operands[0]} * ${operands[1]} ≟ ${operands[2]}`;
    case QuestionType.DIVISION_DIGIT_SUM_CHECK:
      return `${operands[0]} / ${operands[1]} ≟ ${operands[2]}`;
    default:
      return assertNever(question.type);
  }
}

function inputTypeForQuestion(question: Question): InputType {
  switch(question.type) {
    case QuestionType.ADDITION:
    case QuestionType.SUBTRACTION:
    case QuestionType.MULTIPLICATION:
    case QuestionType.DIVISION:
      return InputType.NUMBER;
    case QuestionType.MULTIPLICATION_DIGIT_SUM_CHECK:
    case QuestionType.DIVISION_DIGIT_SUM_CHECK:
      return InputType.POSSIBLY_CORRECT_OR_DEFINITLY_INCORRECT;
    default:
      return assertNever(question.type);
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
    questionData: Object,
    id: Number,
  },
  computed: {
    question(): Question {
      return this.questionData as Question;
    },
    questionInputType(): InputType {
      return inputTypeForQuestion(this.question);
    },
    questionText(): string {
      return stringForQuestion(this.question);
    },
    icon(): string|undefined {
      if (this.numberOfAttempts == 0) {
        return undefined;
      }
      return this.isSolved ? "✓" : "✗";
    },
  },
  methods: {
    checkAnswer(event: any): void {
      this.numberOfAttempts += 1;
      let isCorrect: boolean;

      switch(this.questionInputType) {
        case InputType.NUMBER:
          const numberValue = event.target.valueAsNumber;
          isCorrect = numberValue === getNumberAnswer(this.question);
          break;
        case InputType.POSSIBLY_CORRECT_OR_DEFINITLY_INCORRECT:
          const boolValue = event.target.value === "true";
          isCorrect = boolValue === getBooleanAnswer(this.question);
          break;
        default:
          return assertNever(this.questionInputType);
      }

      if (isCorrect) {
        this.isSolved = true;
        this.$emit("correct", this.numberOfAttempts);
      } else {
        this.$emit("incorrect", this.numberOfAttempts);
        if (this.$refs[answerInputRef]) {
          const answerInput: HTMLInputElement = this.$refs[answerInputRef] as HTMLInputElement;
          answerInput.select();
        }
      }
    },
    getCorrectnessClass() {
      return {
        incorrect: this.numberOfAttempts > 0 && !this.isSolved,
        correct: this.isSolved
      };
    },
    getInputOn() {
      return {
        change: this.checkAnswer
      };
    },
    createInputNode(createElement: CreateElement): VNode {
      switch(this.questionInputType) {
        case InputType.NUMBER:
          return this.createNumberInputNode(createElement);
        case InputType.POSSIBLY_CORRECT_OR_DEFINITLY_INCORRECT:
          return this.createPossiblyCorrectOrDefinitlyIncorrectInputNode(createElement);
        default:
          assertNever(this.questionInputType);
      }
    },
    createNumberInputNode(createElement: CreateElement): VNode {
      return createElement("input", {
        ref: answerInputRef,
        class: this.getCorrectnessClass(),
        attrs: {
          id: "answer_" + this.id,
          type: "number",
          step: "any",
          disabled: this.isSolved
        },
        on: this.getInputOn(),
      });
    },
    createPossiblyCorrectOrDefinitlyIncorrectInputNode(createElement: CreateElement): VNode {
      const label1 = createElement("label", {
        attrs: {
          for: "possibly_correct_button_" + this.id,
        }
      }, "Possibly Correct");
      const option1 = createElement("input", {
        class: this.getCorrectnessClass(),
        attrs: {
          id: "possibly_correct_button_" + this.id,
          name: "answer_" + this.id,
          type: "radio",
          value: "true",
          disabled: this.isSolved
        },
        on: this.getInputOn(),
      });

      const label2 = createElement("label", {
        attrs: {
          for: "definitly_incorect_button_" + this.id,
        }
      }, "Definitly Incorrect");
      const option2 = createElement("input", {
        class: this.getCorrectnessClass(),
        attrs: {
          id: "definitly_incorect_button_" + this.id,
          name: "answer_" + this.id,
          type: "radio",
          value: "false",
          disabled: this.isSolved
        },
        on: this.getInputOn(),
      });

      return createElement("span", {
        class: {
          nobreak: true
        }
      }, [label1, option1, label2, option2]);
    },
  },
  mounted(): void {
    if (this.$refs[answerInputRef]) {
      const answerInput: HTMLElement = this.$refs[answerInputRef] as HTMLElement;
      answerInput.focus();
    }
  },
  render(createElement): VNode {
    const elements: VNode[] = [];

    const questionTextNode: VNode = createElement("label", {
      attrs: {
        for: "answer_" + this.id
      }
    }, this.questionText + ": ");
    elements.push(questionTextNode);

    elements.push(this.createInputNode(createElement));

    for (let i = 0; i < this.numberOfAttempts - 1; ++i) {
      const resultIcon: VNode = createElement("span", {
        class: {
          incorrect: true,
        }
      }, "✗")
      elements.push(resultIcon);
    }
    if (this.numberOfAttempts > 0) {
      const resultIcon: VNode = createElement("span", {
        class: this.getCorrectnessClass()
      }, this.icon)
      elements.push(resultIcon);
    }

    return createElement("div", elements);
  },
});
