import { updateBoat } from "@/components/map/components/boat";
import Position from "@/interfaces/Position";
import { tracksStore } from "@/store/modules/tracks";
import { Feature, Map } from "ol";
import { LineString } from "ol/geom";
import { fromLonLat } from "ol/proj";
import { Stroke, Style } from "ol/style";

export const createLine = (
  focus: string,
  map: Map,
  oldPosition: Position,
  newPosition: Position
) => {
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

  updateBoat(newPosition);

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

  if (focus == newPosition.id) {
    map.getView().fit(lineStr, { padding: [170, 50, 30, 150], maxZoom: 17 });
  }

  tracksStore.updateLayers({
    id: newPosition.id,
    newFeature: newFeature
  });
};

export const displayLiveTrack = (
  focus: string,
  map: Map,
  positions: Array<Position>
) => {
  if (focus === "-1" || focus === undefined) {
    tracksStore.setFocus(positions[0].id);
  }
  const lastIndex = positions.length - 1;
  createLine(focus, map, positions[lastIndex - 1], positions[lastIndex]);
};

export const displayRecordedTrack = (focus: string, map: Map) => {
  if (tracksStore._recordedPositions && tracksStore._recordedPositions[focus]) {
    if (tracksStore._layers[focus] !== undefined) {
      const recordedTrack = tracksStore._recordedPositions[focus];
      const coordOld = fromLonLat([
        recordedTrack[recordedTrack.length - 2].lon,
        recordedTrack[recordedTrack.length - 2].lat
      ]);
      const coordNew = fromLonLat([
        recordedTrack[recordedTrack.length - 1].lon,
        recordedTrack[recordedTrack.length - 1].lat
      ]);

      const lineStr = new LineString([coordOld, coordNew]);
      map.getView().fit(lineStr, { padding: [170, 50, 30, 150], maxZoom: 17 });
      map.render();
    } else {
      const recordedTrack = tracksStore._recordedPositions[focus];
      if (recordedTrack.length > 1 && map !== undefined) {
        for (let i = 1; i < recordedTrack.length; i++) {
          if (!recordedTrack[i].pause) {
            createLine(focus, map, recordedTrack[i - 1], recordedTrack[i]);
          }
        }
      }
    }
  }
};
