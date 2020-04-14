import { Operator, Question, newDigitSumCheck } from '../question';
import { randomInt, randomFromArray } from '../random_util';

// The chance of generating an addition question instead of a subtraction question.
// Using the same ratio as the book.
const ADDITION_TO_SUBTRACTION_RATIO = 8 / 16;

// Check multiplications and divisions
export function generateQuestionForTrick42(): Question {
  return Math.random() < ADDITION_TO_SUBTRACTION_RATIO
    ? generateAddition() : generateSubtraction();
}

function generateAddition(): Question {
  const a = ((1 + randomInt(9)) * 10) + (1 + randomInt(9));
  const b = ((5 + randomInt(5)) * 10) + (1 + randomInt(9));
  let sum = a + b;

  // Half the time, the anwser should be wrong
  if (Math.random() < 0.5) {
    sum += randomFromArray([-10, 10]);
  }

  return newDigitSumCheck(a, b, Operator.ADDITION, sum);
}

function generateSubtraction(): Question {
  const minuendOnesDigit = 1 + randomInt(9);
  const minuendTensDigit = 1 + randomInt(8);
  const minuend = (10 * minuendTensDigit) + minuendOnesDigit;

  const subtrahendOnesDigit = randomInt(minuendOnesDigit);
  const subtrahendTensDigit = randomInt(minuendTensDigit);
  const subtrahend = 100 + (10 * subtrahendTensDigit) + subtrahendOnesDigit;

  let difference = subtrahend - minuend;

  // Half the time, the anwser should be wrong
  if (Math.random() < 0.5) {
    difference += randomFromArray([-10, 10]);
  }

  return newDigitSumCheck(subtrahend, minuend, Operator.SUBTRACTION, difference);
}
