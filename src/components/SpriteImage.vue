<template>
  <Sprite
    :item="item"
    :selected="selected"
    :onUpdate="onUpdate"
    :mainCanvasRect="mainCanvasRect"
    @onselect="onSelect"
  >
    <img class="image" :src="getImageSrc()" />
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
      if (this.item.image_url) return this.item.image_url;
      if (this.item.image_base64) return this.item.image_base64;
    },
  },
};
</script>
<style lang="scss" scoped>
.sprite {
  border: none;
}
.image {
  width: 100%;
  pointer-events: none;
}
</style>