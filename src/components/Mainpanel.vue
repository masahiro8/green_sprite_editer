<template>
  <div
    id="mainPanel"
    class="mainPanel"
    :class="readOnly ? 'readOnly' : ''"
    @click="clickOutside"
  >
    <!-- svg,テキストを変更するメニュー -->
    <Submenu
      :items="items"
      :selectedId="selectedId"
      @update-svg="updateSvg"
      @update-text="updateText"
    />
    <!-- 背景スプライト -->
    <SpriteBackground
      :item="background"
      :active="backgroundActive"
      :onUpdate="onUpdateBackground"
      :mainCanvasRect="mainCanvasRect"
      @onselect="onSelect"
    />
    <!-- スプライト操作メニュー -->
    <SpriteEditMenu
      v-if="isShowSpriteEditMenu"
      :items="items"
      :selectedId="selectedId"
      @on-select-id="onSelect"
      @on-edit-items="onUpdateItems"
    />
    <!-- 画像 -->
    <SpriteImage
      v-for="item in itemsImages"
      :key="item.id"
      :item="item"
      :selected="selectedId === item.id"
      :onUpdate="onUpdate"
      :mainCanvasRect="mainCanvasRect"
      @onselect="onSelect"
    />
    <SpriteSVG
      v-for="item in itemsSVG"
      :key="item.id"
      :item="item"
      :selected="selectedId === item.id"
      :onUpdate="onUpdate"
      :mainCanvasRect="mainCanvasRect"
      @onselect="onSelect"
      @update-svg="updateSvg"
    />
    <!-- テキスト -->
    <SpriteText
      v-for="item in itemsText"
      :key="item.id"
      :item="item"
      :selected="selectedId === item.id"
      :onUpdate="onUpdate"
      :mainCanvasRect="mainCanvasRect"
      @onselect="onSelect"
      @update-text="updateText"
    />
    <!-- 手書用のキャンバス -->
    <div
      ref="mainCanvas"
      class="mainCanvas"
      :class="canvas.isShow ? 'show' : ''"
    >
      <Canvas
        v-if="canvas.isShow"
        :spriteId="canvas.tmpId"
        @base64image="callbackPngImage"
        @close="canvas.isShow = false"
      />
    </div>
  </div>
</template>

<script>
import { getUniqueId, getMaxZindex } from "@/util/Util.js";
import Submenu from "@/components/SubmenuWrapper/index.vue";
import SpriteImage from "@/components/SpriteImage.vue";
import SpriteSVG from "@/components/SpriteSVG.vue";
import SpriteText from "@/components/SpriteText.vue";
import SpriteBackground from "@/components/SpriteBackground.vue";
import Canvas from "@/components/Canvas/Canvas.vue";
import { Firebase } from "@/util/FirebaseUtil.js";
import SpriteEditMenu from "@/components/SpriteEditMenu/index.vue";

const colors = ["red", "blue", "green"];
const image = "/images/_vrmonkey.png";
const shape = "/images/Rectangle_red.svg";

