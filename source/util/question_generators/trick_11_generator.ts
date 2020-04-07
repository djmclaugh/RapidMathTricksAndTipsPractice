import {Question, newMultiplication} from "../question";
import {randomTwoDigitFactor} from "./generator_util";

export function generateQuestionForTrick11(): Question {
  const x = randomTwoDigitFactor();
  return Math.random() < 0.5 ? newMultiplication(99, x) : newMultiplication(x, 99);
}
