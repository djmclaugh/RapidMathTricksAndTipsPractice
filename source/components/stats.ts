import Vue, { VNode } from 'vue';
import Component from 'vue-class-component';

const groupedSpanData = {
  class: {
    nobreak: true,
  },
};

const StatsProps = Vue.extend({
  props: {
    attempts: Number,
    successes: Number,
    totalTime: Number,
  },
});

@Component
export default class StatsComponent extends StatsProps {
  // Data
  // None!

  // Computed
  get accuracy(): number {
    return this.attempts > 0 ? this.successes / this.attempts : 0;
  }

  get averageTime(): number {
    return this.attempts > 0 ? this.totalTime / this.successes : 0;
  }

  // Hooks
  render(): VNode {
    const elements: VNode[] = [];

    elements.push(this.$createElement('span', groupedSpanData, 'Answered: ' + this.successes));
    elements.push(this.$createElement('span', ' | '));

    const accuracyText = 'Accuracy: ' + Math.floor(100 * this.accuracy) + '%';
    elements.push(this.$createElement('span', groupedSpanData, accuracyText));
    elements.push(this.$createElement('span', ' | '));

    const timeText = 'Average Time: ' + (Math.floor(this.averageTime / 100) / 10) + ' seconds';
    elements.push(this.$createElement('span', groupedSpanData, timeText));

    return this.$createElement('div', elements);
  }
}
