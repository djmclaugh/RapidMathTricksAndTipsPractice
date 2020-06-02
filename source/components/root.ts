import Vue, { VNode } from 'vue';

import QuestionCardComponent from './question_card';
import OptionsComponent from './options/options';
import StatsComponent from './stats';
import { Question } from '../util/question';
import { randomFromArray } from '../util/random_util';
import { QuestionGenerator } from '../util/question_generators/generators';

interface QuestionWithOrigin {
  question: Question,
  origin: QuestionGenerator,
}

interface RootComponentData {
  questions: QuestionWithOrigin[],
  questionGenerators: QuestionGenerator[],
  runNumber: number,
  attempts: number,
  successes: number,
  startTime: number,
}

export const RootComponent = Vue.extend({
  data: function(): RootComponentData {
    return {
      questions: [],
      questionGenerators: [],
      runNumber: 0,
      attempts: 0,
      successes: 0,
      startTime: 0,
    };
  },
  components: {
    options: OptionsComponent,
    questionCard: QuestionCardComponent,
    stats: StatsComponent,
  },
  methods: {
    createNewQuestion(): QuestionWithOrigin {
      const questionGenerator = randomFromArray(this.questionGenerators);
      const question = questionGenerator.generator();
      return {
        question: question,
        origin: questionGenerator
      }
    },
    processStart(questionGenerators: QuestionGenerator[]): void {
      this.successes = 0;
      this.attempts = 0;
      this.startTime = Date.now();
      this.questionGenerators = questionGenerators;
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
    const optionsElement: VNode = createElement('options', {
      on: {
        start: this.processStart,
      },
    });

    const statsElement: VNode = createElement('stats', {
      props: {
        attempts: this.attempts,
        successes: this.successes,
        totalTime: Date.now() - this.startTime,
      },
    });
    const questionElements = [];
    for (let i = this.questions.length - 1; i >= 0; --i) {
      const question = this.questions[i];
      questionElements.push(createElement('question-card', {
        props: {
          question: question.question,
          originText: question.origin.name,
          shouldShowOrigin: this.questionGenerators.length > 1,
          id: i,
        },
        on: {
          correct: this.processCorrect,
        },
        key: this.runNumber + '-' + i,
      }));
    }
    const elements = [
      optionsElement,
      createElement('br'),
      statsElement,
      createElement('br'),
      createElement('div', questionElements),
    ];
    return createElement('div', elements);
  },
});
