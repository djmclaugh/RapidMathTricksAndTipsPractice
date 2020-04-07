import {Question, newMultiplication} from "../question";
import {randomTwoDigitFactor} from "./generator_util";

export function generateQuestionForTrick3(): Question {
  const x = randomTwoDigitFactor();
  return Math.random() < 0.5 ? newMultiplication(4, x) : newMultiplication(x, 4);
}
