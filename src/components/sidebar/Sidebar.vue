<template>
  <div
    id="sidebar"
    class="container d-flex flex-column justify-content-between"
  >
    <div>
      <h1 class="text-info">Tracks</h1>
      <a
        :href="url_upload"
        target="_self"
        rel="noopener noreferrer"
        class="text-secondary"
      >
        <span>UPLOAD NEW FILE</span>
      </a>
    </div>
    <template v-if="isTrack"><TrackList /></template>
    <template v-else>No recorded tracks</template>
    <StopRecordingButton />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { tracksStore } from "../../store/modules/tracks";
import TrackList from "./components/TrackList.vue";
import StopRecordingButton from "./components/StopRecordingButton.vue";
import { Watch } from "vue-property-decorator";

@Component({
  components: { TrackList, StopRecordingButton }
})
export default class Sidebar extends Vue {
  private url_upload: string =
    process.env.VUE_APP_UPLOAD || "http://localhost:5000";
  private isTrack = tracksStore._tracks && tracksStore._tracks.length > 0;

  get storeTracks() {
    return tracksStore._tracks;
  }

  @Watch("storeTracks")
  changeTracks() {
    this.isTrack = tracksStore._tracks && tracksStore._tracks.length > 0;
  }
}
</script>

<style>
#sidebar {
  min-width: 300px;
  width: 15%;
  height: 100vh;
  padding: 60px 20px;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 50 !important;
  background: white;
}
</style>