export default {
  name: "Mainpanel",
  components: {
    Submenu,
    SpriteImage,
    SpriteText,
    SpriteBackground,
    SpriteSVG,
    Canvas,
    SpriteEditMenu,
  },
  data: () => {
    return {
      Firebase: Firebase(),
      //キャンバス作るたびに仮のidをふる
      canvas: {
        tmpId: null,
        isShow: false,
      },
      backgroundActive: false,
      selectedId: null,
      mainCanvasRect: { x: 100, y: 100, height: 100, width: 100, scale: 1.0 },
    };
  },
  computed: {
    getViewCenter() {
      // TODO 設定した描画領域のサイズを取得
      return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    },
    itemsImages() {
      return this.items.filter((item) => {
        return item.image_url || item.image_base64;
      });
    },
    itemsSVG() {
      return this.items.filter((item) => {
        return "image_svg" in item && item.image_svg;
      });
    },
    itemsText() {
      return this.items.filter((item) => {
        return item.text;
      });
    },
    isShowSpriteEditMenu() {
      if (this.readOnly) return false;
      return !this.canvas.isShow;
    },
  },
  props: {
    items: {
      type: Array,
    },
    background: {
      type: Object,
    },
    readOnly: {
      type: Boolean,
    },
  },
  async mounted() {
    // キャンバスのサイズを取得
    // 座標・スケールの正規化をする必要がある
    const mainCanvas = this.$refs.mainCanvas;
    let mainCanvasRect = mainCanvas.getBoundingClientRect();
    mainCanvasRect.scale = 1.0;
    this.mainCanvasRect = {
      x: mainCanvasRect.x,
      y: mainCanvasRect.y,
      width: mainCanvasRect.width,
      height: mainCanvasRect.height,
      scale: mainCanvasRect.scale,
    };
  },
  methods: {
    //　画像スプライトを追加
    add() {
      if (this.readOnly) return;
      const id = getUniqueId(this.items);
      const index = Math.floor(Math.random() * colors.length);
      const z = getMaxZindex(this.items);
      const items = [...this.items];
      items.push({
        id,
        color: colors[index],
        image_url: image,
        image_base64: null,
        transform: {
          z_index: z + 1,
          x: this.getViewCenter.x,
          y: this.getViewCenter.y,
          width: 100,
          height: 100,
          rotation: 0,
        },
      });
      this.selectedId = id;
      this.onUpdateItems(items);
    },

    //　画像スプライトを追加
    addShape() {
      if (this.readOnly) return;
      const id = getUniqueId(this.items);
      const index = Math.floor(Math.random() * colors.length);
      const z = getMaxZindex(this.items);
      const items = [...this.items];
      items.push({
        id,
        color: colors[index],
        image_svg: shape,
        image_url: null,
        image_base64: null,
        transform: {
          z_index: z + 1,
          x: this.getViewCenter.x,
          y: this.getViewCenter.y,
          width: 100,
          height: 100,
          rotation: 0,
        },
      });
      this.selectedId = id;
      this.onUpdateItems(items);
    },

    // キャンバススプライトを追加
    addSpriteFromCanvas(base64Image, rect) {
      const id = getUniqueId(this.items);
      const index = Math.floor(Math.random() * colors.length);
      const z = getMaxZindex(this.items);
      const items = [...this.items];
      items.push({
        id,
        color: colors[index],
        image_url: "",
        image_base64: base64Image,
        transform: {
          z_index: z + 1,
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height,
          rotation: 0,
        },
      });
      this.selectedId = id;
      this.onUpdateItems(items);
    },

    addText() {
      const id = getUniqueId(this.items);
      const index = Math.floor(Math.random() * colors.length);
      const z = getMaxZindex(this.items);
      const items = [...this.items];
      items.push({
        id,
        color: colors[index],
        image_url: null,
        image_base64: null,
        text: "text",
        text_align: 1,
        text_size: 1,
        text_color: 1,
        text_bold: false,
        transform: {
          z_index: z + 1,
          x: this.getViewCenter.x,
          y: this.getViewCenter.y,
          width: 100,
          height: 100,
          rotation: 0,
        },
      });
      this.selectedId = id;
      this.onUpdateItems(items);
    },

    onUpdateItems(items) {
      this.$emit("on-update-items", items);
    },

    // 手書き描画
    showCanvas() {
      const canvas = { ...this.canvas };
      canvas.isShow = true;
      canvas.tmpId = Math.floor(Math.random() * 99999);
      this.canvas = canvas;
      this.selectedId = null;
      this.backgroundActive = false;
    },

    // レイアウト更新
    onUpdate(id, transform) {
      let items = [...this.items];
      items = items.map((item) => {
        if (item && item.id === id) {
          item.transform = transform;
        }
        return item;
      });
      this.onUpdateItems(items);
    },

    // 図面更新
    onUpdateBackground(id, transform) {
      console.log(id, { ...transform });
      const background = { ...this.background };
      background.transform = transform;
      this.$emit("on-update-background", background);
    },

    //テキストを更新
    updateText(updatedItem) {
      let items = [...this.items];
      items = items.map((item) => {
        if (item && item.id === updatedItem.id) {
          return updatedItem;
        }
        return item;
      });
      this.onUpdateItems(items);
    },

    //SVGの更新
    updateSvg(updatedItem) {
      let items = [...this.items];
      items = items.map((item) => {
        if (item && item.id === updatedItem.id) {
          return updatedItem;
        }
        return item;
      });
      this.onUpdateItems(items);
    },

    onSelect(id) {
      this.selectedId = id;
      this.backgroundActive = false;
      console.log("onSelect ", id);
    },

    callbackPngImage({ base64, rect }) {
      this.addSpriteFromCanvas(base64, rect);
    },

    clickOutside() {
      this.selectedId = null;
      console.log("clickOutside");
    },
  },
};
</script>

<style lang="scss" scoped>
.mainPanel {
  width: 100%;
  height: 100%;
  position: relative;
  &.readOnly {
    pointer-events: none;
  }
}
.mainCanvas {
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 9999;
  pointer-events: none;
  &.show {
    pointer-events: all;
    background-color: rgba(0, 0, 0, 0.3);
  }
}
.backgroundImage {
  top: 0;
  left: 0;
  width: 800px;
  height: 800px;
  border: 1px solid red;
  position: absolute;
  z-index: -99;
}
</style>
