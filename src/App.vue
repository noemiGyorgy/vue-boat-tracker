<template>
  <div id="app">
    <MapView />
    <Sidebar />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import io from "socket.io-client";
import MapView from "./components/map/MapView.vue";
import Sidebar from "./components/sidebar/Sidebar.vue";
import {
  addPosition,
  initStore,
  setStopped,
  terminateLiveStreaming
} from "./service/appService";
import Position from "./interfaces/Position";

@Component({
  components: {
    MapView,
    Sidebar
  }
})
export default class App extends Vue {
  private server: string =
    process.env.VUE_APP_SERVER || "http://localhost:4000";
  private socket = io.connect(this.server);

  recieveMessages() {
    this.socket.on("connection", (message: any) => {
      initStore(message.tracks, message.stopped);
    });

    this.socket.on("position", (position: Position) => {
      addPosition(position);
    });

    this.socket.on("endOfTrack", (message: { [key: string]: any }) => {
      terminateLiveStreaming(message.tracks, message.finishedTrack);
    });

    this.socket.on("stopped", (stopped: boolean) => {
      setStopped(stopped);
    });
  }
  created() {
    this.recieveMessages();
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
