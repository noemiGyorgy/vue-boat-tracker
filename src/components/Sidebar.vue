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
    <StopRecordingButton />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import StopRecordingButton from "./StopRecordingButton.vue";

@Component({
  components: { StopRecordingButton }
})
export default class Sidebar extends Vue {
  private url_upload: string =
    process.env.VUE_APP_UPLOAD || "http://localhost:5000";
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
