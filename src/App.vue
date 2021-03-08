<template>
  <div id="app">
    <MapView :positions="positions"/>
  </div>
</template>

<script>
import io from "socket.io-client";
import MapView from './components/MapView.vue';
const socket = io.connect("http://localhost:4000");

export default {
  name: 'App',
  data() {
    return {
      positions: []
    }
  },
  components: {
    MapView
  },
  created() {
    this.getLivePosition()
  },
  methods: {
    getLivePosition() {
      socket.on("position", message => {
        let newPositions = this.positions;
        newPositions.push(message);
        this.positions = newPositions;
      })
    }
  }
}
</script>

<style>
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