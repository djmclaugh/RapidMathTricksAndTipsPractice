import Vue, { CreateElement, VNode } from "vue";
import { Question, QuestionType, getBooleanAnswer, getNumberAnswer, QUESTION_TYPES_WITH_BOOLEAN_ANSWER, QUESTION_TYPES_WITH_NUMBER_ANSWER } from "../util/question";
import { RadioGroupComponent } from "./shared/radio_group";

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
    case QuestionType.SUM:
      return operands.join(" + ");
    case QuestionType.ARITHMETIC_PROGRESSION_SUM:
      // Initial terms
      const a = operands[0];
      // Difference between terms
      const d = operands[1];
      // Number of terms
      const n = operands[2];
      if (operands[2] > 6) {
        return [a, a + d, a + (2 * d)].join(" + ") + " + ... + " + (a + ((n - 1) * d));
      } else {
        let text = "" + a;
        for (let i = 1; i < n; ++i) {
          text += " + " + (a + (i * d));
        }
        return text;
      }
      return operands.join(" + ");
    case QuestionType.SUBTRACTION:
      return operands.join(" - ");
    case QuestionType.MULTIPLICATION:
      return operands.join(" * ");
    case QuestionType.DIVISION:
      return operands.join(" / ");
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
    case QuestionType.SUM:
    case QuestionType.ARITHMETIC_PROGRESSION_SUM:
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
  components: {
    radioGroup: RadioGroupComponent,
  },
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
    processNumberAnswer(event: any): void {
      this.checkAnswer(event.target.valueAsNumber);
    },
    processBooleanAnswer(selection: string): void {
      this.checkAnswer(selection === "true");
    },
    checkAnswer(answer: boolean|number): void {
      this.numberOfAttempts += 1;
      let isCorrect: boolean;

      switch(this.questionInputType) {
        case InputType.NUMBER:
          isCorrect = answer === getNumberAnswer(this.question);
          break;
        case InputType.POSSIBLY_CORRECT_OR_DEFINITLY_INCORRECT:
          isCorrect = answer === getBooleanAnswer(this.question);
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
        on: {
          change: this.processNumberAnswer
        },
      });
    },
    createPossiblyCorrectOrDefinitlyIncorrectInputNode(createElement: CreateElement): VNode {
      return createElement("radioGroup", {
        props: {
          name: "answer_" + this.id,
          values: [
            "true",
            "false",
          ],
          valueDisplayNames: [
            "Possibly Correct",
            "Definitly Incorrect",
          ],
          disabled: this.isSolved,
        },
        on: {
          change: this.processBooleanAnswer,
        },
      });
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
