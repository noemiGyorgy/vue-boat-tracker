<template>
    <div id="map"></div>
</template>
<script>
/* eslint-disable */
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import { defaults as defaultControls, ScaleLine } from "ol/control";
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {OSM, Vector as VectorSource} from 'ol/source';
export default {
  name: 'MapView',
  async mounted() {
    await this.initiateMap();
  },
  methods: {
    initiateMap() {
      var source = new VectorSource();
      var vector = new VectorLayer({
        source: source
      });
      var raster = new TileLayer({
        source: new OSM(),
      });
      var map = new Map({
        controls: defaultControls().extend([
          new ScaleLine({
            units: "degrees",
          }),
        ]),
        target: "map",
        layers: [raster, vector],
        view: new View({
          center: [0, 0],
          zoom: 1,
        }),
      });
    },
  },
};
</script>
<style>
#map {
  position: absolute;
  z-index: 0 !important;
  margin: 0;
  padding: 0;
  height: 99%;
  width: 99%;
}
#nav {
  padding: 30px;
}
#nav a {
  font-weight: bold;
  color: #2c3e50;
}
#nav a.router-link-exact-active {
  color: #42b983;
}
</style>