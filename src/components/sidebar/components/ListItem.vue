<template>
  <b-list-group-item button :class="activeItem" @click="handleClick">
    <span class="text-danger">{{ live ? "⦿ " : "" }}</span>
    {{ new Date(start).toLocaleString() }}
  </b-list-group-item>
</template>

<script lang="ts">
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
    console.log(this.start);
  }
}
</script>

<style scoped></style>
