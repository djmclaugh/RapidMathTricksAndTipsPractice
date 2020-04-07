import {Question} from "../question";
import {generateQuestionForTrick1} from "./trick_1_generator";
import {generateQuestionForTrick2} from "./trick_2_generator";
import {generateQuestionForTrick3} from "./trick_3_generator";
import {generateQuestionForTrick4} from "./trick_4_generator";
import {generateQuestionForTrick5} from "./trick_5_generator";
import {generateQuestionForTrick6} from "./trick_6_generator";

export const GENERATORS: Array<() => Question> = [
  generateQuestionForTrick1,
  generateQuestionForTrick2,
  generateQuestionForTrick3,
  generateQuestionForTrick4,
  generateQuestionForTrick5,
  generateQuestionForTrick6,
]
