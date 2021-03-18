import { Style, RegularShape, Fill, Stroke } from "ol/style";
import Feature from "ol/Feature";
import { Point } from "ol/geom";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Coordinate } from "ol/coordinate";

const getTriangle = (heading: number) => {
  return new Style({
    image: new RegularShape({
      fill: new Fill({ color: "red" }),
      stroke: new Stroke({ color: "black", width: 2 }),
      points: 3,
      radius: 10,
      rotation: heading,
      angle: 0
    })
  });
};

export const getBoat = (coordinate: Coordinate, heading: number) => {
  const triangle = getTriangle(heading);

  const newFeature = new Feature({
    geometry: new Point(coordinate)
  });
  newFeature.setStyle(triangle);

  return new VectorLayer({
    source: new VectorSource({
      features: [newFeature]
    })
  });
};
