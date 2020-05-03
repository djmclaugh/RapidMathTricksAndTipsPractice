import {
  Operator,
  Question,
  newBinaryOperation,
  newSum,
  newMultiplication,
  newDivision,
  newArithmeticProgressionSum,
  newEstimate,
} from '../question';
import { randomInt, randomFromArray, suffle } from '../random_util';
import {
  randomSimpleFactor,
  randomTwoDigitFactor,
  randomNonTrivialTwoDigitFactor,
  randomOperands,
  TRICKY_SQUARE_ROOTS,
  SIMPLE_FACTORS,
} from './generator_util';

import { generateQuestionForTrick1 } from './trick_1_generator';
import { generateQuestionForTrick2 } from './trick_2_generator';
import { generateQuestionForTrick14 } from './trick_14_generator';
import { generateQuestionForTrick42 } from './trick_42_generator';

export interface QuestionGenerator {
  name: string,
  generator: () => Question
}

function randomAdditionOrder(a: number, b: number): Question {
  return randomFromArray([
    newBinaryOperation(a, b, Operator.ADDITION),
    newBinaryOperation(b, a, Operator.ADDITION),
  ]);
}

function randomMultiplicationOrder(a: number, b: number): Question {
  return randomFromArray([
    newBinaryOperation(a, b, Operator.MULTIPLICATION),
    newBinaryOperation(b, a, Operator.MULTIPLICATION),
  ]);
}

function randomMultiplicationOrderForEstimate(a: number, b: number, error: number): Question {
  return randomFromArray([
    newEstimate(a, b, Operator.MULTIPLICATION, error),
    newEstimate(b, a, Operator.MULTIPLICATION, error),
  ]);
}

const generator1 = {
  name: 'Extra zeroes',
  generator: generateQuestionForTrick1,
};

const generator2 = {
  name: 'Decimal points',
  generator: generateQuestionForTrick2,
};

const generator3 = {
  name: 'Multiplying by 4',
  generator: function(): Question {
    const x = randomNonTrivialTwoDigitFactor();
    return randomMultiplicationOrder(4, x);
  },
};

const generator4 = {
  name: 'Dividing by 4',
  generator: function(): Question {
    const x = randomNonTrivialTwoDigitFactor();
    return newDivision(x * 4, 4);
  },
};

const generator5 = {
  name: 'Multiplying by 5',
  generator: function(): Question {
    const x = randomNonTrivialTwoDigitFactor();
    return randomMultiplicationOrder(5, x);
  },
};

const generator6 = {
  name: 'Dividing by 5',
  generator: function(): Question {
    return newDivision(randomNonTrivialTwoDigitFactor(), 5);
  },
};

const generator7 = {
  name: 'Square a number ending in 5',
  generator: function(): Question {
    // We want x to be a number that ends in 5 between 15 and 115 inclusively
    const x = ((randomInt(11) + 1) * 10) + 5;
    return newMultiplication(x, x);
  },
};

const generator8 = {
  name: 'Multiply xy by 11',
  generator: function(): Question {
    const x = randomNonTrivialTwoDigitFactor();
    return randomMultiplicationOrder(11, x);
  },
};

const generator9 = {
  name: 'Multiplying by 25',
  generator: function(): Question {
    const x = randomNonTrivialTwoDigitFactor() * 2;
    return randomMultiplicationOrder(25, x);
  },
};

const generator10 = {
  name: 'Dividing by 25',
  generator: function(): Question {
    return newDivision(randomNonTrivialTwoDigitFactor() * 10, 25);
  },
};

const generator11 = {
  name: 'Multiply xy by 99',
  generator: function(): Question {
    const x = randomTwoDigitFactor();
    return randomMultiplicationOrder(99, x);
  },
};

const generator12 = {
  name: 'Multiply xy by 101',
  generator: function(): Question {
    const x = randomTwoDigitFactor();
    return randomMultiplicationOrder(101, x);
  },
};

