import { Module, Mutation, Action } from "vuex-class-modules";
import { VuexModule } from "vuex-class-modules";

import { store } from "@/store";

@Module
class TracksStore extends VuexModule {
  public _positions: Array<object> = [];
  public _tracks: Array<object> = [];
  public _stopped = false;
  public _features: { [key: string]: any } = {};

  @Mutation
  public setPositions(newPositions: Array<object>): void {
    this._positions = newPositions;
  }

  @Mutation
  public setFeatures(newFeatures: object): void {
    this._features = newFeatures;
  }

  @Mutation
  public setTracks(newTracks: Array<object>): void {
    this._tracks = newTracks;
  }

  @Mutation
  public setStopped(newStopped: boolean): void {
    this._stopped = newStopped;
  }

  @Action
  public async updatePositions(position: object): Promise<void> {
    const newPositions = [...this._positions];
    newPositions.push(position);
    this.setPositions(newPositions);
  }

  @Action
  public async updateFeatures(lineFeature: {
    [key: string]: any;
  }): Promise<void> {
    const newFeatures = { ...this._features };
    if (newFeatures[lineFeature.start] === undefined) {
      newFeatures[lineFeature.start] = [];
    }
    newFeatures[lineFeature.start].push(lineFeature.newFeature);
    this.setFeatures(newFeatures);
  }
}
export const tracksStore = new TracksStore({ store, name: "tracks" });
