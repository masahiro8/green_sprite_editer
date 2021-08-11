<template>
  <DDR
    ref="spriteParent"
    :value="item.transform"
    :active="selected"
    :rotatable="rotatable"
    :draggable="draggable"
    :resizable="resizable"
    :parent="false"
    :resizeHandler="['tl', 'tr', 'br', 'bl']"
    :accept-ratio="acceptRatio"
    @drag="onDrag"
    @drag-start="onDragStart"
    @drag-end="onDragEnd"
    @resize="onResize"
    @resize-start="onResizeStart"
    @resize-end="onResizeEnd"
    @rotate="onResize"
    @rotate-start="onRotateStart"
    @rotate-end="onRotateEnd"
  >
    <button
      ref="sprite"
      class="sprite"
      @click.stop="$emit('onselect', item.id)"
      :style="`width: 100%; height: 100%; background:rgba(0,0,0,0)`"
    >
      <slot></slot>
    </button>
  </DDR>
</template>
<script>
/**
 * https://github.com/zuimeiaj/yoyoo-ddr
 */
import DDR from "yoyoo-ddr";
import "yoyoo-ddr/dist/yoyoo-ddr.css";
export default {
  data() {
    return {
      active: true,
      rotatable: true,
      draggable: true,
      resizable: true,
      parent: false,
    };
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
    isRotatable: {
      type: Boolean,
      default: true,
    },
    acceptRatio: {
      type: Boolean,
      default: true,
    },
  },
  mounted() {
    // セル情報とキャンバスサイズが変更されたらデータを正規化
    this.$watch(
      () => this.item,
      (newValue, oldValue) => {
        if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
          console.log("updated", newValue.id);
          const item = newValue;
          //zindex変更
          this.setZindex(item.transform?.z_index);
        }
      },
      {
        immediate: true,
        deep: true,
      }
    );

    // 回転チェック
    this.$watch(
      () => [this.isRotatable],
      (newValue) => {
        this.rotatable = newValue[0];
      },
      {
        immediate: true,
        deep: true,
      }
    );
  },
  methods: {
    setZindex(n) {
      const z = n || this.item.transform?.z_index || 1;
      this.$refs.spriteParent.$el.style.zIndex = z;
    },
    onDrag(event, transform) {},
    onDragStart(event, transform) {},
    onDragEnd(event, transform) {
      this.onUpdate(this.item.id, transform);
    },

    onResize(event, transform) {},
    onResizeStart(event, transform) {},
    onResizeEnd(event, transform) {
      this.onUpdate(this.item.id, transform);
    },

    onRotate(event, transform) {},
    onRotateStart(event, transform) {},
    onRotateEnd(event, transform) {
      this.onUpdate(this.item.id, transform);
    },
  },
  components: {
    DDR,
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