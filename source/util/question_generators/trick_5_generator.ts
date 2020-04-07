import {Question, newMultiplication} from "../question";
import {randomNonTrivialTwoDigitFactor} from "./generator_util";

export function generateQuestionForTrick5(): Question {
  const x = randomNonTrivialTwoDigitFactor();
  return Math.random() < 0.5 ? newMultiplication(5, x) : newMultiplication(x, 5);
}
