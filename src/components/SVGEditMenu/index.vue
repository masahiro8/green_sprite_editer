<template>
  <ul class="editMenu">
    <li>
      <button @click.stop="color(SVG_COLOR.rectangle_white)">white</button>
    </li>
    <li><button @click.stop="color(SVG_COLOR.rectangle_red)">red</button></li>
    <li><button @click.stop="color(SVG_COLOR.rectangle_blue)">blue</button></li>
    <li>
      <button @click.stop="color(SVG_COLOR.rectangle_green)">green</button>
    </li>
  </ul>
</template>
<script>
import { SVG_COLOR } from "@/constants/SPRITE_SVG.js";
export default {
  data: () => {
    return {
      SVG_COLOR,
    };
  },
  methods: {
    color(id) {
      this.$emit("svg-color", id);
    },
  },
};
</script>
<style lang="scss" scoped>
.editMenu {
  list-style: none;
  display: flex;
}
</style>