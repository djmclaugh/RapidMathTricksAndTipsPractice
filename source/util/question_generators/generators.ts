import {Question, newMultiplication, newDivision} from "../question";
import {randomInt} from "../random_util";
import {randomTwoDigitFactor, randomNonTrivialTwoDigitFactor} from "./generator_util";

import {generateQuestionForTrick1} from "./trick_1_generator";
import {generateQuestionForTrick2} from "./trick_2_generator";

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
]
