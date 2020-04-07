import {Question, newDivision} from "../question";
import {randomTwoDigitFactor} from "./generator_util";

export function generateQuestionForTrick4(): Question {
  const x = randomTwoDigitFactor();
  return newDivision(x * 4, 4);
}
