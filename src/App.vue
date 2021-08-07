<template>
  <div id="app">
    <div class="drawApp">
      <div class="leftPanel">
        <button @click="add">VR MONKEY</button>
        <button @click="showCanvas">Draw Line</button>
        <button @click="addText">Add Text</button>
      </div>
      <div class="mainPanel" @click="clickOutside">
        <!-- スプライト操作メニュー -->
        <SpriteEditMenu
          :items="items"
          :selectedId="selectedId"
          @on-select-id="onSelect"
          @on-edit-items="onEditItems"
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
        <div ref="mainCanvas" class="mainCanvas">
          <Canvas
            v-if="canvas.isShow"
            :spriteId="canvas.tmpId"
            @base64image="callbackPngImage"
            @close="canvas.isShow = false"
          />
        </div>
        <!-- メイン画像 -->
      </div>
    </div>
  </div>
</template>

<script>
// import Sprite from "@/components/Sprite.vue";
import { getUniqueId } from "@/util/Util.js";
import SpriteImage from "@/components/SpriteImage.vue";
import SpriteText from "@/components/SpriteText.vue";
import Canvas from "@/components/Canvas/Canvas.vue";
import { Firebase } from "@/util/FirebaseUtil.js";
import SpriteEditMenu from "@/components/SpriteEditMenu/index.vue";
import { TEXT_ALIGN, TEXT_COLOR, TEXT_SIZE } from "@/constants/SPRITE_TEXT.js";
const colors = ["red", "blue", "green"];
const image =
  "https://storage.googleapis.com/co_backham_me/images/vrmonkey.png";

export default {
  name: "App",
  components: {
    // Sprite,
    SpriteImage,
    SpriteText,
    Canvas,
    SpriteEditMenu,
  },
  data: () => {
    return {
      Firebase: Firebase(),
      canvas: {
        tmpId: null,
        isShow: false,
      }, //キャンバス作るたびに仮のidをふる
      items: [],
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
    itemsText() {
      return this.items.filter((item) => {
        return item.text;
      });
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
    this.loadData();
  },
  methods: {
    async loadData() {
      // Firebaseから取得
      const data = await this.Firebase.getData();
      this.items = data.filter((v) => v);
    },
    //　画像スプライトを追加
    add() {
      const id = getUniqueId(this.items);
      const index = Math.floor(Math.random() * colors.length);
      const items = [...this.items];
      items.push({
        id,
        color: colors[index],
        image_url: image,
        image_base64: null,
        transform: {
          z_index: 1,
          x: this.getViewCenter.x,
          y: this.getViewCenter.y,
          width: 100,
          height: 100,
          rotation: 0,
        },
      });
      this.items = items;
      this.selectedId = id;
      this.Firebase.setData(this.items);
    },

    // キャンバススプライトを追加
    addSpriteFromCanvas(base64Image, rect) {
      const id = getUniqueId(this.items);
      const index = Math.floor(Math.random() * colors.length);
      const items = [...this.items];
      items.push({
        id,
        color: colors[index],
        image_url: "",
        image_base64: base64Image,
        transform: {
          z_index: 1,
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height,
          rotation: 0,
        },
      });
      this.items = items;
      this.selectedId = id;
    },

    addText() {
      const id = getUniqueId(this.items);
      const index = Math.floor(Math.random() * colors.length);
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
          z_index: 1,
          x: this.getViewCenter.x,
          y: this.getViewCenter.y,
          width: 100,
          height: 100,
          rotation: 0,
        },
      });
      this.items = items;
      this.selectedId = id;
    },

    onEditItems(items) {
      this.items = [...items];
      this.Firebase.setData(this.items);
    },

    // 手書き描画
    showCanvas() {
      const canvas = { ...this.canvas };
      canvas.isShow = true;
      canvas.tmpId = Math.floor(Math.random() * 99999);
      this.canvas = canvas;
      this.selectedId = null;
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
      this.items = items;
      this.Firebase.setData(this.items);
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
      this.items = items;
      this.Firebase.setData(this.items);
    },

    onSelect(id) {
      this.selectedId = id;
      console.log("onSelect ", id);
    },

    clickOutside() {
      // this.selectedId = null;
    },
    callbackPngImage({ base64, rect }) {
      this.addSpriteFromCanvas(base64, rect);
    },
  },
};
</script>

<style>
body {
  margin: 0;
  padding: 0;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  padding: 0;
  margin: 0;
}

.drawApp {
  display: flex;
  height: 100vh;
  width: 100vw;
}
.leftPanel {
  width: 120px;
  border-right: 1px solid black;
  background-color: #efefef;
}
.mainPanel {
  flex: 1;
  height: 100%;
  background-color: blue;
  position: relative;
}
.mainCanvas {
  width: 100%;
  height: 100%;
}
</style>
