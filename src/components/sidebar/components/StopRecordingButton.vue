<template>
  <div>
    <b-button
      id="stop"
      type="button"
      variant="outline-info"
      class="p-4 pl-5 pr-5"
      @click="changeStatus"
    >
      {{ value }}
    </b-button>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { tracksStore } from "../../../store/modules/tracks";
import axios from "axios";

@Component({})
export default class StopRecordingButton extends Vue {
  private value = tracksStore.stopped ? "START RECORDING" : "STOP RECORDING";

  changeStatus() {
    tracksStore.setStopped(!tracksStore.stopped);

    console.log(tracksStore.stopped);
    axios
      .put(process.env.VUE_APP_SERVER + "/status", {
        withCredentials: true
      })
      .then(response => {
        this.value = response.data.stopped
          ? "START RECORDING"
          : "STOP RECORDING";
      });
  }
}
</script>

<style scoped></style>
