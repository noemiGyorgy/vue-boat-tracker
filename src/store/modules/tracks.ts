import { Module, Mutation, Action } from "vuex-class-modules";
import { VuexModule } from "vuex-class-modules";
import Vector from "ol/layer/Vector";
import { store } from "@/store";
import Track from "@/interfaces/Track";
import Position from "@/interfaces/Position";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";

@Module
class TracksStore extends VuexModule {
  public _positions: Array<Position> = [];
  public _recordedPositions: { [key: string]: Array<Position> } = {};
  public _layers: { [key: string]: Vector } = {};
  public _tracks: { [key: string]: Track } = {};
  public _boats: { [key: string]: VectorLayer } = {};
  public _stopped = false;
  public _focus = "-1";

  get stopped(): boolean {
    return this._stopped;
  }

  get vectors(): Array<Vector> {
    return Object.values(this._layers);
  }

  get boats(): Array<VectorLayer> {
    return Object.values(this._boats);
  }

  get sortedTracks(): Array<object> {
    const sortedTracksList: Array<object> = [];
    const ids = Object.keys(this._tracks).reverse();
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      sortedTracksList.push({
        id: id,
        start: this._tracks[id].start,
        live: this._tracks[id].live
      });
    }
    return sortedTracksList;
  }

  @Mutation
  public setPositions(newPositions: Array<Position>): void {
    this._positions = newPositions;
  }

  @Mutation
  public setRecordedPositions(newRecordedPositions: {
    [key: string]: Array<Position>;
  }): void {
    this._recordedPositions = newRecordedPositions;
  }

  @Mutation
  public setLayers(newLayers: { [key: string]: Vector }): void {
    this._layers = newLayers;
  }

  @Mutation
  public setTracks(newTracks: { [key: string]: Track }): void {
    this._tracks = newTracks;
  }

  @Mutation
  public setBoats(newBoats: { [key: string]: VectorLayer }): void {
    this._boats = newBoats;
  }

  @Mutation
  public setStopped(newStopped: boolean): void {
    this._stopped = newStopped;
  }

  @Mutation
  public setFocus(newFocus: string): void {
    this._focus = newFocus;
  }

  @Action
  public async updatePositions(position: Position): Promise<void> {
    const newPositions = [...this._positions];
    newPositions.push(position);
    this.setPositions(newPositions);
  }

  @Action
  public async updateRecordedPositions(track: Array<Position>): Promise<void> {
    const newRecordedPositions = Object.assign({}, this._recordedPositions);
    newRecordedPositions[track[0].id] = track;
    this.setRecordedPositions(newRecordedPositions);
  }

  @Action
  public async updateLayers(lineFeature: {
    [key: string]: any;
  }): Promise<void> {
    const newLayers = Object.assign({}, this._layers);

    if (newLayers[lineFeature.id] === undefined) {
      const line = new Vector({
        source: new VectorSource({
          features: [lineFeature.newFeature],
          useSpatialIndex: false
        }),
        visible: true
      });
      newLayers[lineFeature.id] = line;
    } else {
      const line = newLayers[lineFeature.id];
      line
        .getSource()
        .getFeaturesCollection()
        .push(lineFeature.newFeature);
    }

    this.setLayers(newLayers);
  }

  @Action
  public async updateTracks(track: any): Promise<void> {
    const newTracks = Object.assign({}, this._tracks);
    newTracks[track.id] = track.track;
    this.setTracks(newTracks);
  }

  @Action
  public async updateBoats(track: any): Promise<void> {
    const newBoats = Object.assign({}, this._boats);
    newBoats[track.id] = track.boat;
    this.setBoats(newBoats);
  }

  @Action
  public async deleteLayer(trackId: string): Promise<void> {
    const newLayers = Object.assign({}, this._layers);
    delete newLayers[trackId];
    this.setLayers(newLayers);
  }

  @Action
  public async deleteTrack(trackId: string): Promise<void> {
    const newTracks = Object.assign({}, this._tracks);
    delete newTracks[trackId];
    this.setTracks(newTracks);
  }
}
export const tracksStore = new TracksStore({ store, name: "tracks" });
