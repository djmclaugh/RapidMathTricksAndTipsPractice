import Vue, { VNode } from "vue";

import { QuestionCardComponent } from "./question_card";
import { OptionsComponent } from "./options";
import { Question, QuestionType } from "../util/question";
import { randomInt } from "../util/random_util";
import { GENERATORS } from "../util/question_generators/generators";

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
      const index = randomInt(this.includedTrickGenerators.length);
      const generator = this.includedTrickGenerators[index];
      return generator();
    },
    processStart(includeTrick: boolean[]): void {
      this.includedTrickGenerators = [];
      for (let i = 0; i < includeTrick.length; ++i) {
        if (includeTrick[i]) {
          this.includedTrickGenerators.push(GENERATORS[i]);
        }
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