// We either want a tricky number to square, or an easy number to square that has been multiplied
// by 10.
const ROOTS_FOR_TRICK_13: number[] = TRICKY_SQUARE_ROOTS.concat(
  SIMPLE_FACTORS.map((x) => x * 10).filter((x) => !TRICKY_SQUARE_ROOTS.includes(x)),
);
const generator13 = {
  name: 'Product of two numbers 2 apart',
  generator: function(): Question {
    const x = randomFromArray(ROOTS_FOR_TRICK_13);
    return randomMultiplicationOrder(x - 1, x + 1);
  },
};

const generator14 = {
  name: 'Check × and ÷',
  generator: generateQuestionForTrick14,
};

const generator15 = {
  name: 'Multiplying by 125',
  generator: function(): Question {
    const x = (1 + randomInt(60)) * 4;
    return randomMultiplicationOrder(125, x);
  },
};

const generator16 = {
  name: 'Dividing by 125',
  generator: function(): Question {
    const x = randomSimpleFactor() * randomFromArray([10, 100, 1000]);
    return newDivision(x, 125);
  },
};

const generator17 = {
  name: 'Multiplying by 9',
  generator: function(): Question {
    const x = randomNonTrivialTwoDigitFactor();
    return randomMultiplicationOrder(9, x);
  },
};

const generator18 = {
  name: 'Multiplying by 12',
  generator: function(): Question {
    const x = randomNonTrivialTwoDigitFactor();
    return randomMultiplicationOrder(12, x);
  },
};

const generator19 = {
  name: 'Multiplying by 15',
  generator: function(): Question {
    const x = (4 + randomInt(40)) * 2;
    return randomMultiplicationOrder(15, x);
  },
};

const generator20 = {
  name: 'xa × xb where a+b=10',
  generator: function(): Question {
    const tensDigit = (1 + randomInt(9)) * 10;
    const onesDigit = 1 + randomInt(9);
    return newMultiplication(tensDigit + onesDigit, tensDigit + (10 - onesDigit));
  },
};

const generator21 = {
  name: 'Multiplying by x.5',
  generator: function(): Question {
    const a = (1 + randomInt(9)) + 0.5;
    let b: number;
    if ([3, 5, 9, 11, 15].includes(a * 2)) {
      b = randomTwoDigitFactor() * 2;
    } else if (a * 2 === 7) {
      b = randomSimpleFactor() * 2;
    } else if ([13, 17, 19].includes(a * 2)) {
      b = randomFromArray([2, 3, 4]) * 2;
    } else {
      console.log('this should never happen');
      b = randomTwoDigitFactor() * 2;
    }
    return randomMultiplicationOrder(a, b);
  },
};

const generator22 = {
  name: 'Dividing by x.5',
  generator: function(): Question {
    const divisor = (1 + randomInt(9)) + 0.5;
    let quotient: number;
    if ([3, 5, 7, 9, 11, 15].includes(divisor * 2)) {
      quotient = randomSimpleFactor();
    } else if ([13, 17, 19].includes(divisor * 2)) {
      quotient = randomFromArray([2, 3, 4]);
    } else {
      console.log('this should never happen');
      quotient = randomSimpleFactor() * 2;
    }
    return newDivision(quotient * divisor, divisor);
  },
};

const generator23 = {
  name: 'Squaring 5x',
  generator: function(): Question {
    const x = randomFromArray([51, 52, 53, 54, 55, 56, 57, 58, 59]);
    return newMultiplication(x, x);
  },
};

const generator24 = {
  name: 'Squaring x1',
  generator: function(): Question {
    const x = randomFromArray([11, 21, 31, 41, 51, 61, 71, 81, 91]);
    return newMultiplication(x, x);
  },
};

const generator25 = {
  name: 'Multiply 2 digit numbers',
  generator: function(): Question {
    return newMultiplication(randomNonTrivialTwoDigitFactor(), randomNonTrivialTwoDigitFactor());
  },
};

