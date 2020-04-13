import {
  Question,
  newAddition,
  newSum,
  newArithmeticProgressionSum,
  newSubtraction,
  newMultiplication,
  newDivision,
} from '../question';
import { randomInt, randomFromArray, suffle } from '../random_util';
import {
  randomSimpleFactor,
  randomTwoDigitFactor,
  randomNonTrivialTwoDigitFactor,
  TRICKY_SQUARE_ROOTS,
  SIMPLE_FACTORS,
} from './generator_util';

import { generateQuestionForTrick1 } from './trick_1_generator';
import { generateQuestionForTrick2 } from './trick_2_generator';
import { generateQuestionForTrick14 } from './trick_14_generator';

export interface QuestionGenerator {
  name: string,
  generator: () => Question
}

function randomAdditionOrder(a: number, b: number): Question {
  return randomFromArray([newAddition(a, b), newAddition(b, a)]);
}

function randomMultiplicationOrder(a: number, b: number): Question {
  return randomFromArray([newMultiplication(a, b), newMultiplication(b, a)]);
}

const generator1 = {
  name: 'Multiplying and dividing with zeroes',
  generator: generateQuestionForTrick1,
};

const generator2 = {
  name: 'Multiplying and dividing with decimal points',
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
  name: 'Multiply 2 digits by 11',
  generator: function(): Question {
    const x = randomNonTrivialTwoDigitFactor();
    return randomMultiplicationOrder(11, x);
  },
};

const generator9 = {
  name: 'Multiplying by 25',
  generator: function(): Question {
    const x = randomNonTrivialTwoDigitFactor();
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
  name: 'Multiplying a one/two digit number by 99',
  generator: function(): Question {
    const x = randomTwoDigitFactor();
    return randomMultiplicationOrder(99, x);
  },
};

const generator12 = {
  name: 'Multiplying a one/two digit number by 101',
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
  name: 'Multiplying two numbers whose difference is 2',
  generator: function(): Question {
    const x = randomFromArray(ROOTS_FOR_TRICK_13);
    return randomMultiplicationOrder(x - 1, x + 1);
  },
};

const generator14 = {
  name: 'Check multiplications and divisions',
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
  name: 'Multiplying numbers with a special relationship',
  generator: function(): Question {
    // The special relationship is the same tens digit and ones digits that add up to 10.
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
  name: 'Square two digit number starting with a 5',
  generator: function(): Question {
    const x = randomFromArray([51, 52, 53, 54, 55, 56, 57, 58, 59]);
    return newMultiplication(x, x);
  },
};

const generator24 = {
  name: 'Square two digit number starting ending a 1',
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
const ROOTS_FOR_TRICK_26: number[] = TRICKY_SQUARE_ROOTS.concat(
  SIMPLE_FACTORS.map((x) => x * 10).filter((x) => !TRICKY_SQUARE_ROOTS.includes(x)),
);
const generator26 = {
  name: 'Multiplying two numbers whose difference is 4',
  generator: function(): Question {
    const x = randomFromArray(ROOTS_FOR_TRICK_26);
    return randomMultiplicationOrder(x - 2, x + 2);
  },
};

const generator27 = {
  name: 'Multiply in two steps',
  generator: function(): Question {
    return newMultiplication(randomSimpleFactor(), randomFromArray([7, 8, 9, 11, 12]) * 2);
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
    return newSubtraction(minuend + difference, minuend);
  },
};

const generator30 = {
  name: 'Subtract by adding (variation)',
  generator: function(): Question {
    return newSubtraction(101 + randomInt(70), 99 - randomInt(70));
  },
};

const generator31 = {
  name: 'Subtract by altering',
  generator: function(): Question {
    const subtrahendTensDigit = 2 + randomInt(8);
    const subtrahend = (subtrahendTensDigit * 10) + randomInt(8);
    const minuendTensDigit = randomInt(subtrahendTensDigit);
    const minuend = (minuendTensDigit * 10) + 8 + randomInt(1);
    return newSubtraction(subtrahend, minuend);
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
    const summands: number[] = [];
    for (let i = 0; i < 8; ++i) {
      summands.push(1 + randomInt(9));
    }
    return newSum(summands);
  },
};

const generator34 = {
  name: 'Add by without carrying',
  generator: function(): Question {
    const summands: number[] = [];
    for (let i = 0; i < 8; ++i) {
      summands.push(11 + randomInt(89));
    }
    return newSum(summands);
  },
};

// TODO: Generator 35
// TODO: Generator 36
// TODO: Generator 37
// TODO: Generator 38

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
    return newSubtraction(subtrahendTensDigit * 10, minuend);
  },
};

export const GENERATORS: QuestionGenerator[] = [
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
  generator39,
  generator40,
  generator41,
];
