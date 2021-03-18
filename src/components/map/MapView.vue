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
import { Tile as TileLayer, Vector } from "ol/layer";
import { OSM } from "ol/source";
import { tracksStore } from "../../store/modules/tracks";
import { Watch } from "vue-property-decorator";
import Position from "../../interfaces/Position";
import { Collection } from "ol";
import LayerGroup from "ol/layer/Group";
import {
  displayLiveTrack,
  displayRecordedTrack
} from "../../service/mapService";

@Component({})
export default class MapView extends Vue {
  private positions: Array<Position> = tracksStore._positions;
  private trackLayers: Array<Vector> = tracksStore.vectors;
  private focus: string = tracksStore._focus;
  private raster: TileLayer = new TileLayer({
    source: new OSM()
  });
  private map: Map;

  get layers() {
    return [this.raster, ...this.trackLayers];
  }

  get storedPositions() {
    return tracksStore._positions;
  }

  get storedLayers() {
    return tracksStore._layers;
  }

  get storedFocus() {
    return tracksStore._focus;
  }

  initiateMap() {
    this.map = new Map({
      controls: defaultControls().extend([
        new ScaleLine({
          units: "degrees"
        })
      ]),
      target: "map",
      layers: this.layers,
      view: new View({
        center: [0, 0],
        zoom: 1
      })
    });
  }
  mounted() {
    this.initiateMap();
  }

  @Watch("storedPositions")
  changePositions() {
    this.positions = tracksStore._positions;
    if (this.positions && this.positions.length > 1 && this.map !== undefined) {
      displayLiveTrack(this.focus, this.map, this.positions);
    }
  }

  @Watch("storedLayers")
  changeTrackLayers() {
    this.trackLayers = tracksStore.vectors;
    this.map.setLayerGroup(
      new LayerGroup({ layers: new Collection(this.layers) })
    );
  }

  @Watch("storedFocus")
  changeFocus() {
    this.focus = tracksStore._focus;
    displayRecordedTrack(this.focus, this.map);
  }
}
</script>

<style lang="scss">
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