// For now, we either want a tricky number to square, or an easy number to square that has been
// multiplied by 10. But like in the book, maybe we want to include numbers that either end in 1s
// or 5s since the user probably knows tricks 7 and 24.
const ROOTS_FOR_TRICK_26_SET: Set<number> = new Set();
// Remove 18 from the list because 16 * 20 can easily be done without the trick.
TRICKY_SQUARE_ROOTS.filter((x) => x !== 18).forEach((x) => { ROOTS_FOR_TRICK_26_SET.add(x); });
SIMPLE_FACTORS.map((x) => x * 10).forEach((x) => {
  ROOTS_FOR_TRICK_26_SET.add(x);
  ROOTS_FOR_TRICK_26_SET.add(x + 1);
  ROOTS_FOR_TRICK_26_SET.add(x - 5);
});
const ROOTS_FOR_TRICK_26: number[] = Array.from(ROOTS_FOR_TRICK_26_SET);

const generator26 = {
  name: 'Product of two numbers 4 apart',
  generator: function(): Question {
    const x = randomFromArray(ROOTS_FOR_TRICK_26);
    return randomMultiplicationOrder(x - 2, x + 2);
  },
};

const generator27 = {
  name: 'Multiply in two steps',
  generator: function(): Question {
    const x = randomFromArray([6, 7, 8, 9, 12]);
    return newMultiplication(x, randomFromArray([7, 8, 9, 11, 12]) * 2);
  },
};

const generator28 = {
  name: 'Multiply numbers just over 100',
  generator: function(): Question {
    const a = 101 + randomInt(9);
    const b = 101 + randomInt(9);
    return newMultiplication(a, b);
  },
};

const generator29 = {
  name: 'Subtract by adding',
  generator: function(): Question {
    const difference = 11 + randomInt(90);
    const minuend = 1 + randomInt(99 - difference);
    return newBinaryOperation(minuend + difference, minuend, Operator.SUBTRACTION);
  },
};

const generator30 = {
  name: 'Subtract by adding (variation)',
  generator: function(): Question {
    return newBinaryOperation(101 + randomInt(70), 99 - randomInt(70), Operator.SUBTRACTION);
  },
};

const generator31 = {
  name: 'Subtract by altering',
  generator: function(): Question {
    const subtrahendTensDigit = 2 + randomInt(8);
    const subtrahend = (subtrahendTensDigit * 10) + randomInt(8);
    const minuendTensDigit = randomInt(subtrahendTensDigit);
    const minuend = (minuendTensDigit * 10) + 8 + randomInt(1);
    return newBinaryOperation(subtrahend, minuend, Operator.SUBTRACTION);
  },
};

const generator32 = {
  name: 'Add by altering',
  generator: function(): Question {
    const a = (10 * (1 + randomInt(9))) + (8 + randomInt(1));
    const b = (10 * (1 + randomInt(9))) + (3 + randomInt(5));
    return randomAdditionOrder(a, b);
  },
};

const generator33 = {
  name: 'Add by grouping and reordering',
  generator: function(): Question {
    return newSum(randomOperands(1, 9, 8));
  },
};

const generator34 = {
  name: 'Add by without carrying',
  generator: function(): Question {
    return newSum(randomOperands(11, 99, 8));
  },
};

const generator35 = {
  name: 'Add a column (variation 1)',
  generator: function(): Question {
    return newSum(randomOperands(1, 51, 6));
  },
};

const generator36 = {
  name: 'Add a column (variation 2)',
  generator: function(): Question {
    // Exactly the same as for trick 35
    return newSum(randomOperands(1, 51, 6));
  },
};

const generator37 = {
  name: '"Cross-Out" technique (addition)',
  generator: function(): Question {
    return newSum(randomOperands(11, 99, 9));
  },
};

const generator38 = {
  name: 'Add columns in sections',
  generator: function(): Question {
    return newSum(randomOperands(11, 99, 10));
  },
};

