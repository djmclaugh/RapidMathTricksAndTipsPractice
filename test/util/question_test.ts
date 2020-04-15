import { Operator, QuestionType, Question } from '../../source/util/question';

import { describe, it } from 'mocha';
import { assert } from 'chai';

describe('Question', () => {
  describe('checkAnswer', () => {
    describe('type: RESULT', () => {
      it('addition', () => {
        let question: Question = new Question({
          type: QuestionType.RESULT,
          operator: Operator.ADDITION,
          operands: [2, 2],
        });
        assert.isTrue(question.checkNumberAnswer(4));
        assert.isFalse(question.checkNumberAnswer(3));

        question = new Question({
          type: QuestionType.RESULT,
          operator: Operator.ADDITION,
          operands: [-4, 10],
        });
        assert.isTrue(question.checkNumberAnswer(6));

        question = new Question({
          type: QuestionType.RESULT,
          operator: Operator.ADDITION,
          operands: [0.2, 0.7],
        });
        assert.isTrue(question.checkNumberAnswer(0.9));

        question = new Question({
          type: QuestionType.RESULT,
          operator: Operator.ADDITION,
          operands: [0.2, 0.7, -1, 0.9],
        });
        assert.isTrue(question.checkNumberAnswer(0.8));
      });

      it('subtraction', () => {
        let question: Question = new Question({
          type: QuestionType.RESULT,
          operator: Operator.SUBTRACTION,
          operands: [2, 2],
        });
        assert.isTrue(question.checkNumberAnswer(0));
        assert.isFalse(question.checkNumberAnswer(1));

        question = new Question({
          type: QuestionType.RESULT,
          operator: Operator.SUBTRACTION,
          operands: [-4, 10],
        });
        assert.isTrue(question.checkNumberAnswer(-14));

        question = new Question({
          type: QuestionType.RESULT,
          operator: Operator.SUBTRACTION,
          operands: [0.2, 0.7],
        });
        assert.isTrue(question.checkNumberAnswer(-0.5));

        question = new Question({
          type: QuestionType.RESULT,
          operator: Operator.SUBTRACTION,
          operands: [0.2, 0.7, -1, 0.9],
        });
        assert.isTrue(question.checkNumberAnswer(-0.4));
      });

      it('multiplication', () => {
        let question: Question = new Question({
          type: QuestionType.RESULT,
          operator: Operator.MULTIPLICATION,
          operands: [2, 2],
        });
        assert.isTrue(question.checkNumberAnswer(4));
        assert.isFalse(question.checkNumberAnswer(1));

        question = new Question({
          type: QuestionType.RESULT,
          operator: Operator.MULTIPLICATION,
          operands: [-4, 10],
        });
        assert.isTrue(question.checkNumberAnswer(-40));

        question = new Question({
          type: QuestionType.RESULT,
          operator: Operator.MULTIPLICATION,
          operands: [0.2, 0.7],
        });
        assert.isTrue(question.checkNumberAnswer(0.14));

        question = new Question({
          type: QuestionType.RESULT,
          operator: Operator.MULTIPLICATION,
          operands: [0.2, 0.7, -1, 0.9],
        });
        assert.isTrue(question.checkNumberAnswer(-0.126));
      });

      it('division', () => {
        let question: Question = new Question({
          type: QuestionType.RESULT,
          operator: Operator.DIVISION,
          operands: [2, 2],
        });
        assert.isTrue(question.checkNumberAnswer(1));
        assert.isFalse(question.checkNumberAnswer(2));

        question = new Question({
          type: QuestionType.RESULT,
          operator: Operator.DIVISION,
          operands: [-4, 10],
        });
        assert.isTrue(question.checkNumberAnswer(-0.4));

        question = new Question({
          type: QuestionType.RESULT,
          operator: Operator.DIVISION,
          operands: [0.7, 0.2],
        });
        assert.isTrue(question.checkNumberAnswer(3.5));

        question = new Question({
          type: QuestionType.RESULT,
          operator: Operator.DIVISION,
          operands: [0.7, 0.2, -1, 0.5],
        });
        assert.isTrue(question.checkNumberAnswer(-7));
      });
    });

    describe('type: ESTIMATE', () => {
      it('addition', () => {
        const question: Question = new Question({
          type: QuestionType.ESTIMATE,
          operator: Operator.ADDITION,
          operands: [50, 50],
          estimateDetails: {
            acceptableRelativeError: 0.01,
          },
        });
        assert.isTrue(question.checkNumberAnswer(100));
        assert.isTrue(question.checkNumberAnswer(100.1));
        assert.isTrue(question.checkNumberAnswer(101));
        assert.isTrue(question.checkNumberAnswer(99));
        assert.isFalse(question.checkNumberAnswer(101.1));
        assert.isFalse(question.checkNumberAnswer(98.9));
      });
      it('division', () => {
        const question: Question = new Question({
          type: QuestionType.ESTIMATE,
          operator: Operator.DIVISION,
          operands: [900, 14],
          estimateDetails: {
            acceptableRelativeError: 0.02,
          },
        });
        assert.isTrue(question.checkNumberAnswer(63));
        assert.isFalse(question.checkNumberAnswer(62.999999999));
      });
    });

    describe('type: DIGIT_CHECK', () => {
      it('multiplication', () => {
        let question: Question = new Question({
          type: QuestionType.DIGIT_CHECK,
          operator: Operator.MULTIPLICATION,
          operands: [13, 7],
          digitCheckDetails: {
            proposedResult: 91,
          },
        });
        assert.isTrue(question.checkBooleanAnswer(true));
        assert.isFalse(question.checkBooleanAnswer(false));

        question = new Question({
          type: QuestionType.DIGIT_CHECK,
          operator: Operator.MULTIPLICATION,
          operands: [13, 7],
          digitCheckDetails: {
            proposedResult: 92,
          },
        });
        assert.isFalse(question.checkBooleanAnswer(true));
        assert.isTrue(question.checkBooleanAnswer(false));

        question = new Question({
          type: QuestionType.DIGIT_CHECK,
          operator: Operator.MULTIPLICATION,
          operands: [13, 7],
          digitCheckDetails: {
            // Even though this isn't the right answer, it has the same digit sum as the right
            // answer.
            proposedResult: 1,
          },
        });
        assert.isTrue(question.checkBooleanAnswer(true));
        assert.isFalse(question.checkBooleanAnswer(false));
      });

      it('division', () => {
        let question: Question = new Question({
          type: QuestionType.DIGIT_CHECK,
          operator: Operator.DIVISION,
          operands: [2144, 69],
          digitCheckDetails: {
            proposedResult: 31,
          },
        });
        assert.isTrue(question.checkBooleanAnswer(false));
      });
    });
  });
});
