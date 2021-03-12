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
    //if (this.start in Object.keys(tracksStore._layers && !tracksStore._tracks[this.trackId].live))
    axios
      .get(process.env.VUE_APP_SERVER + "/track/" + this.trackId, {
        withCredentials: true
      })
      .then(response => {
        tracksStore.updateRecordedPositions(response.data);
        console.log(response);
      });
  }
}
</script>

<style scoped></style>
