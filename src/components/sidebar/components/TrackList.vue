<template>
  <b-list-group class="tracks mt-5 mb-5"
    ><ListItem
      v-for="track in tracks"
      :key="track.id"
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
  private tracks: Array<object> = tracksStore.sortedTracks;

  get storedTracks() {
    return tracksStore.sortedTracks;
  }

  @Watch("storedTracks")
  changeTracks() {
    this.tracks = tracksStore.sortedTracks;
  }
}
</script>

<style scoped>
.tracks {
  overflow-y: auto;
  height: 100%;
}
</style>
