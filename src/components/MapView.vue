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
import { tracksStore } from "../store/modules/tracks";
import { Watch } from "vue-property-decorator";
import { fromLonLat } from "ol/proj";
import Position from "../interfaces/Position";
import LineString from "ol/geom/LineString";
import { Collection, Feature } from "ol";
import Style from "ol/style/Style";
import Stroke from "ol/style/Stroke";
import LayerGroup from "ol/layer/Group";

@Component({})
export default class MapView extends Vue {
  private positions: Array<Position> = tracksStore._positions;
  private trackLayers: Array<Vector> = tracksStore.vectors;
  private raster: TileLayer = new TileLayer({
    source: new OSM()
  });
  private map: Map;

  get layers() {
    return [this.raster, ...this.trackLayers];
  }

  get storePositions() {
    return tracksStore._positions;
  }

  get storeLayers() {
    return tracksStore._layers;
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

  createLine(pos: Array<Position>) {
    const stoppedStyle = [
      new Style({
        stroke: new Stroke({
          color: "#ff0000",
          width: 2
        })
      })
    ];

    const recordingStyle = [
      new Style({
        stroke: new Stroke({
          color: "#000000",
          width: 2
        })
      })
    ];

    const lastIndex = pos.length - 1;
    const coordOld = fromLonLat([
      pos[lastIndex - 1].lon,
      pos[lastIndex - 1].lat
    ]);
    const coordNew = fromLonLat([pos[lastIndex].lon, pos[lastIndex].lat]);

    const lineStr = new LineString([coordOld, coordNew]);
    const newFeature = new Feature({
      geometry: lineStr,
      name: "Line"
    });

    newFeature.setStyle(tracksStore._stopped ? stoppedStyle : recordingStyle);

    tracksStore
      .updateLayers({
        start: pos[lastIndex].start,
        newFeature: newFeature
      })
      .then(() => {
        this.map
          .getView()
          .fit(lineStr, { padding: [170, 50, 30, 150], maxZoom: 17 });
      });
  }

  @Watch("storePositions")
  changePositions() {
    this.positions = tracksStore._positions;
    if (
      this.positions.length &&
      this.positions.length > 1 &&
      this.map !== undefined
    ) {
      this.createLine(this.positions);
    }
  }

  @Watch("storeLayers")
  changeTrackLayers() {
    this.trackLayers = tracksStore.vectors;
    this.map.setLayerGroup(
      new LayerGroup({ layers: new Collection(this.layers) })
    );
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
