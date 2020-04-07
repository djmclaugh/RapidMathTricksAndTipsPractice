import {Question, newDivision} from "../question";
import {randomNonTrivialTwoDigitFactor} from "./generator_util";

export function generateQuestionForTrick6(): Question {
  return newDivision(randomNonTrivialTwoDigitFactor(), 5);
}
