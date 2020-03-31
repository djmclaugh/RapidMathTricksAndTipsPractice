import Vue from "vue";

import {rootComponent} from "./components/root";

let v = new Vue({
  el: "#app",
  components: {
    root: rootComponent
  },
  render: function(createElement) {
    return createElement("root");
  },
});
