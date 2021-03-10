import { Module, Mutation, Action } from "vuex-class-modules";
import { VuexModule } from "vuex-class-modules";

import { store } from "@/store";

@Module
class TracksStore extends VuexModule {
  public _positions: Array<object> = [];

  @Mutation
  public setPositions(newPositions: Array<object>): void {
    this._positions = newPositions;
  }

  @Action
  public async updatePositions(position: object): Promise<void> {
    const newPositions = [...this._positions];
    newPositions.push(position);
    this.setPositions(newPositions);
  }
}
export const tracksStore = new TracksStore({ store, name: "tracks" });
