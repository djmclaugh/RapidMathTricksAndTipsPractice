import Vue, { CreateElement, VNode } from 'vue';
import { Operator, Question, QuestionType } from '../util/question';
import RadioGroupComponent from './shared/radio_group';

const answerInputRef = 'QUESTIONT_CARD_COMPONENT_ANSWER';

function assertNever(x: never): never {
  throw new Error('Unexpected object: ' + x);
}

enum InputType {
  NUMBER,
  POSSIBLY_CORRECT_OR_DEFINITLY_INCORRECT,
}

function inputTypeForQuestion(question: Question): InputType {
  if (question.expectsNumberAnswer()) {
    return InputType.NUMBER;
  } else if (question.expectsBooleanAnswer()) {
    return InputType.POSSIBLY_CORRECT_OR_DEFINITLY_INCORRECT;
  }
  throw new Error(`Unsupported input type for question: ${question}`);
}

function symboleForOperator(operator: Operator): string {
  switch (operator) {
    case Operator.ADDITION:
      return '+';
    case Operator.SUBTRACTION:
      return '-';
    case Operator.MULTIPLICATION:
      return '*';
    case Operator.DIVISION:
      return '/';
    default:
      return assertNever(operator);
  }
}

function stringForQuestion(question: Question): string {
  const operands = question.data.operands;
  const operatorSymbole = symboleForOperator(question.data.operator);
  let text = '';
  const operandsToShow = question.numberOfOperandsNeededToUnderstandPattern();
  if (operands.length > 5 && operandsToShow < operands.length) {
    const initialTerms = operands.slice(0, operandsToShow).join(` ${operatorSymbole} `);
    const lastOperand = '' + operands[operands.length - 1];
    text += [initialTerms, '...', lastOperand].join(` ${operatorSymbole} `);
  } else {
    text += operands.join(` ${operatorSymbole} `);
  }
  switch (question.data.type) {
    case QuestionType.RESULT:
      text += ' = ';
      break;
    case QuestionType.ESTIMATE:
      text += ' ≈ ';
      break;
    case QuestionType.DIGIT_CHECK:
      text += ` ?= ${question.data.digitCheckDetails!.proposedResult}`;
      break;
    default:
      return assertNever(question.data.type);
  }
  return text;
}

export const QuestionCardComponent = Vue.extend({
  components: {
    radioGroup: RadioGroupComponent,
  },
  data: function() {
    return {
      isSolved: false,
      numberOfAttempts: 0,
    };
  },
  props: {
    question: Question,
    id: Number,
  },
  computed: {
    questionInputType(): InputType {
      return inputTypeForQuestion(this.question);
    },
    questionText(): string {
      return stringForQuestion(this.question);
    },
    icon(): string|undefined {
      if (this.numberOfAttempts === 0) {
        return undefined;
      }
      return this.isSolved ? '✓' : '✗';
    },
  },
  methods: {
    processNumberAnswer(event: any): void {
      this.checkAnswer(event.target.valueAsNumber);
    },
    processBooleanAnswer(selection: string): void {
      this.checkAnswer(selection === 'true');
    },
    checkAnswer(answer: boolean|number): void {
      this.numberOfAttempts += 1;
      let isCorrect: boolean;

      switch (this.questionInputType) {
        case InputType.NUMBER:
          isCorrect = this.question.checkNumberAnswer(answer as number);
          break;
        case InputType.POSSIBLY_CORRECT_OR_DEFINITLY_INCORRECT:
          isCorrect = this.question.checkBooleanAnswer(answer as boolean);
          break;
        default:
          return assertNever(this.questionInputType);
      }

      if (isCorrect) {
        this.isSolved = true;
        this.$emit('correct', this.numberOfAttempts);
      } else {
        this.$emit('incorrect', this.numberOfAttempts);
        if (this.$refs[answerInputRef]) {
          const answerInput: HTMLInputElement = this.$refs[answerInputRef] as HTMLInputElement;
          answerInput.select();
        }
      }
    },
    getCorrectnessClass() {
      return {
        incorrect: this.numberOfAttempts > 0 && !this.isSolved,
        correct: this.isSolved,
      };
    },
    createInputNode(createElement: CreateElement): VNode {
      switch (this.questionInputType) {
        case InputType.NUMBER:
          return this.createNumberInputNode(createElement);
        case InputType.POSSIBLY_CORRECT_OR_DEFINITLY_INCORRECT:
          return this.createPossiblyCorrectOrDefinitlyIncorrectInputNode(createElement);
        default:
          assertNever(this.questionInputType);
      }
    },
    createNumberInputNode(createElement: CreateElement): VNode {
      return createElement('input', {
        ref: answerInputRef,
        class: this.getCorrectnessClass(),
        attrs: {
          id: 'answer_' + this.id,
          type: 'number',
          step: 'any',
          disabled: this.isSolved,
        },
        on: {
          change: this.processNumberAnswer,
        },
      });
    },
    createPossiblyCorrectOrDefinitlyIncorrectInputNode(createElement: CreateElement): VNode {
      return createElement('radioGroup', {
        class: {
          inline: true,
        },
        props: {
          name: 'answer_' + this.id,
          values: [
            'true',
            'false',
          ],
          valueDisplayNames: [
            'Possibly Correct',
            'Definitly Incorrect',
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

    const questionTextNode: VNode = createElement('label', {
      attrs: {
        for: 'answer_' + this.id,
      },
    }, this.questionText);
    elements.push(questionTextNode);

    elements.push(this.createInputNode(createElement));

    for (let i = 0; i < this.numberOfAttempts - 1; ++i) {
      const resultIcon: VNode = createElement('span', {
        class: {
          incorrect: true,
        },
      }, '✗');
      elements.push(resultIcon);
    }
    if (this.numberOfAttempts > 0) {
      const resultIcon: VNode = createElement('span', {
        class: this.getCorrectnessClass(),
      }, this.icon);
      elements.push(resultIcon);
    }
    if (this.question.data.type === QuestionType.ESTIMATE && this.isSolved) {
      elements.push(createElement('span', ' (' + this.question.computeResult() + ')'));
    }

    return createElement('div', elements);
  },
});