const generator39 = {
  name: 'Add a few numbers',
  generator: function(): Question {
    const summands: number[] = [];
    summands.push(1 + randomInt(9));
    summands.push(11 + randomInt(19));
    summands.push(31 + randomInt(19));
    summands.push(51 + randomInt(39));
    suffle(summands);
    return newSum(summands);
  },
};

const generator40 = {
  name: 'Add 1 + 2 + 3 + ...',
  generator: function(): Question {
    const numberOfTerms = 5 + randomInt(26);
    return newArithmeticProgressionSum(1, 1, numberOfTerms);
  },
};

const generator41 = {
  name: 'Subtract in two steps',
  generator: function(): Question {
    const subtrahendTensDigit = 2 + randomInt(19);
    const minuendTensDigit = 1 + randomInt(subtrahendTensDigit - 2);
    const minuend = (minuendTensDigit * 10) + (1 + randomInt(9));
    return newBinaryOperation(subtrahendTensDigit * 10, minuend, Operator.SUBTRACTION);
  },
};

const generator42 = {
  name: 'Check + and -',
  generator: generateQuestionForTrick42,
};

const generator43 = {
  name: 'Multiplying by 75',
  generator: function(): Question {
    const x = (2 + randomInt(21)) * 4;
    return randomMultiplicationOrder(75, x);
  },
};

const generator44 = {
  name: 'Dividing by 75',
  generator: function(): Question {
    const x = (2 + randomInt(21)) * 3;
    return newDivision(x * randomFromArray([10, 100]), 75);
  },
};

const generator45 = {
  name: 'Dividing by 8',
  generator: function(): Question {
    const x = (2 + randomInt(21)) * 4;
    return newDivision(x * randomFromArray([1, 10]), 8);
  },
};

const generator46 = {
  name: 'Dividing by 15',
  generator: function(): Question {
    const x = (2 + randomInt(21)) * 3;
    return newDivision(x * randomFromArray([1, 10]), 15);
  },
};

const generator47 = {
  name: 'Estimate × by 33 or 34',
  generator: function(): Question {
    const x = (5 + randomInt(29)) * 3;
    return randomMultiplicationOrderForEstimate(randomFromArray([33, 34]), x, 0.02001);
  },
};

const generator48 = {
  name: 'Estimate ÷ by 33 or 34',
  generator: function(): Question {
    const x = (4 + randomInt(26));
    return newEstimate(
      x * randomFromArray([10, 100]),
      randomFromArray([33, 34]),
      Operator.DIVISION,
      0.02,
    );
  },
};

const generator49 = {
  name: 'Estimate × by 49 or 51',
  generator: function(): Question {
    const x = 11 + randomInt(89);
    return randomMultiplicationOrderForEstimate(randomFromArray([49, 51]), x, 0.02041);
  },
};

const generator50 = {
  name: 'Estimate ÷ by 49 or 51',
  generator: function(): Question {
    const x = (21 + randomInt(79));
    return newEstimate(
      x * randomFromArray([1, 10]),
      randomFromArray([49, 51]),
      Operator.DIVISION,
      0.02,
    );
  },
};

const generator51 = {
  name: 'Estimate × by 66 or 67',
  generator: function(): Question {
    const x = (4 + randomInt(30)) * 3;
    return randomMultiplicationOrderForEstimate(randomFromArray([66, 67]), x, 0.02);
  },
};

const generator52 = {
  name: 'Estimate ÷ by 66 or 67',
  generator: function(): Question {
    const x = (3 + randomInt(30)) * 2;
    return newEstimate(
      x * randomFromArray([10, 100]),
      randomFromArray([66, 67]),
      Operator.DIVISION,
      0.02,
    );
  },
};

const generator53 = {
  name: 'Estimate ÷ by 9',
  generator: function(): Question {
    const x = 11 + randomInt(89);
    return newEstimate(x * randomFromArray([1, 10]), 9, Operator.DIVISION, 0.02);
  },
};

