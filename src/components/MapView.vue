<template>
  <div id="map"></div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import "ol/ol.css";
import Map from "ol/Map.js";
import View from "ol/View";
import { defaults as defaultControls, ScaleLine } from "ol/control";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { OSM, Vector as VectorSource } from "ol/source";
import { tracksStore } from "../store/modules/tracks";
import { Watch } from "vue-property-decorator";

@Component({})
export default class MapView extends Vue {
  private positions: Array<object> = tracksStore._positions;
  private map: Map;

  initiateMap() {
    console.log(this.positions);
    const source = new VectorSource();
    const vector = new VectorLayer({
      source: source
    });
    const raster = new TileLayer({
      source: new OSM()
    });
    this.map = new Map({
      controls: defaultControls().extend([
        new ScaleLine({
          units: "degrees"
        })
      ]),
      target: "map",
      layers: [raster, vector],
      view: new View({
        center: [0, 0],
        zoom: 1
      })
    });
  }
  async mounted() {
    await this.initiateMap();
  }

  get getPositions() {
    return tracksStore._positions;
  }

  @Watch("getPositions")
  changePositions() {
    this.positions = tracksStore._positions;
    console.log(this.positions);
  }
}
</script>

<style lang="scss" scoped>
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
