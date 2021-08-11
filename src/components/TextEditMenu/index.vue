<template>
  <ul class="textEditMenu">
    <li><button @click.stop="align(TEXT_ALIGN.left)">left</button></li>
    <li><button @click.stop="align(TEXT_ALIGN.center)">center</button></li>
    <li><button @click.stop="align(TEXT_ALIGN.right)">right</button></li>
    <li><button @click.stop="size(TEXT_SIZE.small)">small</button></li>
    <li><button @click.stop="size(TEXT_SIZE.middle)">middle</button></li>
    <li><button @click.stop="size(TEXT_SIZE.big)">big</button></li>
    <li><button @click.stop="color(TEXT_COLOR.white)">white</button></li>
    <li><button @click.stop="color(TEXT_COLOR.black)">black</button></li>
    <li><button @click.stop="color(TEXT_COLOR.red)">red</button></li>
    <li><button @click.stop="color(TEXT_COLOR.blue)">blue</button></li>
    <li><button @click.stop="color(TEXT_COLOR.green)">green</button></li>
  </ul>
</template>
<script>
import { TEXT_ALIGN, TEXT_SIZE, TEXT_COLOR } from "@/constants/SPRITE_TEXT.js";
export default {
  data: () => {
    return {
      TEXT_ALIGN,
      TEXT_SIZE,
      TEXT_COLOR,
    };
  },
  methods: {
    align(id) {
      this.$emit("text-align", id);
    },
    size(id) {
      this.$emit("text-size", id);
    },
    color(id) {
      this.$emit("text-color", id);
    },
  },
};
</script>
<style lang="scss" scoped>
.textEditMenu {
  /* position: absolute; */
  list-style: none;
  display: flex;
  /* top: -64px; */
}
</style>