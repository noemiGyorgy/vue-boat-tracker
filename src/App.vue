<template>
  <div id="app">
    <MapView />
  </div>
</template>

<script>
import MapView from './components/MapView.vue';
export default {
  name: 'App',
  components: {
    MapView
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