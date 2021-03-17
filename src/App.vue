<template>
  <div id="app">
    <MapView />
    <Sidebar />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { tracksStore } from "./store/modules/tracks";
import io from "socket.io-client";
import MapView from "./components/map/MapView.vue";
import Sidebar from "./components/sidebar/Sidebar.vue";
import Track from "./interfaces/Track";
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
      console.log("Connected to the server.");
      tracksStore.setTracks(message.tracks);
      tracksStore.setStopped(message.stopped);
    });
    this.socket.on("position", (position: Position) => {
      tracksStore.updatePositions(position);
      if (tracksStore._tracks[position.id] === undefined) {
        if (tracksStore._tracks["-1"] !== undefined && position.id !== "-1") {
          tracksStore.deleteTrack("-1");
        }
        tracksStore.updateTracks({
          id: position.id,
          track: { start: position.start, live: true }
        });
      }
    });
    this.socket.on("endOfTrack", (tracks: { [key: string]: Track }) => {
      tracksStore.setTracks(tracks);
      alert("End of the journey.");
      if (tracksStore._layers["-1"] !== undefined) {
        tracksStore.deleteLayer("-1");
      }
    });
    this.socket.on("stopped", (stopped: boolean) => {
      tracksStore.setStopped(stopped);
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
