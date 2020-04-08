import {Question, newMultiplicationDigitSumCheck, newDivisionDigitSumCheck} from "../question";
import {randomFromArray} from "../random_util";
import {randomNonTrivialTwoDigitFactor} from "./generator_util";

// The chance of generating a multiplication question instead of a division question.
// Using the same ratio as the book.
const MULTIPLICATION_TO_DIVISION_RATIO = 10/16

const OFFSETS = [-8, -7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8];

// Check multiplications and divisions
export function generateQuestionForTrick14(): Question {
  return Math.random() < MULTIPLICATION_TO_DIVISION_RATIO ?
      generateMultiplication() : generateDivision();
}

function generateMultiplication(): Question {
  const a = randomNonTrivialTwoDigitFactor();
  const b = randomNonTrivialTwoDigitFactor();
  let product = a * b;

  // Half the time, the product should be wrong
  if (Math.random() < 0.5) {
    product += randomFromArray(OFFSETS);
  }

  return newMultiplicationDigitSumCheck(a, b, product);
}

function generateDivision(): Question {
  const a = randomNonTrivialTwoDigitFactor();
  const b = randomNonTrivialTwoDigitFactor();
  let product = a * b;

  // Half the time, the product should be wrong
  if (Math.random() < 0.5) {
    product += randomFromArray(OFFSETS);
  }

  return newDivisionDigitSumCheck(product, b, a);
}
