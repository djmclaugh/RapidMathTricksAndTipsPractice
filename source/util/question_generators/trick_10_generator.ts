import {Question, newDivision} from "../question";
import {randomNonTrivialTwoDigitFactor} from "./generator_util";

export function generateQuestionForTrick10(): Question {
  return newDivision(randomNonTrivialTwoDigitFactor() * 10, 25);
}
