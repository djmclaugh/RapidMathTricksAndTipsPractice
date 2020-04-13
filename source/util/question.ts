import * as assert from 'assert';
import { Rational } from './rational';

function assertNever(x: never): never {
  throw new Error('Unexpected object: ' + x);
}

export enum QuestionType {
  SUM,
  ARITHMETIC_PROGRESSION_SUM,
  SUBTRACTION,
  MULTIPLICATION,
  DIVISION,
  ADDITION_DIGIT_SUM_CHECK,
  SUBTRACTION_DIGIT_SUM_CHECK,
  MULTIPLICATION_DIGIT_SUM_CHECK,
  DIVISION_DIGIT_SUM_CHECK,
}

export const QUESTION_TYPES_WITH_NUMBER_ANSWER = [
  QuestionType.SUM,
  QuestionType.ARITHMETIC_PROGRESSION_SUM,
  QuestionType.SUBTRACTION,
  QuestionType.MULTIPLICATION,
  QuestionType.DIVISION,
];

export const QUESTION_TYPES_WITH_BOOLEAN_ANSWER = [
  QuestionType.ADDITION_DIGIT_SUM_CHECK,
  QuestionType.SUBTRACTION_DIGIT_SUM_CHECK,
  QuestionType.MULTIPLICATION_DIGIT_SUM_CHECK,
  QuestionType.DIVISION_DIGIT_SUM_CHECK,
];

export interface Question {
  type: QuestionType,
  operands: number[]
}

export function newAddition(a: number, b: number) {
  return { type: QuestionType.SUM, operands: [a, b] };
}

export function newSum(summands:number[]) {
  return { type: QuestionType.SUM, operands: summands };
}

export function newArithmeticProgressionSum(
  initialTerm: number,
  difference: number,
  numberOfTerms: number,
) {
  return {
    type: QuestionType.ARITHMETIC_PROGRESSION_SUM,
    operands: [initialTerm, difference, numberOfTerms],
  };
}

export function newSubtraction(a: number, b: number) {
  return { type: QuestionType.SUBTRACTION, operands: [a, b] };
}

export function newMultiplication(a: number, b: number) {
  return { type: QuestionType.MULTIPLICATION, operands: [a, b] };
}

export function newDivision(a: number, b: number) {
  return { type: QuestionType.DIVISION, operands: [a, b] };
}

export function newAdditionDigitSumCheck(a: number, b: number, sum: number) {
  return { type: QuestionType.ADDITION_DIGIT_SUM_CHECK, operands: [a, b, sum] };
}

export function newSubtractionDigitSumCheck(a: number, b: number, difference: number) {
  return { type: QuestionType.SUBTRACTION_DIGIT_SUM_CHECK, operands: [a, b, difference] };
}

export function newMultiplicationDigitSumCheck(a: number, b: number, product: number) {
  return { type: QuestionType.MULTIPLICATION_DIGIT_SUM_CHECK, operands: [a, b, product] };
}

export function newDivisionDigitSumCheck(a: number, b: number, quotient: number) {
  return { type: QuestionType.DIVISION_DIGIT_SUM_CHECK, operands: [a, b, quotient] };
}

export function newDivisionFromMultiplication(multiplication: Question): Question {
  assert(multiplication.type === QuestionType.MULTIPLICATION);
  return {
    type: QuestionType.DIVISION,
    operands: [getNumberAnswer(multiplication), multiplication.operands[0]],
  };
}

export function getNumberAnswer(question: Question): number {
  switch (question.type) {
    case QuestionType.SUM:
      return getSumAnswer(question);
    case QuestionType.ARITHMETIC_PROGRESSION_SUM:
      return getArithmeticProgressionSumAnswer(question);
    case QuestionType.SUBTRACTION:
      return getSubtractionAnswer(question);
    case QuestionType.MULTIPLICATION:
      return getMultiplicationAnswer(question);
    case QuestionType.DIVISION:
      return getDivisionAnswer(question);
    case QuestionType.ADDITION_DIGIT_SUM_CHECK:
    case QuestionType.SUBTRACTION_DIGIT_SUM_CHECK:
    case QuestionType.MULTIPLICATION_DIGIT_SUM_CHECK:
    case QuestionType.DIVISION_DIGIT_SUM_CHECK:
      throw new Error('Answer to provided question is not a number');
    default:
      return assertNever(question.type);
  }
}

