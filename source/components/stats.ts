import Vue, { VNode } from "vue";

export const StatsComponent = Vue.extend({
  props: {
    attempts: Number,
    successes: Number,
    totalTime: Number,
  },
  computed: {
    accuracy(): number {
      return this.attempts > 0 ? this.successes / this.attempts : 0
    },
    averageTime(): number {
      return this.attempts > 0 ? this.totalTime / this.attempts : 0
    },
  },
  render(createElement): VNode {
    const elements: VNode[] = [];

    elements.push(createElement("span", "Answered: " + this.successes));
    elements.push(createElement("span", "Accuracy: " + Math.floor(100 * this.accuracy) + "%"));
    const timeText = "Average Time: " + (Math.floor(this.averageTime / 100) / 10) + " seconds";
    elements.push(createElement("span", timeText));

    return createElement("div", elements);
  },
});
