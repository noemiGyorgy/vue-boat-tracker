<template>
  <div id="app">
    <MapView />
    <Sidebar />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Socket } from "vue-socket.io-extended";
import MapView from "./components/map/MapView.vue";
import Sidebar from "./components/sidebar/Sidebar.vue";
import Position from "./interfaces/Position";
import {
  addPosition,
  initStore,
  setStopped,
  terminateLiveStreaming
} from "./service/appService";

@Component({
  components: {
    MapView,
    Sidebar
  }
})
export default class App extends Vue {
  @Socket()
  connection(message: any) {
    initStore(message.tracks, message.stopped, message.liveTrack);
    console.log(message.tracks);
  }

  @Socket()
  position(position: Position) {
    addPosition(position);
  }

  @Socket()
  endOfTrack(message: { [key: string]: any }) {
    terminateLiveStreaming(message.tracks, message.finishedTrack);
  }

  @Socket()
  stopped(stopped: boolean) {
    setStopped(stopped);
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
