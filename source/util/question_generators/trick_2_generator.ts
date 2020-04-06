import {Question, QuestionType, newMultiplication, newDivision, newDivisionFromMultiplication} from "../question";

// Up to what number do we expect the user to know their times table by heart.
const TIMES_TABLE_LIMIT = 12;
// The chance of generating a multiplication question instead of a division question.
// Using the same ratio as the book.
const MULTIPLICATION_TO_DIVISION_RATIO = 8/14

export function generateQuestionForTrick2(): Question {
  return Math.random() < MULTIPLICATION_TO_DIVISION_RATIO ?
      generateMultiplication() : generateDivision();
}

// returns a uniformaly random integer from the interval [0, max).
function randomInt(max: number): number {
  return Math.floor(Math.random() * Math.ceil(max))
}

function generateMultiplication(): Question {
  const a = getRandomNumberFromTimesTable() / 10;
  let b = getRandomNumberFromTimesTable() * 10;
  if (Math.random() < 0.2) {
    b *= 10;
  }

  return Math.random() < 0.5 ? newMultiplication(a, b) : newMultiplication(b, a);
}

function generateDivision(): Question {
  const a = getRandomNumberFromTimesTable() / 10;
  let b = getRandomNumberFromTimesTable() * 10;
  if (Math.random() < 0.2) {
    b *= 10;
  }

  return newDivisionFromMultiplication(newMultiplication(a, b));
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
