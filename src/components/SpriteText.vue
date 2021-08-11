<template>
  <Sprite
    :item="item"
    :selected="selected"
    :onUpdate="onUpdate"
    :mainCanvasRect="mainCanvasRect"
    :isRotatable="false"
    @onselect="onSelect"
  >
    <div
      class="innerText"
      :class="getClass"
      :contenteditable="selected"
      v-text="innerContent"
      @input="sync"
    ></div>
  </Sprite>
</template>
<script>
import Sprite from "./_Sprite.vue";
import { TEXT_ALIGN, TEXT_SIZE, TEXT_COLOR } from "@/constants/SPRITE_TEXT.js";

const getKey = (obj, val) => {
  return Object.keys(obj).find((key) => {
    return obj[key] === val;
  });
};

export default {
  data: () => {
    return {
      content: "",
      innerContent: "",
      updateTimer: null,
    };
  },
  mounted() {
    this.innerContent = this.item.text;
    this.content = this.item.text;

    this.$watch(
      () => this.selected,
      (newVal, oldVal) => {
        // 選択から外れたら更新
        if (!newVal && newVal !== oldVal) {
          this.updateValue();
        }
      }
    );
  },
  components: {
    Sprite,
  },
  computed: {
    getClass() {
      const { text_size, text_align, text_color } = this.item;
      let _class = ``;
      if (text_size) _class += `size_${getKey(TEXT_SIZE, text_size)} `;
      if (text_align) _class += `align_${getKey(TEXT_ALIGN, text_align)} `;
      if (text_color) _class += `color_${getKey(TEXT_COLOR, text_color)} `;
      if (this.selected) _class += "selected";
      return _class;
    },
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
      clearTimeout(this.updateTimer);
      let text = e.target.innerHTML;
      text = text.replace(/<br>/gi, "\n");
      text = text.replace(/(<\/([^>]+)>)/gi, "");
      text = text.replace(/(<([^>]+)>)/gi, "\n");
      this.content = text;
      this.updateTimer = setTimeout(() => {
        this.updateValue();
      }, 1000);
    },
    updateValue() {
      const item = this.item;
      item.text = `${this.content}`;
      this.$emit("update-text", item);
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
  word-break: break-all;
  white-space: pre-wrap;
  user-select: none;

  &.selected {
    user-select: text;
  }
}
.size {
  &_small {
    font-size: 12px;
  }
  &_middle {
    font-size: 16px;
  }
  &_big {
    font-size: 20px;
  }
}
.align {
  &_left {
    text-align: left;
  }
  &_center {
    text-align: center;
  }
  &_right {
    text-align: right;
  }
}
.color {
  &_white {
    color: white;
  }
  &_black {
    color: black;
  }
  &_red {
    color: red;
  }
  &_blue {
    color: blue;
  }
  &_green {
    color: green;
  }
}
</style>