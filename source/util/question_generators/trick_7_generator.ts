import {Question, newMultiplication} from "../question";
import {randomInt} from "../random_util";

export function generateQuestionForTrick7(): Question {
  // We want x to be a number that ends in 5 between 15 and 115 inclusively
  let x = ((randomInt(11) + 1) * 10) + 5;
  return newMultiplication(x, x);
}
