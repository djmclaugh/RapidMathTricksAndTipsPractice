import {
  QuestionType,
  getBooleanAnswer,
  getNumberAnswer,
} from '../../source/util/question';

import { describe, it } from 'mocha';
import { assert } from 'chai';

describe('Question', () => {
  describe('getNumberAnswer', () => {
    describe('sum', () => {
      it('add two numbers', () => {
        assert.equal(getNumberAnswer({
          type: QuestionType.SUM,
          operands: [2, 2],
        }), 4);
        assert.equal(getNumberAnswer({
          type: QuestionType.SUM,
          operands: [-4, 10],
        }), 6);
        assert.equal(getNumberAnswer({
          type: QuestionType.SUM,
          operands: [0.2, 0.7],
        }), 0.9);
      });

      it('add multiple numbers', () => {
        assert.equal(getNumberAnswer({
          type: QuestionType.SUM,
          operands: [2, 2, -4, 10, 0.2, 0.7],
        }), 10.9);
      });
    });

    it('arithmetic progression sum', () => {
      assert.equal(getNumberAnswer({
        type: QuestionType.ARITHMETIC_PROGRESSION_SUM,
        operands: [1, 1, 10],
      }), 55);
      assert.equal(getNumberAnswer({
        type: QuestionType.ARITHMETIC_PROGRESSION_SUM,
        operands: [2, 0.01, 7],
      }), 14.21);
      assert.equal(getNumberAnswer({
        type: QuestionType.ARITHMETIC_PROGRESSION_SUM,
        operands: [10, -2, 11],
      }), 0);
    });

    it('subtraction', () => {
      assert.equal(getNumberAnswer({
        type: QuestionType.SUBTRACTION,
        operands: [2, 2],
      }), 0);
      assert.equal(getNumberAnswer({
        type: QuestionType.SUBTRACTION,
        operands: [-4, 10],
      }), -14);
      assert.equal(getNumberAnswer({
        type: QuestionType.SUBTRACTION,
        operands: [0.2, 0.7],
      }), -0.5);
    });

    it('multiplication', () => {
      assert.equal(getNumberAnswer({
        type: QuestionType.MULTIPLICATION,
        operands: [2, 2],
      }), 4);
      assert.equal(getNumberAnswer({
        type: QuestionType.MULTIPLICATION,
        operands: [-4, 10],
      }), -40);
      assert.equal(getNumberAnswer({
        type: QuestionType.MULTIPLICATION,
        operands: [0.2, 0.7],
      }), 0.14);
    });

    it('division', () => {
      assert.equal(getNumberAnswer({
        type: QuestionType.DIVISION,
        operands: [2, 2],
      }), 1);
      assert.equal(getNumberAnswer({
        type: QuestionType.DIVISION,
        operands: [-4, 10],
      }), -0.4);
      assert.equal(getNumberAnswer({
        type: QuestionType.DIVISION,
        operands: [0.7, 0.2],
      }), 3.5);
    });
  });

  describe('getBooleanAnswer', () => {
    it('multiplication digit sum check', () => {
      assert.equal(getBooleanAnswer({
        type: QuestionType.MULTIPLICATION_DIGIT_SUM_CHECK,
        operands: [2, 2, 4],
      }), true);
      assert.equal(getBooleanAnswer({
        type: QuestionType.MULTIPLICATION_DIGIT_SUM_CHECK,
        operands: [-4, 10, -40],
      }), true);
      assert.equal(getBooleanAnswer({
        type: QuestionType.MULTIPLICATION_DIGIT_SUM_CHECK,
        operands: [0.2, 0.7, 0.14],
      }), true);
      assert.equal(getBooleanAnswer({
        type: QuestionType.MULTIPLICATION_DIGIT_SUM_CHECK,
        operands: [2, 2, 5],
      }), false);
      assert.equal(getBooleanAnswer({
        type: QuestionType.MULTIPLICATION_DIGIT_SUM_CHECK,
        operands: [-4, 10, -41],
      }), false);
      assert.equal(getBooleanAnswer({
        type: QuestionType.MULTIPLICATION_DIGIT_SUM_CHECK,
        operands: [0.2, 0.7, 0.15],
      }), false);
    });

    it('division digit sum check', () => {
      assert.equal(getBooleanAnswer({
        type: QuestionType.DIVISION_DIGIT_SUM_CHECK,
        operands: [2, 2, 1],
      }), true);
      assert.equal(getBooleanAnswer({
        type: QuestionType.DIVISION_DIGIT_SUM_CHECK,
        operands: [-4, 10, -0.4],
      }), true);
      assert.equal(getBooleanAnswer({
        type: QuestionType.DIVISION_DIGIT_SUM_CHECK,
        operands: [0.7, 0.2, 3.5],
      }), true);
      assert.equal(getBooleanAnswer({
        type: QuestionType.DIVISION_DIGIT_SUM_CHECK,
        operands: [2, 2, 2],
      }), false);
      assert.equal(getBooleanAnswer({
        type: QuestionType.DIVISION_DIGIT_SUM_CHECK,
        operands: [-4, 10, -0.8],
      }), false);
      assert.equal(getBooleanAnswer({
        type: QuestionType.DIVISION_DIGIT_SUM_CHECK,
        operands: [0.7, 0.2, 4.5],
      }), false);
    });
  });
});
