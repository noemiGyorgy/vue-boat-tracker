import { tracksStore } from "../store/modules/tracks";
import Position from "../interfaces/Position";
import Track from "@/interfaces/Track";

const unrecordedTrackId = process.env.VUE_APP_UNRECORDED_TRACK_ID || "-1";

export const initStore = (
  tracks: { [key: string]: Track },
  stopped: boolean
) => {
  console.log("Connected to the server.");
  tracksStore.setTracks(tracks);
  tracksStore.setStopped(stopped);
};

const switchToRecordedTrack = (position: Position) => {
  // focus on recorded track
  tracksStore.setFocus(position.id);

  if (tracksStore._layers[unrecordedTrackId] !== undefined) {
    // delete symbol of the boat from the unrecorded part
    const feature = tracksStore._layers[unrecordedTrackId]
      .getSource()
      .getFeatureById("boat-1");
    tracksStore._layers[unrecordedTrackId].getSource().removeFeature(feature);
  }
};

const createTrack = (position: Position) => {
  // delete unrecorded track if there is one
  if (
    tracksStore._tracks[unrecordedTrackId] !== undefined &&
    position.id !== unrecordedTrackId
  ) {
    tracksStore.deleteTrack(unrecordedTrackId);
  }

  tracksStore.updateTracks({
    id: position.id,
    track: { start: position.start, live: true }
  });
};

export const addPosition = (position: Position) => {
  tracksStore.updatePositions(position);
  if (
    tracksStore._focus == unrecordedTrackId &&
    position.id != unrecordedTrackId
  ) {
    switchToRecordedTrack(position);
  }
  if (tracksStore._tracks[position.id] === undefined) {
    createTrack(position);
  }
};

const changeLiveTrackToRecorded = (finishedTrack: Array<Position>) => {
  const finishedTrackId = finishedTrack[0].id;
  tracksStore.deleteLayer(finishedTrackId);
  tracksStore.updateRecordedPositions(finishedTrack);
  tracksStore.setFocus(finishedTrackId.toString());
};

export const terminateLiveStreaming = (
  tracks: { [key: string]: Track },
  finishedTrack: any
) => {
  tracksStore.setTracks(tracks);
  alert("End of the journey.");

  if (finishedTrack == unrecordedTrackId) {
    alert(
      "This track was not recorded, it will disappear by clicking the OK button."
    );
  } else {
    changeLiveTrackToRecorded(finishedTrack);
  }
  // delete unrecorded parts
  tracksStore.deleteTrack(unrecordedTrackId);
  tracksStore.deleteLayer(unrecordedTrackId);
};

export const setStopped = (stopped: boolean) => {
  tracksStore.setStopped(stopped);
};
