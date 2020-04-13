import Vue, { VNode } from 'vue';

const groupedSpanData = {
  class: {
    nobreak: true,
  },
};

export const StatsComponent = Vue.extend({
  props: {
    attempts: Number,
    successes: Number,
    totalTime: Number,
  },
  computed: {
    accuracy(): number {
      return this.attempts > 0 ? this.successes / this.attempts : 0;
    },
    averageTime(): number {
      return this.attempts > 0 ? this.totalTime / this.successes : 0;
    },
  },
  render(createElement): VNode {
    const elements: VNode[] = [];

    elements.push(createElement('span', groupedSpanData, 'Answered: ' + this.successes));
    elements.push(createElement('span', ' | '));

    const accuracyText = 'Accuracy: ' + Math.floor(100 * this.accuracy) + '%';
    elements.push(createElement('span', groupedSpanData, accuracyText));
    elements.push(createElement('span', ' | '));

    const timeText = 'Average Time: ' + (Math.floor(this.averageTime / 100) / 10) + ' seconds';
    elements.push(createElement('span', groupedSpanData, timeText));

    return createElement('div', elements);
  },
});
