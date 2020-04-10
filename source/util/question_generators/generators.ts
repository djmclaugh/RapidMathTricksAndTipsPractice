import {Question, newMultiplication, newDivision} from "../question";
import {randomInt, randomFromArray} from "../random_util";
import {randomSimpleFactor, randomTwoDigitFactor, randomNonTrivialTwoDigitFactor, TRICKY_SQUARE_ROOTS, SIMPLE_FACTORS} from "./generator_util";

import {generateQuestionForTrick1} from "./trick_1_generator";
import {generateQuestionForTrick2} from "./trick_2_generator";
import {generateQuestionForTrick14} from "./trick_14_generator";

// Multiplying by 4
export function generateQuestionForTrick3(): Question {
  const x = randomNonTrivialTwoDigitFactor();
  return Math.random() < 0.5 ? newMultiplication(4, x) : newMultiplication(x, 4);
}

// Dividing by 4
export function generateQuestionForTrick4(): Question {
  const x = randomNonTrivialTwoDigitFactor();
  return newDivision(x * 4, 4);
}

// Multiplying by 5
export function generateQuestionForTrick5(): Question {
  const x = randomNonTrivialTwoDigitFactor();
  return Math.random() < 0.5 ? newMultiplication(5, x) : newMultiplication(x, 5);
}

// Dividing by 5
export function generateQuestionForTrick6(): Question {
  return newDivision(randomNonTrivialTwoDigitFactor(), 5);
}

// Square a number ending in 5
export function generateQuestionForTrick7(): Question {
  // We want x to be a number that ends in 5 between 15 and 115 inclusively
  let x = ((randomInt(11) + 1) * 10) + 5;
  return newMultiplication(x, x);
}

// Multiply 2 digits by 11
export function generateQuestionForTrick8(): Question {
  const x = randomNonTrivialTwoDigitFactor();
  return Math.random() < 0.5 ? newMultiplication(11, x) : newMultiplication(x, 11);
}

// Multiplying by 25
export function generateQuestionForTrick9(): Question {
  const x = randomNonTrivialTwoDigitFactor();
  return Math.random() < 0.5 ? newMultiplication(25, x) : newMultiplication(x, 25);
}

// Dividing by 25
export function generateQuestionForTrick10(): Question {
  return newDivision(randomNonTrivialTwoDigitFactor() * 10, 25);
}

// Multiplying a one/two digit number by 99
export function generateQuestionForTrick11(): Question {
  const x = randomTwoDigitFactor();
  return Math.random() < 0.5 ? newMultiplication(99, x) : newMultiplication(x, 99);
}

// Multiplying a one/two digit number by 101
export function generateQuestionForTrick12(): Question {
  const x = randomTwoDigitFactor();
  return Math.random() < 0.5 ? newMultiplication(101, x) : newMultiplication(x, 101);
}

// Multiplying two numbers whose difference is 2
// We either want a tricky number to square, or an easy number to square that has been multiplied
// by 10.
const ROOTS_FOR_TRICK_13: number[] = TRICKY_SQUARE_ROOTS.concat(
  SIMPLE_FACTORS.map((x) => x * 10).filter((x) => !TRICKY_SQUARE_ROOTS.includes(x))
);
export function generateQuestionForTrick13(): Question {
  const x = randomFromArray(ROOTS_FOR_TRICK_13);
  return Math.random() < 0.5 ? newMultiplication(x - 1, x + 1) : newMultiplication(x + 1, x - 1);
}

// Multiplying by 125
export function generateQuestionForTrick15(): Question {
  const x = (1 + randomInt(60)) * 4;
  return Math.random() < 0.5 ? newMultiplication(125, x) : newMultiplication(x, 125);
}

// Dividing by 125
export function generateQuestionForTrick16(): Question {
  const x = randomSimpleFactor() * randomFromArray([10, 100, 1000]);
  return newDivision(x, 125);
}

// Multiplying by 9
export function generateQuestionForTrick17(): Question {
  const x = randomNonTrivialTwoDigitFactor();
  return Math.random() < 0.5 ? newMultiplication(9, x) : newMultiplication(x, 9);
}

// Multiplying by 12
export function generateQuestionForTrick18(): Question {
  const x = randomNonTrivialTwoDigitFactor();
  return Math.random() < 0.5 ? newMultiplication(12, x) : newMultiplication(x, 12);
}

// Multiplying by 15
export function generateQuestionForTrick19(): Question {
  const x = (4 + randomInt(40)) * 2;
  return Math.random() < 0.5 ? newMultiplication(15, x) : newMultiplication(x, 15);
}

// Multiplying numbers with a special relationship
// The special relationship is the same tens digit and ones digits that add up to 10.
export function generateQuestionForTrick20(): Question {
  const tensDigit = (1 + randomInt(9)) * 10;
  const onesDigit = 1 + randomInt(9);
  return newMultiplication(tensDigit + onesDigit, tensDigit + (10 - onesDigit));
}

// Multiplying by x.5
export function generateQuestionForTrick21(): Question {
  const a = (1 + randomInt(9)) + 0.5;
  let b: number;
  if ([3, 5, 9, 11, 15].includes(a * 2)) {
    b = randomTwoDigitFactor() * 2;
  } else if (a * 2 == 7) {
    b = randomSimpleFactor() * 2;
  } else if ([13, 17, 19].includes(a * 2)) {
    b = randomFromArray([2, 3, 4]) * 2
  } else {
    console.log("this should never happen");
    b = randomTwoDigitFactor() * 2;
  }
  return Math.random() < 0.5 ? newMultiplication(a, b) : newMultiplication(b, a);
}

export function generateQuestionForTrick22(): Question {
  const divisor = (1 + randomInt(9)) + 0.5;
  let quotient: number;
  if ([3, 5, 7, 9, 11, 15].includes(divisor * 2)) {
    quotient = randomSimpleFactor();
  } else if ([13, 17, 19].includes(divisor * 2)) {
    quotient = randomFromArray([2, 3, 4]);
  } else {
    console.log("this should never happen");
    quotient = randomSimpleFactor() * 2;
  }
  return newDivision(quotient * divisor, divisor);
}

export const GENERATORS: Array<() => Question> = [
  generateQuestionForTrick1,
  generateQuestionForTrick2,
  generateQuestionForTrick3,
  generateQuestionForTrick4,
  generateQuestionForTrick5,
  generateQuestionForTrick6,
  generateQuestionForTrick7,
  generateQuestionForTrick8,
  generateQuestionForTrick9,
  generateQuestionForTrick10,
  generateQuestionForTrick11,
  generateQuestionForTrick12,
  generateQuestionForTrick13,
  generateQuestionForTrick14,
  generateQuestionForTrick15,
  generateQuestionForTrick16,
  generateQuestionForTrick17,
  generateQuestionForTrick18,
  generateQuestionForTrick19,
  generateQuestionForTrick20,
  generateQuestionForTrick21,
  generateQuestionForTrick22,
]