const generator54 = {
  name: 'Estimate ÷ by 11',
  generator: function(): Question {
    const x = 11 + randomInt(89);
    return newEstimate(x * randomFromArray([1, 10]), 11, Operator.DIVISION, 0.02);
  },
};

const generator55 = {
  name: 'Estimate ÷ by 14',
  generator: function(): Question {
    const x = randomSimpleFactor();
    return newEstimate(x * randomFromArray([10, 100]), 14, Operator.DIVISION, 0.02);
  },
};

const generator56 = {
  name: 'Estimate ÷ by 17',
  generator: function(): Question {
    const x = randomSimpleFactor();
    return newEstimate(x * randomFromArray([10, 100]), 17, Operator.DIVISION, 0.02);
  },
};

const generator57 = {
  name: 'Multiply by regrouping',
  generator: function(): Question {
    const a = 3 + randomInt(6);
    const b = (10 * (2 + randomInt(8))) + (1 + randomInt(7));
    return randomMultiplicationOrder(a, b);
  },
};

const generator58 = {
  name: 'Multiply by augmenting',
  generator: function(): Question {
    const a = 3 + randomInt(5);
    const b = (10 * (1 + randomInt(9))) + (8 + randomInt(1));
    return randomMultiplicationOrder(a, b);
  },
};

const generator59 = {
  name: 'Multiply xyz by 11',
  generator: function(): Question {
    const x = 101 + randomInt(899);
    return randomMultiplicationOrder(11, x);
  },
};

const generator60 = {
  name: 'Divide by 9, 99, 999...',
  generator: function(): Question {
    const divisor = Math.random() < 0.1 ? 9 : 99;
    const x = 1 + randomInt(divisor - 1);
    // Even though we know the exact answer for this question, it is still implemented as an
    // estimate since there is currently no way to describe repeating digits in the UI.
    // A precission of 0.0001 will require 4 significant digits, which is enough to see the repition
    // pattern for divisions by 9 and 99.
    return newEstimate(x, divisor, Operator.DIVISION, 0.0001);
  },
};

export const BASIC_GENERATORS = {
  additonTable: (min: number, max: number) => {
    return {
      name: `Additon table from ${min} to ${max}`,
      generator: function(): Question {
        const a = min + randomInt(max + 1 - min);
        const b = min + randomInt(max + 1 - min);
        return newBinaryOperation(a, b, Operator.ADDITION);
      },
    };
  },
  multiplicationTable: (min: number, max: number) => {
    return {
      name: `Times table from ${min} to ${max}`,
      generator: function(): Question {
        const a = min + randomInt(max + 1 - min);
        const b = min + randomInt(max + 1 - min);
        return newMultiplication(a, b);
      },
    };
  },
  squares: (min: number, max: number) => {
    return {
      name: `Squares from ${min} to ${max}`,
      generator: function(): Question {
        const x = min + randomInt(max + 1 - min);
        return newMultiplication(x, x);
      },
    };
  },
};

export const TRICK_GENERATORS: QuestionGenerator[] = [
  generator1,
  generator2,
  generator3,
  generator4,
  generator5,
  generator6,
  generator7,
  generator8,
  generator9,
  generator10,
  generator11,
  generator12,
  generator13,
  generator14,
  generator15,
  generator16,
  generator17,
  generator18,
  generator19,
  generator20,
  generator21,
  generator22,
  generator23,
  generator24,
  generator25,
  generator26,
  generator27,
  generator28,
  generator29,
  generator30,
  generator31,
  generator32,
  generator33,
  generator34,
  generator35,
  generator36,
  generator37,
  generator38,
  generator39,
  generator40,
  generator41,
  generator42,
  generator43,
  generator44,
  generator45,
  generator46,
  generator47,
  generator48,
  generator49,
  generator50,
  generator51,
  generator52,
  generator53,
  generator54,
  generator55,
  generator56,
  generator57,
  generator58,
  generator59,
  generator60,
];
