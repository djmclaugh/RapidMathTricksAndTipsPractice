import * as assert from 'assert';
import { Rational } from './rational';

function assertNever(x: never): never {
  throw new Error('Unexpected object: ' + x);
}

export enum Operator {
  ADDITION,
  SUBTRACTION,
  MULTIPLICATION,
  DIVISION,
}

function operatorToFunction(o: Operator): ((a: Rational, b: Rational) => Rational) {
  switch (o) {
    case Operator.ADDITION:
      return Rational.add;
    case Operator.SUBTRACTION:
      return Rational.sub;
    case Operator.MULTIPLICATION:
      return Rational.mult;
    case Operator.DIVISION:
      return Rational.div;
    default:
      assertNever(o);
  }
}

export enum QuestionType {
  RESULT,
  ESTIMATE,
  DIGIT_CHECK,
}

export interface QuestionData {
  type: QuestionType,
  operator: Operator,
  operands: number[],
  // Set if and only if the type is ESTIMATE
  estimateDetails?: {
    // All answers in the range
    // [result * (1 - acceptableRelativeError), result * (1 + acceptableRelativeError)] will be
    // considered correct
    acceptableRelativeError: number
  }
  // Set if and only if the type is DIGIT_CHECK
  digitCheckDetails?: {
    proposedResult: number
  }
}

export class Question {
  public readonly data: QuestionData

  constructor(data: QuestionData) {
    if (data.type === QuestionType.ESTIMATE) {
      assert(data.estimateDetails !== undefined);
    }
    if (data.type === QuestionType.DIGIT_CHECK) {
      assert(data.digitCheckDetails !== undefined);
    }
    this.data = data;
  };

  public expectsNumberAnswer(): boolean {
    return this.data.type === QuestionType.RESULT || this.data.type === QuestionType.ESTIMATE;
  }

  public expectsBooleanAnswer(): boolean {
    return this.data.type === QuestionType.DIGIT_CHECK;
  }

  public computeResult(): number {
    return evaluateOperation(this.data).toNumber();
  }

  public checkNumberAnswer(answer: number) {
    return isCorrectNumberAnswer(this.data, answer);
  }

  public checkBooleanAnswer(answer: boolean) {
    return isCorrectBooleanAnswer(this.data, answer);
  }

  // Usefull for the UI to know since if the operands have some kind of pattern to them, we don't
  // have to show them all.
  // Returns the number of inital terms needed to understand the pattern. The final term will have
  // to shown regardles to at least know how many operands there are in total.
  // Returns this.data.operands.length if the operands to not follow a commonly known pattern and
  // all of them have to be shown.
  public numberOfOperandsNeededToUnderstandPattern(): number {
    if (this.areOperandsArithmeticProgression()) {
      // If three operands with the same consecutive difference are shown followed by elipses, it's
      // generaly understood that the rest of the operands follow the same arithmetic progression.
      return 3;
    }
    return this.data.operands.length;
  }

  private areOperandsArithmeticProgression(): boolean {
    const operands = this.data.operands;
    if (operands.length < 3) {
      // vacuously true...
      return true;
    }
    const difference: Rational =
        Rational.sub(Rational.fromNumber(operands[1]), Rational.fromNumber(operands[0]));
    for (let i = 2; i < operands.length; ++i) {
      const currentDiff =
          Rational.sub(Rational.fromNumber(operands[i]), Rational.fromNumber(operands[i - 1]));
      if (!difference.equals(currentDiff)) {
        return false;
      }
    }
    return true;
  }
}

export function newSum(summands:number[]): Question {
  return new Question({
    type: QuestionType.RESULT,
    operator: Operator.ADDITION,
    operands: summands,
  });
}

export function newArithmeticProgressionSum(
  initialTerm: number,
  difference: number,
  numberOfTerms: number,
): Question {
  const summands: number[] = [];
  for (let i = 0; i < numberOfTerms; ++i) {
    summands.push(initialTerm + (i * difference));
  }
  return new Question({
    type: QuestionType.RESULT,
    operator: Operator.ADDITION,
    operands: summands,
  });
}

export function newBinaryOperation(a: number, b: number, operator: Operator): Question {
  return new Question({ type: QuestionType.RESULT, operator: operator, operands: [a, b] });
}

export function newMultiplication(a: number, b: number): Question {
  return newBinaryOperation(a, b, Operator.MULTIPLICATION);
}

export function newDivision(a: number, b: number): Question {
  return newBinaryOperation(a, b, Operator.DIVISION);
}

export function newEstimate(
  a: number,
  b: number,
  operator: Operator,
  acceptableRelativeError: number,
): Question {
  return new Question({
    type: QuestionType.ESTIMATE,
    operator: operator,
    operands: [a, b],
    estimateDetails: {
      acceptableRelativeError: acceptableRelativeError,
    },
  });
}

export function newDigitSumCheck(
  a: number,
  b: number,
  operator: Operator,
  proposedResult: number,
): Question {
  return new Question({
    type: QuestionType.DIGIT_CHECK,
    operator: operator,
    operands: [a, b],
    digitCheckDetails: {
      proposedResult: proposedResult,
    },
  });
}

export function newDivisionFromMultiplication(multiplication: Question): Question {
  assert(multiplication.data.type === QuestionType.RESULT);
  assert(multiplication.data.operator === Operator.MULTIPLICATION);
  assert(multiplication.data.operands.length === 2);
  return newBinaryOperation(
    evaluateOperation(multiplication.data).toNumber(),
    multiplication.data.operands[0],
    Operator.DIVISION,
  );
}

function evaluateOperation(question: QuestionData): Rational {
  const operation: (a: Rational, b: Rational) => Rational = operatorToFunction(question.operator);
  const operands: Rational[] = question.operands.map((x) => Rational.fromNumber(x));
  const firstOperand: Rational = operands[0];
  const restOfOperands: Rational[] = operands.slice(1);
  return restOfOperands.reduce((accumulator, currentValue) => {
    return operation(accumulator, currentValue);
  }, firstOperand);
}

export function isCorrectNumberAnswer(question: QuestionData, answer: number) {
  if (question.type === QuestionType.RESULT) {
    return answer === evaluateOperation(question).toNumber();
  } else if (question.type === QuestionType.ESTIMATE) {
    const exactAnswer = evaluateOperation(question);
    const one = new Rational(1, 1);
    const error = Rational.fromNumber(question.estimateDetails!.acceptableRelativeError);
    const lowerBound = Rational.mult(exactAnswer, Rational.sub(one, error));
    const upperBound = Rational.mult(exactAnswer, Rational.add(one, error));
    return lowerBound.toNumber() <= answer && answer <= upperBound.toNumber();
  }
  throw Error(`A number answer is only expected for questions of type RESULT and ESTIMATE, not for
    questions of type ${question.type}.`);
}

export function isCorrectBooleanAnswer(question: QuestionData, answer: boolean) {
  if (question.type === QuestionType.DIGIT_CHECK) {
    const proposedResult = question.digitCheckDetails!.proposedResult;
    const exactResult = evaluateOperation(question).toNumber();
    const hasSameDigitSum = digitSumMod9(proposedResult) === digitSumMod9(exactResult);
    return answer === hasSameDigitSum;
  }
  throw Error(`A boolean answer is only expected for questions of type DIGIT_CHECK, not for
    questions of type ${question.type}.`);
}

function digitSumMod9(x: number): number {
  if (Number.isInteger(x)) {
    return x % 9;
  }
  const parts = x.toString().split('.');
  return digitSumMod9(parseInt(parts[0] + parts[1]));
}
