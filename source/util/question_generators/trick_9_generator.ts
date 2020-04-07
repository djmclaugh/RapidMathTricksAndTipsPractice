import {Question, newMultiplication} from "../question";
import {randomNonTrivialTwoDigitFactor} from "./generator_util";

export function generateQuestionForTrick9(): Question {
  const x = randomNonTrivialTwoDigitFactor();
  return Math.random() < 0.5 ? newMultiplication(25, x) : newMultiplication(x, 25);
}
