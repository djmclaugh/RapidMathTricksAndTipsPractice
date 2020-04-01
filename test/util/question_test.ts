import {Question, QuestionType, getAnwser} from "../../source/util/question";

import { assert } from "chai";

describe("Question", () => {
  describe("getAnwser", () => {
    it("addition", () => {
      assert.equal(getAnwser({
        type: QuestionType.ADDITION,
        operands: [2, 2]
      }), 4);
      assert.equal(getAnwser({
        type: QuestionType.ADDITION,
        operands: [-4, 10]
      }), 6);
      assert.equal(getAnwser({
        type: QuestionType.ADDITION,
        operands: [0.2, 0.7]
      }), 0.9);
    });

    it("subtraction", () => {
      assert.equal(getAnwser({
        type: QuestionType.SUBTRACTION,
        operands: [2, 2]
      }), 0);
      assert.equal(getAnwser({
        type: QuestionType.SUBTRACTION,
        operands: [-4, 10]
      }), -14);
      assert.equal(getAnwser({
        type: QuestionType.SUBTRACTION,
        operands: [0.2, 0.7]
      }), -0.5);
    });

    it("multiplication", () => {
      assert.equal(getAnwser({
        type: QuestionType.MULTIPLICATION,
        operands: [2, 2]
      }), 4);
      assert.equal(getAnwser({
        type: QuestionType.MULTIPLICATION,
        operands: [-4, 10]
      }), -40);
      assert.equal(getAnwser({
        type: QuestionType.MULTIPLICATION,
        operands: [0.2, 0.7]
      }), 0.14);
    });

    it("division", () => {
      assert.equal(getAnwser({
        type: QuestionType.DIVISION,
        operands: [2, 2]
      }), 1);
      assert.equal(getAnwser({
        type: QuestionType.DIVISION,
        operands: [-4, 10]
      }), -0.4);
      assert.equal(getAnwser({
        type: QuestionType.DIVISION,
        operands: [0.7, 0.2]
      }), 3.5);
    });

  });
});
