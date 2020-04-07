import {Question, newMultiplication} from "../question";
import {randomNonTrivialTwoDigitFactor} from "./generator_util";

export function generateQuestionForTrick8(): Question {
  const x = randomNonTrivialTwoDigitFactor();
  return Math.random() < 0.5 ? newMultiplication(11, x) : newMultiplication(x, 11);
}
