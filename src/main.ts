import Vue from "vue";
import App from "./App.vue";
import { store } from "./store";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import VueSocketIOExt from "vue-socket.io-extended";
import io from "socket.io-client";

Vue.config.productionTip = false;

const socket = io(process.env.VUE_APP_SERVER || "http://localhost:4000");

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(VueSocketIOExt, socket);

new Vue({
  store,
  render: (h) => h(App)
}).$mount("#app");
