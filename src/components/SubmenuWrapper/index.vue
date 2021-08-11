<template>
  <div class="submenu">
    <SVGEditMenu v-if="isSVGSprite" @svg-color="updateSvgColor" />
    <TextEditMenu
      v-if="isTextSprite"
      @text-align="updateTextAlign"
      @text-size="updateTextSize"
      @text-color="updateTextColor"
    />
  </div>
</template>
<script>
import SVGEditMenu from "@/components/SVGEditMenu/index.vue";
import TextEditMenu from "@/components/TextEditMenu/index.vue";
import { TEXT_ALIGN, TEXT_SIZE, TEXT_COLOR } from "@/constants/SPRITE_TEXT.js";

const getKey = (obj, val) => {
  return Object.keys(obj).find((key) => {
    return obj[key] === val;
  });
};

export default {
  components: {
    SVGEditMenu,
    TextEditMenu,
  },
  computed: {
    // svgが選択されているか
    isSVGSprite() {
      const item = this.items.find((_item) => {
        return (
          _item.id === this.selectedId &&
          "image_svg" in _item &&
          _item.image_svg
        );
      });
      return item ? true : false;
    },
    isTextSprite() {
      const item = this.items.find((_item) => {
        return _item.id === this.selectedId && "text" in _item && _item.text;
      });
      return item ? true : false;
    },
  },
  props: {
    items: {
      type: Array,
    },
    selectedId: {
      type: Number,
    },
  },
  methods: {
    onUpdateItems(items) {
      this.$emit("on-update-items", items);
    },
    updateSvgColor(src) {
      let item = this.items.find((_item) => {
        return _item.id === this.selectedId;
      });
      item.image_svg = src;
      this.$emit("update-svg", item);
    },
    updateTextAlign(id) {
      let item = this.items.find((_item) => {
        return _item.id === this.selectedId;
      });
      item.text_align = TEXT_ALIGN[getKey(TEXT_ALIGN, id)];
      this.$emit("update-text", item);
    },
    updateTextSize(id) {
      let item = this.items.find((_item) => {
        return _item.id === this.selectedId;
      });
      item.text_size = TEXT_SIZE[getKey(TEXT_SIZE, id)];
      this.$emit("update-text", item);
    },
    updateTextColor(id) {
      let item = this.items.find((_item) => {
        return _item.id === this.selectedId;
      });
      item.text_color = TEXT_COLOR[getKey(TEXT_COLOR, id)];
      this.$emit("update-text", item);
    },
  },
};
</script>
<style lang="scss" scoped>
.submenu {
  display: flex;
  justify-content: center;
}
</style>