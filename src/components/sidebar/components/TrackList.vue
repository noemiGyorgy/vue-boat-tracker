<template>
  <b-list-group class="tracks mt-5 mb-5"
    ><ListItem
      v-for="(track, index) in tracks"
      :key="index"
      :trackId="track.id"
      :start="track.start"
      :live="track.live"
  /></b-list-group>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Watch } from "vue-property-decorator";
import { tracksStore } from "../../../store/modules/tracks";
import ListItem from "./ListItem.vue";

@Component({ components: { ListItem } })
export default class TrackList extends Vue {
  private tracks = tracksStore._tracks;

  get storeTracks() {
    return tracksStore._tracks;
  }

  @Watch("storeTracks")
  changeTracks() {
    this.tracks = tracksStore._tracks;
  }
}
</script>

<style scoped>
.tracks {
  overflow-y: auto;
  height: 100%;
}
</style>
