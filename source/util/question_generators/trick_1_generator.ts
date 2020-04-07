import {Question, newMultiplication, newDivisionFromMultiplication} from "../question";
import {randomInt} from "../random_util";
import {randomSimpleFactor} from "./generator_util";

// The chance of generating a multiplication question instead of a division question.
// Using the same ratio as the book.
const MULTIPLICATION_TO_DIVISION_RATIO = 8/14

export function generateQuestionForTrick1(): Question {
  return Math.random() < MULTIPLICATION_TO_DIVISION_RATIO ?
      generateMultiplication() : generateDivision();
}

function generateMultiplication(): Question {
  const a = randomSimpleFactor();
  const b = randomSimpleFactor();

  const numZerosA = randomInt(3);  // [0, 2]
  let numZerosB;
  if (numZerosA == 0) {
    numZerosB = 1 + randomInt(2);  // [1, 2]
  } else if (numZerosA == 1) {
    numZerosB = randomInt(3);  // [0, 2]
  } else {
    numZerosB = randomInt(2);  // [0, 1]
  }

  return newMultiplication(a * Math.pow(10, numZerosA), b * Math.pow(10, numZerosB));
}

function generateDivision(): Question {
  return newDivisionFromMultiplication(generateMultiplication());
}
