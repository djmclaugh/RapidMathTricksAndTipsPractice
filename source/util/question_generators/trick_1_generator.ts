import {Question, QuestionType, newMultiplication, newDivision, newDivisionFromMultiplication} from "../question";

// Up to what number do we expect the user to know their times table by heart.
const TIMES_TABLE_LIMIT = 12;
// The chance of generating a multiplication question instead of a division question.
// Using the same ratio as the book.
const MULTIPLICATION_TO_DIVISION_RATIO = 8/14

export function generateQuestionForTrick1(): Question {
  return Math.random() < MULTIPLICATION_TO_DIVISION_RATIO ?
      generateMultiplication() : generateDivision();
}

// returns a uniformaly random integer from the interval [0, max).
function randomInt(max: number): number {
  return Math.floor(Math.random() * Math.ceil(max))
}

function generateMultiplication(): Question {
  const a = getRandomNumberFromTimesTable();
  const b = getRandomNumberFromTimesTable();

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

function getRandomNumberFromTimesTable(): number {
  // Generate a number from [2, TIMES_TABLE_LIMIT] \ 10.
  // We ignore 0 and 1 because they are too easy to multiply/divide.
  // We ignore 10 for the same reason we ignor 1.
  let result = randomInt(TIMES_TABLE_LIMIT - 2);  // [0, TIMES_TABLE_LIMIT - 2)
  result += 2;                                    // [2, TIMES_TABLE_LIMIT)
  if (result >= 10) {
    result += 1;
  }                                               // [2,9] + [11, TIMES_TABLE_LIMIT]
  return result;
}

export function exerciseForTrick1(): Question[] {
  return [
    newMultiplication(40, 7),
    newMultiplication(6, 800),
    newMultiplication(500, 30),
    newMultiplication(60, 900),
    newMultiplication(70, 120),
    newMultiplication(15, 150),
    newMultiplication(400, 50),
    newMultiplication(24, 400),
    newDivision(3600, 900),
    newDivision(5600, 7),
    newDivision(5200, 130),
    newDivision(800, 16),
    newDivision(42000, 60),
    newDivision(1800, 90),
  ]
}
