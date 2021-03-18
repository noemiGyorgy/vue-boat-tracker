<template>
  <div>
    <b-button
      id="stop"
      type="button"
      variant="outline-info"
      class="p-4 pl-5 pr-5"
      @click="handleClick"
    >
      {{ value }}
    </b-button>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { tracksStore } from "../../../store/modules/tracks";
import { Watch } from "vue-property-decorator";
import { changeStatus } from "../../../service/routes";
import { AxiosResponse } from "axios";

@Component({})
export default class StopRecordingButton extends Vue {
  private stopped = tracksStore._stopped;
  private value = this.stopped ? "START RECORDING" : "STOP RECORDING";

  get storedStopped() {
    return tracksStore._stopped;
  }

  handleClick() {
    tracksStore.setStopped(!tracksStore.stopped);
    changeStatus((response: AxiosResponse<any>) =>
      tracksStore.setStopped(response.data.stopped)
    );
  }

  @Watch("storedStopped")
  changeStopped() {
    this.stopped = tracksStore._stopped;
    this.value = this.stopped ? "START RECORDING" : "STOP RECORDING";
  }
}
</script>

<style scoped></style>
