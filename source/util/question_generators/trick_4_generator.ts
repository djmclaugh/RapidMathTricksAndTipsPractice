import {Question, newDivision} from "../question";
import {randomTwoDigitFactor} from "./generator_util";

export function generateQuestionForTrick4(): Question {
  const x = randomTwoDigitFactor();
  return newDivision(x * 4, 4);
}
export function exerciseForTrick4(): Question[] {
  return [
    newDivision(48, 4),
    newDivision(68, 4),
    newDivision(180, 4),
    newDivision(132, 4),
    newDivision(260, 4),
    newDivision(96, 4),
    newDivision(56, 4),
    newDivision(88, 4),
    newDivision(140, 4),
    newDivision(220, 4),
    newDivision(64, 4),
    newDivision(72, 4),
    newDivision(380, 4),
    newDivision(340, 4),
    newDivision(420, 4),
    newDivision(52, 4),
  ]
}
