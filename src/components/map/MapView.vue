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
import { fromLonLat } from "ol/proj";
import Position from "../../interfaces/Position";
import LineString from "ol/geom/LineString";
import { Collection, Feature } from "ol";
import Style from "ol/style/Style";
import Stroke from "ol/style/Stroke";
import LayerGroup from "ol/layer/Group";

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

  createLine(oldPosition: Position, newPosition: Position) {
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

    const coordOld = fromLonLat([oldPosition.lon, oldPosition.lat]);
    const coordNew = fromLonLat([newPosition.lon, newPosition.lat]);

    const lineStr = new LineString([coordOld, coordNew]);
    const newFeature = new Feature({
      geometry: lineStr,
      name: "Line"
    });

    newFeature.setStyle(
      tracksStore._stopped && tracksStore._tracks[newPosition.id].live
        ? stoppedStyle
        : recordingStyle
    );

    tracksStore
      .updateLayers({
        id: newPosition.id,
        newFeature: newFeature
      })
      .then(() => {
        if (this.focus === newPosition.id) {
          this.map
            .getView()
            .fit(lineStr, { padding: [170, 50, 30, 150], maxZoom: 17 });
        }
      });
  }

  @Watch("storedPositions")
  changePositions() {
    this.positions = tracksStore._positions;
    if (this.positions && this.positions.length > 1 && this.map !== undefined) {
      if (this.focus === "" || this.focus === undefined) {
        tracksStore.setFocus(this.positions[0].id);
      }
      const lastIndex = this.positions.length - 1;
      this.createLine(this.positions[lastIndex - 1], this.positions[lastIndex]);
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

    if (tracksStore._layers[this.focus] !== undefined) {
      const recordedTrack = tracksStore._recordedPositions[this.focus];
      const coordOld = fromLonLat([
        recordedTrack[recordedTrack.length - 2].lon,
        recordedTrack[recordedTrack.length - 2].lat
      ]);
      const coordNew = fromLonLat([
        recordedTrack[recordedTrack.length - 1].lon,
        recordedTrack[recordedTrack.length - 1].lat
      ]);

      const lineStr = new LineString([coordOld, coordNew]);
      this.map
        .getView()
        .fit(lineStr, { padding: [170, 50, 30, 150], maxZoom: 17 });
      this.map.render();
    } else if (
      tracksStore._recordedPositions &&
      tracksStore._recordedPositions[this.focus]
    ) {
      const recordedTrack = tracksStore._recordedPositions[this.focus];
      if (recordedTrack.length > 1 && this.map !== undefined) {
        for (let i = 1; i < recordedTrack.length; i++) {
          if (!recordedTrack[i].pause) {
            this.createLine(recordedTrack[i - 1], recordedTrack[i]);
          }
        }
      }
    }
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
