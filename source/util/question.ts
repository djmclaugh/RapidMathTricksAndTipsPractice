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
}

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

export function newDivisionFromMultiplication(multiplication: Question): Question {
  assert(multiplication.type === QuestionType.MULTIPLICATION);
  return {
    type: QuestionType.DIVISION,
    operands: [getAnwser(multiplication), multiplication.operands[0]]
  };
}

export function getAnwser(question: Question): number {
  switch(question.type) {
    case QuestionType.ADDITION:
      return getAdditionAnswer(question);
    case QuestionType.SUBTRACTION:
      return getSubtractionAnswer(question);
    case QuestionType.MULTIPLICATION:
      return getMultiplicationAnswer(question);
    case QuestionType.DIVISION:
      return getDivisionAnswer(question);
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
