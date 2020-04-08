import Vue, { VNode } from "vue";
import { Question, QuestionType, getBooleanAnswer, getNumberAnswer, QUESTION_TYPES_WITH_BOOLEAN_ANSWER, QUESTION_TYPES_WITH_NUMBER_ANSWER } from "../util/question";

const answerInputRef = "QUESTIONT_CARD_COMPONENT_ANSWER";

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
    questionText(): string {
      return stringForQuestion(this.question);
    },
    icon(): string|undefined {
      if (this.numberOfAttempts == 0) {
        return undefined;
      }
      return this.isSolved ? "✓" : "✗";
    }
  },
  methods: {
    checkAnswer(event: any): void {
      this.numberOfAttempts += 1;
      let isCorrect: boolean;

      const type: QuestionType = this.question.type;
      if (QUESTION_TYPES_WITH_NUMBER_ANSWER.includes(type)) {
        const value = event.target.valueAsNumber;
        isCorrect = value === getNumberAnswer(this.question);
      } else if (QUESTION_TYPES_WITH_BOOLEAN_ANSWER.includes(type)) {
        throw new Error(`checkAnswer does not know how to verify questions that expect a boolan answer`);
      } else {
        throw new Error(`checkAnswer does not know how to verify questions of type ${type}`);
      }

      if (isCorrect) {
        this.isSolved = true;
        this.$emit("correct", this.numberOfAttempts);
      } else {
        this.$emit("incorrect", this.numberOfAttempts);
        const answerInput: HTMLInputElement = this.$refs[answerInputRef] as HTMLInputElement;
        answerInput.select();
      }
    }
  },
  mounted(): void {
    const answerInput: HTMLElement = this.$refs[answerInputRef] as HTMLElement;
    answerInput.focus();
  },
  render(createElement): VNode {
    const elements: VNode[] = [];

    const questionTextNode: VNode = createElement("label", {
      attrs: {
        for: "answer"
      }
    }, this.questionText + ": ");
    elements.push(questionTextNode);

    const answerNode: VNode = createElement("input", {
      ref: answerInputRef,
      class: {
        incorrect: this.numberOfAttempts > 0 && !this.isSolved,
        correct: this.isSolved
      },
      attrs: {
        id: "answer",
        type: "number",
        step: "any",
        disabled: this.isSolved
      },
      on: {
        change: this.checkAnswer
      }
    });
    elements.push(answerNode)

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
        class: {
          incorrect: this.numberOfAttempts > 0 && !this.isSolved,
          correct: this.isSolved
        }
      }, this.icon)
      elements.push(resultIcon);
    }

    return createElement("div", elements);
  },
});
