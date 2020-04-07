import Vue, { VNode } from "vue";

import { QuestionCardComponent } from "./question_card";
import { OptionsComponent } from "./options";
import { StatsComponent } from "./stats";
import { Question, QuestionType } from "../util/question";
import { randomInt } from "../util/random_util";
import { GENERATORS } from "../util/question_generators/generators";

interface RootComponentData {
  questions: Question[],
  includedTrickGenerators: Array<() => Question>,
  runNumber: number,
  attempts: number,
  successes: number,
  startTime: number,
}

export const RootComponent = Vue.extend({
  data: function(): RootComponentData {
    return {
      questions: [],
      includedTrickGenerators: [],
      runNumber: 0,
      attempts: 0,
      successes: 0,
      startTime: 0,
    }
  },
  components: {
    options: OptionsComponent,
    questionCard: QuestionCardComponent,
    stats: StatsComponent
  },
  methods: {
    createNewQuestion(): Question {
      const index = randomInt(this.includedTrickGenerators.length);
      const generator = this.includedTrickGenerators[index];
      return generator();
    },
    processStart(includeTrick: boolean[]): void {
      this.includedTrickGenerators = [];
      this.successes = 0;
      this.attempts = 0;
      this.startTime = Date.now();
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
      this.attempts += numberOfAttempts;
      this.successes += 1;
    },
  },
  render: function(createElement): VNode {
    const optionsElement: VNode = createElement("options", {
      on: {
        start: this.processStart,
      },
    });

    const statsElement: VNode = createElement("stats", {
      props: {
        attempts: this.attempts,
        successes: this.successes,
        totalTime: Date.now() - this.startTime,
      }
    });
    const questionElements = [];
    for (let i = this.questions.length - 1; i >= 0; --i) {
      const question = this.questions[i];
      questionElements.push(createElement("question-card", {
        props: {
          questionData: question
        },
        on: {
          correct: this.processCorrect
        },
        key: this.runNumber + "-" + i,
      }));
    }
    const elements = [optionsElement, statsElement, createElement("div", questionElements)];
    return createElement("div", elements);
  },
});
