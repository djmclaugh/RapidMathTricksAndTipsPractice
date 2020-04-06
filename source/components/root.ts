import Vue, { VNode } from "vue";

import { QuestionCardComponent } from "./question_card";
import { Question, QuestionType } from "../util/question";
import { generateQuestionForTrick1 } from "../util/question_generators/trick_1_generator";
import { generateQuestionForTrick2 } from "../util/question_generators/trick_2_generator";

function createNewQuestion(): Question {
  return Math.random() < 0.5 ? generateQuestionForTrick1() : generateQuestionForTrick2();
}

export const RootComponent = Vue.extend({
  data: function() {
    return {
      questions: [createNewQuestion()]
    }
  },
  components: {
    questionCard: QuestionCardComponent
  },
  methods: {
    processCorrect(numberOfAttempts: number): void {
      this.questions.push(createNewQuestion());
    }
  },
  render: function(createElement): VNode {
    const questionElements = [];
    for (const question of this.questions) {
      questionElements.push(createElement("question-card", {
        props: {
          questionData: question
        },
        on: {
          correct: this.processCorrect
        },
        style: {
          margin: "4px"
        }
      }));
    }
    return createElement("div", questionElements);
  },
});
