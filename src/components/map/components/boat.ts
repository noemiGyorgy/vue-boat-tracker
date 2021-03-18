import { Style, RegularShape, Fill, Stroke } from "ol/style";
import Feature from "ol/Feature";
import { Point } from "ol/geom";
import { tracksStore } from "../../../store/modules/tracks";
import Position from "@/interfaces/Position";
import { fromLonLat } from "ol/proj";

const getTriangle = (heading: number, live: boolean) => {
  return new Style({
    image: new RegularShape({
      fill: new Fill({ color: "red" }),
      stroke: live ? new Stroke({ color: "black", width: 2 }) : undefined,
      points: 3,
      radius: live ? 10 : 8,
      rotation: heading,
      angle: 0
    })
  });
};

export const updateBoat = (position: Position) => {
  let boat = tracksStore._layers[position.id]
    ? tracksStore._layers[position.id]
        .getSource()
        .getFeatureById("boat" + position.id)
    : undefined;

  const point = new Point(fromLonLat([position.lon, position.lat]));

  if (boat == null || boat === undefined) {
    boat = new Feature({
      geometry: point
    });
    boat.setId("boat" + position.id);
    tracksStore.updateLayers({
      id: position.id,
      newFeature: boat
    });
  } else {
    boat.setGeometry(point);
  }

  const triangle = getTriangle(
    position.heading,
    tracksStore._tracks[position.id].live
  );
  boat.setStyle(triangle);
};
