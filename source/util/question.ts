import * as assert from 'assert';
import {Rational} from "./rational";

function assertNever(x: never): never {
    throw new Error("Unexpected object: " + x);
}

export enum QuestionType {
  ADDITION,
  SUBTRACTION,
  MULTIPLICATION,
  DIVISION,
  MULTIPLICATION_DIGIT_SUM_CHECK,
  DIVISION_DIGIT_SUM_CHECK,
}

export const QUESTION_TYPES_WITH_NUMBER_ANSWER = [
  QuestionType.ADDITION,
  QuestionType.SUBTRACTION,
  QuestionType.MULTIPLICATION,
  QuestionType.DIVISION,
];

export const QUESTION_TYPES_WITH_BOOLEAN_ANSWER = [
  QuestionType.MULTIPLICATION_DIGIT_SUM_CHECK,
  QuestionType.DIVISION_DIGIT_SUM_CHECK,
];

export interface Question {
  type: QuestionType,
  operands: number[]
}

export function newAddition(a: number, b: number) {
  return {type: QuestionType.ADDITION, operands: [a, b]};
}

export function newSubtraction(a: number, b: number) {
  return {type: QuestionType.SUBTRACTION, operands: [a, b]};
}

export function newMultiplication(a: number, b: number) {
  return {type: QuestionType.MULTIPLICATION, operands: [a, b]};
}

export function newDivision(a: number, b: number) {
  return {type: QuestionType.DIVISION, operands: [a, b]};
}

export function newMultiplicationDigitSumCheck(a: number, b: number, product: number) {
  return {type: QuestionType.MULTIPLICATION_DIGIT_SUM_CHECK, operands: [a, b, product]};
}

export function newDivisionDigitSumCheck(a: number, b: number, quotient: number) {
  return {type: QuestionType.DIVISION_DIGIT_SUM_CHECK, operands: [a, b, quotient]};
}

export function newDivisionFromMultiplication(multiplication: Question): Question {
  assert(multiplication.type === QuestionType.MULTIPLICATION);
  return {
    type: QuestionType.DIVISION,
    operands: [getNumberAnswer(multiplication), multiplication.operands[0]]
  };
}

export function getNumberAnswer(question: Question): number {
  switch(question.type) {
    case QuestionType.ADDITION:
      return getAdditionAnswer(question);
    case QuestionType.SUBTRACTION:
      return getSubtractionAnswer(question);
    case QuestionType.MULTIPLICATION:
      return getMultiplicationAnswer(question);
    case QuestionType.DIVISION:
      return getDivisionAnswer(question);
    case QuestionType.MULTIPLICATION_DIGIT_SUM_CHECK:
    case QuestionType.DIVISION_DIGIT_SUM_CHECK:
      throw new Error("Answer to provided question is not a number");
    default:
      return assertNever(question.type);
  }
}

export function getBooleanAnswer(question: Question): boolean {
  switch(question.type) {
    case QuestionType.ADDITION:
    case QuestionType.SUBTRACTION:
    case QuestionType.MULTIPLICATION:
    case QuestionType.DIVISION:
        throw new Error("Answer to provided question is not a boolean");
    case QuestionType.MULTIPLICATION_DIGIT_SUM_CHECK:
        return getMultiplicationDigitSumCheckAnswer(question);
    case QuestionType.DIVISION_DIGIT_SUM_CHECK:
        return getDivisionDigitSumCheckAnswer(question);
    default:
      return assertNever(question.type);
  }
}

function getAdditionAnswer(question: Question): number {
  assert(question.type === QuestionType.ADDITION);
  assert(question.operands.length === 2);
  const a: Rational = Rational.fromNumber(question.operands[0]);
  const b: Rational = Rational.fromNumber(question.operands[1]);
  return Rational.add(a, b).toNumber();
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
    operands: [question.operands[2], question.operands[1], question.operands[0]]
  });
}

function digitSumMod9(x: number): number {
  if (Number.isInteger(x)) {
    return Math.abs(x) % 9;
  }
  let parts = x.toString().split(".");
  return digitSumMod9(parseInt(parts[0] + parts[1]));
}
