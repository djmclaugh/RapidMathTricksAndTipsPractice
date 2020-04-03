import Vue, { VNode } from "vue";

import { QuestionCardComponent } from "./question_card"
import { Question, QuestionType } from "../util/question"

function createNewQuestion(): Question {
  return {
    type: QuestionType.ADDITION,
    operands: [Math.round(Math.random() * 10), Math.round(Math.random() * 10)]
  }
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
