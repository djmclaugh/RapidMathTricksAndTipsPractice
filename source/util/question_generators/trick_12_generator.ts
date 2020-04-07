import {Question, newMultiplication} from "../question";
import {randomTwoDigitFactor} from "./generator_util";

export function generateQuestionForTrick12(): Question {
  const x = randomTwoDigitFactor();
  return Math.random() < 0.5 ? newMultiplication(101, x) : newMultiplication(x, 101);
}
