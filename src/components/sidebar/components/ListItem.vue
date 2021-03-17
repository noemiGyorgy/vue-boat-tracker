<template>
  <b-list-group-item button :class="activeItem" @click="handleClick">
    <span class="text-danger">{{ live ? "⦿ " : "" }}</span>
    {{ new Date(start).toLocaleString() }}
  </b-list-group-item>
</template>

<script lang="ts">
import { tracksStore } from "@/store/modules/tracks";
import axios from "axios";
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";

@Component({})
export default class ListItem extends Vue {
  @Prop({ required: true }) trackId: string;
  @Prop({ required: true }) start: string;
  @Prop({ required: true }) live: boolean;
  private activeItem = "";

  handleClick(): void {
    if (
      tracksStore._layers[this.trackId] !== undefined &&
      !tracksStore._tracks[this.trackId].live
    ) {
      if (!tracksStore._layers[this.trackId].getVisible()) {
        tracksStore.setFocus(this.trackId);
      }
      tracksStore._layers[this.trackId].setVisible(
        !tracksStore._layers[this.trackId].getVisible()
      );
      this.activeItem = tracksStore._layers[this.trackId].getVisible()
        ? "text-white bg-info"
        : "";
    } else {
      axios
        .get(process.env.VUE_APP_SERVER + "/track/" + this.trackId, {
          withCredentials: true
        })
        .then(response => {
          tracksStore.updateRecordedPositions(response.data);
          this.activeItem = "text-white bg-info";
          tracksStore.setFocus(this.trackId);
        });
    }
  }
}
</script>

<style scoped></style>
