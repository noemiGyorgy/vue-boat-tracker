import { Module, Mutation, Action } from "vuex-class-modules";
import { VuexModule } from "vuex-class-modules";
import Vector from "ol/layer/Vector";
import { store } from "@/store";
import Position from "@/interfaces/Position";
import VectorSource from "ol/source/Vector";

@Module
class TracksStore extends VuexModule {
  public _positions: Array<Position> = [];
  public _tracks: Array<object> = [];
  public _stopped = false;
  public _layers: { [key: string]: Vector } = {};
  public _recordedPositions: { [key: string]: Array<Position> } = {};

  get stopped(): boolean {
    return this._stopped;
  }

  get vectors(): Array<Vector> {
    return Object.values(this._layers);
  }

  @Mutation
  public setPositions(newPositions: Array<Position>): void {
    this._positions = newPositions;
  }

  @Mutation
  public setLayers(newLayers: { [key: string]: Vector }): void {
    this._layers = newLayers;
  }

  @Mutation
  public setTracks(newTracks: Array<object>): void {
    this._tracks = newTracks;
  }

  @Mutation
  public setStopped(newStopped: boolean): void {
    this._stopped = newStopped;
  }

  @Mutation
  public setRecordedPositions(newRecordedPositions: {
    [key: string]: Array<Position>;
  }): void {
    this._recordedPositions = newRecordedPositions;
  }

  @Action
  public async updatePositions(position: Position): Promise<void> {
    const newPositions = [...this._positions];
    newPositions.push(position);
    this.setPositions(newPositions);
  }

  @Action
  public async updateLayers(lineFeature: {
    [key: string]: any;
  }): Promise<void> {
    const newLayers = Object.assign({}, this._layers);

    if (newLayers[lineFeature.start] === undefined) {
      const line = new Vector({
        source: new VectorSource({
          features: [lineFeature.newFeature],
          useSpatialIndex: false
        }),
        visible: true
      });
      newLayers[lineFeature.start] = line;
    } else {
      const line = newLayers[lineFeature.start];
      line
        .getSource()
        .getFeaturesCollection()
        .push(lineFeature.newFeature);
    }

    this.setLayers(newLayers);
  }

  @Action
  public async updateRecordedPositions(track: Array<Position>): Promise<void> {
    const newRecordedPositions = Object.assign({}, this._recordedPositions);
    newRecordedPositions[track[0].start] = track;
    this.setRecordedPositions(newRecordedPositions);
  }
}
export const tracksStore = new TracksStore({ store, name: "tracks" });
