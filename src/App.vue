<template>
  <div id="app">
    <MapView :positions="positions" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import io from "socket.io-client";
import MapView from "./components/MapView.vue";

@Component({
  components: {
    MapView
  }
})
export default class App extends Vue {
  private server: string =
    process.env.VUE_APP_SERVER || "http://localhost:4000";
  private socket = io.connect(this.server);

  private positions: Array<object> = [];
  getLivePosition() {
    this.socket.on("position", (message: object) => {
      const newPositions = this.positions;
      newPositions.push(message);
      this.positions = newPositions;
    });
  }
  created() {
    this.getLivePosition();
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 99%;
  width: 99%;
}
</style>
