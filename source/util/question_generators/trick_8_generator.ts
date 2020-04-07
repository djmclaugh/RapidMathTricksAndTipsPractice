import {Question, newMultiplication} from "../question";
import {randomTwoDigitFactor} from "./generator_util";

export function generateQuestionForTrick8(): Question {
  const x = randomTwoDigitFactor();
  return Math.random() < 0.5 ? newMultiplication(11, x) : newMultiplication(x, 11);
}
