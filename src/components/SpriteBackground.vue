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
  data: () => {
    return {
      selected: false,
    };
  },
  mounted() {
    this.$watch(
      () => this.active,
      (newValue) => {
        this.selected = newValue;
      },
      {
        immediate: true,
      }
    );
  },
  components: {
    Sprite,
  },
  props: {
    active: {
      type: Boolean,
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
    onSelect() {
      this.selected = !this.selected;
    },
    getImageSrc() {
      if (this.item.image_url) return this.item.image_url;
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
  user-select: none;
}
</style>