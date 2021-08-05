<template>
  <div class="canvasWrapper">
    <div class="canvasNavi">
      <button class="btn" @click.stop="onCancel">cancel</button>
      <button class="btn" @click.stop="onSave">save</button>
    </div>
    <canvas
      :id="canvasId"
      :ref="canvasId"
      :width="size.width"
      :height="size.height"
    ></canvas>
  </div>
</template>
<script>
import { CanvasUtil } from "@/canvasUtil/CanvasUtil";
export default {
  data: () => {
    return {
      canvas: null,
      canvasId: "canvas",
      size: {
        width: null,
        height: null,
      },
    };
  },
  props: {
    spriteId: {
      type: Number,
    },
  },
  mounted() {
    const rect = this.$parent.$el.getBoundingClientRect();
    this.size = { width: rect.width, height: rect.height };

    // 画面サイズの更新
    window.addEventListener("resize", () => {
      const rect = this.$parent.$el.getBoundingClientRect();
      this.size = { width: rect.width, height: rect.height };
    });

    // 新規作成
    this.$watch(
      () => this.spriteId,
      (newValue, oldValue) => {
        if (newValue !== oldValue) {
          this.canvas = CanvasUtil();
          this.canvas.init(this.canvasId);
          this.$nextTick(() => {
            this.canvas.drawStart();
          });
        }
      },
      {
        immediate: true,
      }
    );
  },
  methods: {
    getCanvas() {},
    onStartDraw() {
      this.canvas.drawStart();
    },
    onEndDraw() {
      this.canvas.drawEnd();
    },
    onSave() {
      this.canvas.drawEnd();
      this.$emit("base64image", this.canvas.getImage());
      this.$emit("close");
      // インスタンス削除
      this.$nextTick(() => {
        this.canvas.release();
        this.canvas = null;
      });
    },
    onCancel() {
      this.canvas.drawEnd();
      this.$emit("close");
      // インスタンス削除
      this.$nextTick(() => {
        this.canvas.release();
        this.canvas = null;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.canvasWrapper {
  position: relative;
}
.canvasNavi {
  display: flex;
}
canvas {
  width: 100%;
  height: 100%;
  border: 1px solid red;
}
</style>