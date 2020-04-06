import {Question, newMultiplication} from "../question";
import {randomTwoDigitFactor} from "./generator_util";

export function generateQuestionForTrick3(): Question {
  const x = randomTwoDigitFactor();
  return Math.random() < 0.5 ? newMultiplication(4, x) : newMultiplication(x, 4);
}
export function exerciseForTrick2(): Question[] {
  return [
    newMultiplication(35, 4),
    newMultiplication(23, 4),
    newMultiplication(14, 4),
    newMultiplication(85, 4),
    newMultiplication(4, 41),
    newMultiplication(4, 26),
    newMultiplication(4, 55),
    newMultiplication(4, 72),
    newMultiplication(61, 4),
    newMultiplication(17, 4),
    newMultiplication(95, 4),
    newMultiplication(48, 4),
    newMultiplication(4, 29),
    newMultiplication(4, 83),
    newMultiplication(4, 65),
    newMultiplication(4, 53),
  ]
}
