<template>
  <Sprite
    :item="item"
    :selected="selected"
    :onUpdate="onUpdate"
    :mainCanvasRect="mainCanvasRect"
    @onselect="onSelect"
  >
    <img class="image" :src="image" />
  </Sprite>
</template>
<script>
import Sprite from "./_Sprite.vue";
import { toDataURLCanvas } from "@/util/Util";
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
  data: () => {
    return {
      image: "",
    };
  },
  mounted() {
    // 画像をbase64に変換する
    this.$watch(
      () => this.item,
      async (newValue) => {
        if (newValue.image_url) {
          const base64 = await toDataURLCanvas(newValue.image_url);
          this.image = base64;
        }
        if (newValue.image_base64) this.image = newValue.image_base64;
      },
      { immediate: true, deep: true }
    );
  },
  methods: {
    onSelect(id) {
      this.$emit("onselect", id);
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