import {Question, newMultiplication, newDivisionFromMultiplication} from "../question";
import {randomInt} from "../random_util";
import {randomSimpleFactor} from "./generator_util";

// The chance of generating a multiplication question instead of a division question.
// Using the same ratio as the book.
const MULTIPLICATION_TO_DIVISION_RATIO = 8/14

export function generateQuestionForTrick2(): Question {
  return Math.random() < MULTIPLICATION_TO_DIVISION_RATIO ?
      generateMultiplication() : generateDivision();
}

function generateMultiplication(): Question {
  const a = randomSimpleFactor() / 10;
  let b = randomSimpleFactor() * 10;
  if (Math.random() < 0.2) {
    b *= 10;
  }

  return Math.random() < 0.5 ? newMultiplication(a, b) : newMultiplication(b, a);
}

function generateDivision(): Question {
  const a = randomSimpleFactor() / 10;
  let b = randomSimpleFactor() * 10;
  if (Math.random() < 0.2) {
    b *= 10;
  }

  return newDivisionFromMultiplication(newMultiplication(a, b));
}