export function getBooleanAnswer(question: Question): boolean {
  switch (question.type) {
    case QuestionType.SUM:
    case QuestionType.ARITHMETIC_PROGRESSION_SUM:
    case QuestionType.SUBTRACTION:
    case QuestionType.MULTIPLICATION:
    case QuestionType.DIVISION:
      throw new Error('Answer to provided question is not a boolean');
    case QuestionType.ADDITION_DIGIT_SUM_CHECK:
      return getAdditionDigitSumCheckAnswer(question);
    case QuestionType.SUBTRACTION_DIGIT_SUM_CHECK:
      return getSubtractionDigitSumCheckAnswer(question);
    case QuestionType.MULTIPLICATION_DIGIT_SUM_CHECK:
      return getMultiplicationDigitSumCheckAnswer(question);
    case QuestionType.DIVISION_DIGIT_SUM_CHECK:
      return getDivisionDigitSumCheckAnswer(question);
    default:
      return assertNever(question.type);
  }
}

function getSumAnswer(question: Question): number {
  assert(question.type === QuestionType.SUM);
  let total: Rational = new Rational(0, 1);
  for (const summand of question.operands) {
    total = Rational.add(total, Rational.fromNumber(summand));
  }
  return total.toNumber();
}

function getArithmeticProgressionSumAnswer(question: Question): number {
  assert(question.type === QuestionType.ARITHMETIC_PROGRESSION_SUM);
  assert(question.operands.length === 3);
  // Initital term
  const a = Rational.fromNumber(question.operands[0]);
  // Difference between terms
  const d = Rational.fromNumber(question.operands[1]);
  // Number of terms
  const n = Rational.fromNumber(question.operands[2]);

  // Constants that will be needed in rational form
  const one = new Rational(1, 1);
  const two = new Rational(2, 1);

  const lastTerm = Rational.add(a, Rational.mult(Rational.sub(n, one), d));
  const sum = Rational.mult(Rational.div(Rational.add(a, lastTerm), two), n);

  return sum.toNumber();
}

function getSubtractionAnswer(question: Question): number {
  assert(question.type === QuestionType.SUBTRACTION);
  assert(question.operands.length === 2);
  const a: Rational = Rational.fromNumber(question.operands[0]);
  const b: Rational = Rational.fromNumber(question.operands[1]);
  return Rational.sub(a, b).toNumber();
}

function getMultiplicationAnswer(question: Question): number {
  assert(question.type === QuestionType.MULTIPLICATION);
  assert(question.operands.length === 2);
  const a: Rational = Rational.fromNumber(question.operands[0]);
  const b: Rational = Rational.fromNumber(question.operands[1]);
  return Rational.mult(a, b).toNumber();
}

function getDivisionAnswer(question: Question): number {
  assert(question.type === QuestionType.DIVISION);
  assert(question.operands.length === 2);
  const a: Rational = Rational.fromNumber(question.operands[0]);
  const b: Rational = Rational.fromNumber(question.operands[1]);
  return Rational.div(a, b).toNumber();
}

function getAdditionDigitSumCheckAnswer(question: Question): boolean {
  assert(question.type === QuestionType.ADDITION_DIGIT_SUM_CHECK);
  assert(question.operands.length === 3);
  const digitSumA: number = digitSumMod9(question.operands[0]);
  const digitSumB: number = digitSumMod9(question.operands[1]);
  const digitSumSum: number = digitSumMod9(question.operands[2]);
  return digitSumMod9(digitSumA + digitSumB - digitSumSum) === 0;
}

function getSubtractionDigitSumCheckAnswer(question: Question): boolean {
  assert(question.type === QuestionType.SUBTRACTION_DIGIT_SUM_CHECK);
  assert(question.operands.length === 3);
  const digitSumA: number = digitSumMod9(question.operands[0]);
  const digitSumB: number = digitSumMod9(question.operands[1]);
  const digitSumDifference: number = digitSumMod9(question.operands[2]);
  return digitSumMod9(digitSumA - digitSumB - digitSumDifference) === 0;
}

function getMultiplicationDigitSumCheckAnswer(question: Question): boolean {
  assert(question.type === QuestionType.MULTIPLICATION_DIGIT_SUM_CHECK);
  assert(question.operands.length === 3);
  const digitSumMultiplicand: number = digitSumMod9(question.operands[0]);
  const digitSumMultiplier: number = digitSumMod9(question.operands[1]);
  const digitSumProduct: number = digitSumMod9(question.operands[2]);
  return digitSumMod9(digitSumMultiplier * digitSumMultiplicand) === digitSumProduct;
}

function getDivisionDigitSumCheckAnswer(question: Question): boolean {
  assert(question.type === QuestionType.DIVISION_DIGIT_SUM_CHECK);
  assert(question.operands.length === 3);
  return getMultiplicationDigitSumCheckAnswer({
    type: QuestionType.MULTIPLICATION_DIGIT_SUM_CHECK,
    operands: [question.operands[2], question.operands[1], question.operands[0]],
  });
}

function digitSumMod9(x: number): number {
  if (Number.isInteger(x)) {
    return x % 9;
  }
  const parts = x.toString().split('.');
  return digitSumMod9(parseInt(parts[0] + parts[1]));
}
