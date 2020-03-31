import Vue from "vue"

export const rootComponent = Vue.extend({
  render: function(createElement) {
    return createElement("div", "Rapid Math Tips and Tricks");
  },
});
