import {Question, newAddition, newSum, newSubtraction, newMultiplication, newDivision} from "../question";
import {randomInt, randomFromArray} from "../random_util";
import {randomSimpleFactor, randomTwoDigitFactor, randomNonTrivialTwoDigitFactor, TRICKY_SQUARE_ROOTS, SIMPLE_FACTORS} from "./generator_util";

import {generateQuestionForTrick1} from "./trick_1_generator";
import {generateQuestionForTrick2} from "./trick_2_generator";
import {generateQuestionForTrick14} from "./trick_14_generator";

function randomAdditionOrder(a: number, b: number): Question {
  return randomFromArray([newAddition(a, b), newAddition(b, a)]);
}

function randomMultiplicationOrder(a: number, b: number): Question {
  return randomFromArray([newMultiplication(a, b), newMultiplication(b, a)]);
}

// Multiplying by 4
export function generateQuestionForTrick3(): Question {
  const x = randomNonTrivialTwoDigitFactor();
  return randomMultiplicationOrder(4, x);
}

// Dividing by 4
export function generateQuestionForTrick4(): Question {
  const x = randomNonTrivialTwoDigitFactor();
  return newDivision(x * 4, 4);
}

// Multiplying by 5
export function generateQuestionForTrick5(): Question {
  const x = randomNonTrivialTwoDigitFactor();
  return randomMultiplicationOrder(5, x);
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
  return randomMultiplicationOrder(11, x);
}

// Multiplying by 25
export function generateQuestionForTrick9(): Question {
  const x = randomNonTrivialTwoDigitFactor();
  return randomMultiplicationOrder(25, x);
}

// Dividing by 25
export function generateQuestionForTrick10(): Question {
  return newDivision(randomNonTrivialTwoDigitFactor() * 10, 25);
}

// Multiplying a one/two digit number by 99
export function generateQuestionForTrick11(): Question {
  const x = randomTwoDigitFactor();
  return randomMultiplicationOrder(99, x);
}

// Multiplying a one/two digit number by 101
export function generateQuestionForTrick12(): Question {
  const x = randomTwoDigitFactor();
  return randomMultiplicationOrder(101, x);
}

// Multiplying two numbers whose difference is 2
// We either want a tricky number to square, or an easy number to square that has been multiplied
// by 10.
const ROOTS_FOR_TRICK_13: number[] = TRICKY_SQUARE_ROOTS.concat(
  SIMPLE_FACTORS.map((x) => x * 10).filter((x) => !TRICKY_SQUARE_ROOTS.includes(x))
);
export function generateQuestionForTrick13(): Question {
  const x = randomFromArray(ROOTS_FOR_TRICK_13);
  return randomMultiplicationOrder(x - 1, x + 1);
}

// Multiplying by 125
export function generateQuestionForTrick15(): Question {
  const x = (1 + randomInt(60)) * 4;
  return randomMultiplicationOrder(125, x);
}

// Dividing by 125
export function generateQuestionForTrick16(): Question {
  const x = randomSimpleFactor() * randomFromArray([10, 100, 1000]);
  return newDivision(x, 125);
}

// Multiplying by 9
export function generateQuestionForTrick17(): Question {
  const x = randomNonTrivialTwoDigitFactor();
  return randomMultiplicationOrder(9, x);
}

// Multiplying by 12
export function generateQuestionForTrick18(): Question {
  const x = randomNonTrivialTwoDigitFactor();
  return randomMultiplicationOrder(12, x);
}

// Multiplying by 15
export function generateQuestionForTrick19(): Question {
  const x = (4 + randomInt(40)) * 2;
  return randomMultiplicationOrder(15, x);
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
  return randomMultiplicationOrder(a, b);
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

// Square two digit number starting with a 5
export function generateQuestionForTrick23(): Question {
  const x = randomFromArray([51, 52, 53, 54, 55, 56, 57, 58, 59]);
  return newMultiplication(x, x);
}

// Square two digit number starting ending a 1
export function generateQuestionForTrick24(): Question {
  const x = randomFromArray([11, 21, 31, 41, 51, 61, 71, 81, 91]);
  return newMultiplication(x, x);
}

// Multiply 2 digit numbers
export function generateQuestionForTrick25(): Question {
  return newMultiplication(randomNonTrivialTwoDigitFactor(), randomNonTrivialTwoDigitFactor());
}

// Multiplying two numbers whose difference is 4
// For now, we either want a tricky number to square, or an easy number to square that has been
// multiplied by 10. But like in the book, maybe we want to include numbers that either end in 1s
// or 5s since the user probably knows tricks 7 and 24.
const ROOTS_FOR_TRICK_26: number[] = TRICKY_SQUARE_ROOTS.concat(
  SIMPLE_FACTORS.map((x) => x * 10).filter((x) => !TRICKY_SQUARE_ROOTS.includes(x))
);
export function generateQuestionForTrick26(): Question {
  const x = randomFromArray(ROOTS_FOR_TRICK_26);
  return randomMultiplicationOrder(x - 2, x + 2);
}

// Multiply in two steps
export function generateQuestionForTrick27(): Question {
  return newMultiplication(randomSimpleFactor(), randomFromArray([7, 8, 9, 11, 12]) * 2);
}

// Multiply numbers just over 100
export function generateQuestionForTrick28(): Question {
  const a = 101 + randomInt(9);
  const b = 101 + randomInt(9);
  return newMultiplication(a, b);
}

// Subtract by adding
export function generateQuestionForTrick29(): Question {
  const difference = 11 + randomInt(90);
  const minuend = 1 + randomInt(99 - difference);
  return newSubtraction(minuend + difference, minuend);
}

// Subtract by adding (variation)
export function generateQuestionForTrick30(): Question {
  return newSubtraction(101 + randomInt(70), 99 - randomInt(70));
}

// Subtract by altering
export function generateQuestionForTrick31(): Question {
  const subtrahendTensDigit = 2 + randomInt(8);
  const subtrahend = (subtrahendTensDigit * 10) + randomInt(8);
  const minuendTensDigit = randomInt(subtrahendTensDigit);
  const minuend = (minuendTensDigit * 10) + 8 + randomInt(1);
  return newSubtraction(subtrahend, minuend);
}

// Add by altering
export function generateQuestionForTrick32(): Question {
  const a = (10 * (1 + randomInt(9))) + (8 + randomInt(1));
  const b = (10 * (1 + randomInt(9))) + (3 + randomInt(5));
  return randomAdditionOrder(a, b);
}

// Add by grouping and reordering
export function generateQuestionForTrick33(): Question {
  const summands: number[] = [];
  for (let i = 0; i < 8; ++i) {
    summands.push(1 + randomInt(9));
  }
  return newSum(summands);
}

// Add by without carrying
export function generateQuestionForTrick34(): Question {
  const summands: number[] = [];
  for (let i = 0; i < 8; ++i) {
    summands.push(11 + randomInt(89));
  }
  return newSum(summands);
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
  generateQuestionForTrick23,
  generateQuestionForTrick24,
  generateQuestionForTrick25,
  generateQuestionForTrick26,
  generateQuestionForTrick27,
  generateQuestionForTrick28,
  generateQuestionForTrick29,
  generateQuestionForTrick30,
  generateQuestionForTrick31,
  generateQuestionForTrick32,
  generateQuestionForTrick33,
  generateQuestionForTrick34,
]
