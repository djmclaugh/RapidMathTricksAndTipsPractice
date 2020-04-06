import {Question, newMultiplication, newDivision, newDivisionFromMultiplication} from "../question";
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

export function exerciseForTrick2(): Question[] {
  return [
    newMultiplication(80, 0.3),
    newMultiplication(4.6, 200),
    newMultiplication(700, 0.5),
    newMultiplication(2.5, 300),
    newMultiplication(3.9, 20),
    newMultiplication(1.2, 120),
    newMultiplication(1800, 0.03),
    newMultiplication(0.31, 30),
    newDivision(720, 1.2),
    newDivision(960, 3.2),
    newDivision(150, 0.5),
    newDivision(5600, 1.4),
    newDivision(81, 0.9),
    newDivision(510, 1.7),
  ]
}
