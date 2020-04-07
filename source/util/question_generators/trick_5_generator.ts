import {Question, newMultiplication} from "../question";
import {randomTwoDigitFactor} from "./generator_util";

export function generateQuestionForTrick5(): Question {
  const x = randomTwoDigitFactor();
  return Math.random() < 0.5 ? newMultiplication(5, x) : newMultiplication(x, 5);
}
