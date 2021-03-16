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
  @Prop({ required: true }) trackId: number;
  @Prop({ required: true }) start: string;
  @Prop({ required: true }) live: boolean;
  private activeItem = "";

  handleClick() {
    if (
      tracksStore._layers[this.start] !== undefined &&
      !tracksStore._tracks[this.trackId].live
    ) {
      tracksStore._layers[this.start].setVisible(
        !tracksStore._layers[this.start].getVisible()
      );
    } else {
      axios
        .get(process.env.VUE_APP_SERVER + "/track/" + this.trackId, {
          withCredentials: true
        })
        .then(response => {
          tracksStore.updateRecordedPositions(response.data);
          tracksStore.setFocus(this.start);
        });
    }
  }
}
</script>

<style scoped></style>
