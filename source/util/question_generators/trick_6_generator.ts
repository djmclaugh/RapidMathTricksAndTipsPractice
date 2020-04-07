import {Question, newDivision} from "../question";
import {randomTwoDigitFactor} from "./generator_util";

export function generateQuestionForTrick6(): Question {
  return newDivision(randomTwoDigitFactor(), 5);
}
