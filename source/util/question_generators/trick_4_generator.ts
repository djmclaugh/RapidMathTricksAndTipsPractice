import {Question, newDivision} from "../question";
import {randomNonTrivialTwoDigitFactor} from "./generator_util";

export function generateQuestionForTrick4(): Question {
  const x = randomNonTrivialTwoDigitFactor();
  return newDivision(x * 4, 4);
}
