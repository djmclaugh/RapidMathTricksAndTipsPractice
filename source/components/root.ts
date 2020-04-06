import Vue, { VNode } from "vue";

import { QuestionCardComponent } from "./question_card";
import { OptionsComponent } from "./options";
import { Question, QuestionType } from "../util/question";
import { generateQuestionForTrick1 } from "../util/question_generators/trick_1_generator";
import { generateQuestionForTrick2 } from "../util/question_generators/trick_2_generator";

function createNewQuestion(): Question {
  return Math.random() < 0.5 ? generateQuestionForTrick1() : generateQuestionForTrick2();
}

interface RootComponentData {
  questions: Question[],
  includedTrickGenerators: Array<() => Question>,
  runNumber: number,
}

export const RootComponent = Vue.extend({
  data: function(): RootComponentData {
    return {
      questions: [],
      includedTrickGenerators: [],
      runNumber: 0,
    }
  },
  components: {
    options: OptionsComponent,
    questionCard: QuestionCardComponent
  },
  methods: {
    createNewQuestion(): Question {
      const index = Math.floor(Math.random() * this.includedTrickGenerators.length);
      const generator = this.includedTrickGenerators[index];
      return generator();
    },
    processStart(includeTrick: boolean[]): void {
      this.includedTrickGenerators = [];
      if (includeTrick[0]) {
        this.includedTrickGenerators.push(generateQuestionForTrick1);
      }
      if (includeTrick[1]) {
        this.includedTrickGenerators.push(generateQuestionForTrick2);
      }
      this.questions = [this.createNewQuestion()];
      this.runNumber += 1;
    },
    processCorrect(numberOfAttempts: number): void {
      this.questions.push(this.createNewQuestion());
    },
  },
  render: function(createElement): VNode {
    const optionsElement: VNode = createElement("options", {
      on: {
        start: this.processStart,
      },
    });
    const questionElements = [];
    for (let i = 0; i < this.questions.length; ++i) {
      const question = this.questions[i];
      questionElements.push(createElement("question-card", {
        props: {
          questionData: question
        },
        on: {
          correct: this.processCorrect
        },
        style: {
          margin: "4px"
        },
        key: this.runNumber + "-" + i,
      }));
    }
    const elements = [optionsElement, createElement("div", questionElements)];
    return createElement("div", elements);
  },
});
