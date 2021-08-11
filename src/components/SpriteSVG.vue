<template>
  <Sprite
    :item="item"
    :selected="selected"
    :onUpdate="onUpdate"
    :mainCanvasRect="mainCanvasRect"
    :acceptRatio="false"
    @onselect="onSelect"
  >
    <img class="svg" :src="getImageSrc()" />
  </Sprite>
</template>
<script>
import Sprite from "./_Sprite.vue";
export default {
  components: {
    Sprite,
  },
  props: {
    selected: {
      type: Boolean,
      default: false,
    },
    item: {
      type: Object,
      default: null,
    },
    onUpdate: {
      type: Function,
      default: () => {},
    },
    mainCanvasRect: {
      type: Object,
      default: () => {
        return { x: 0, y: 0, height: 100, width: 100, scale: 1.0 };
      },
    },
  },
  methods: {
    onSelect(id) {
      this.$emit("onselect", id);
    },
    getImageSrc() {
      if (this.item.image_svg) return this.item.image_svg;
    },
  },
};
</script>
<style lang="scss" scoped>
.sprite {
  border: none;
}
.svgWrapper {
  width: 100%;
  height: 100%;
}
.svg {
  width: 100%;
  height: 100%;
  pointer-events: none;
  user-select: none;
}
</style>