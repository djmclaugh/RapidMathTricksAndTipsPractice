import Vue from "vue";

import { RootComponent } from "./components/root"

let v = new Vue({
  el: "#app",
  components: {
    root: RootComponent
  },
  render: function(createElement) {
    return createElement("root");
  },
});
