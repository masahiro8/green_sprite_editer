<template>
  <Sprite
    :item="item"
    :selected="selected"
    :onUpdate="onUpdate"
    :mainCanvasRect="mainCanvasRect"
    @onselect="onSelect"
  >
    <div
      class="innerText"
      :contenteditable="selected"
      v-text="innerContent"
      @input="sync"
    ></div>
  </Sprite>
</template>
<script>
import Sprite from "./_Sprite.vue";
export default {
  data: () => {
    return {
      content: "",
      innerContent: "",
    };
  },
  mounted() {
    this.innerContent = this.item.text;
    this.content = this.item.text;

    this.$watch(
      () => this.selected,
      (newVal, oldVal) => {
        // 選択から外れたら
        if (!newVal && newVal !== oldVal) {
          console.log("innerContent", this.content);
          const item = this.item;
          item.text = `${this.content}`;
          this.$emit("update-text", item);
        }
      }
    );
  },
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
    sync(e) {
      let text = e.target.innerHTML;
      text = text.replace(/<br>/gi, "\n");
      text = text.replace(/(<\/([^>]+)>)/gi, "");
      text = text.replace(/(<([^>]+)>)/gi, "\n");
      this.content = text;
    },
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
.innerText {
  width: 100%;
  white-space: pre-line;
}
</style>