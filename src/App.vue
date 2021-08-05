<template>
  <div id="app">
    <div class="drawApp">
      <div class="leftPanel">
        <button @click="add">VR MONKEY</button>
        <button @click="showCanvas">Draw Line</button>
      </div>
      <div class="mainCanvas" @click="clickOutside">
        <!-- スプライト操作メニュー -->
        <SpriteEditMenu :isSelected="selectedId" @on-delete="deleteSprite" />
        <!-- スプライト -->
        <SpriteImage
          v-for="item in items"
          :key="item.id"
          :item="item"
          :selected="selectedId === item.id"
          :onUpdate="onUpdate"
          :mainCanvasRect="mainCanvasRect"
          @onselect="onSelect"
        />
        <!-- 手書用のキャンバス -->
        <div ref="mainCanvas" class="innerCanvas">
          <Canvas
            v-if="canvas.isShow"
            :spriteId="canvas.tmpId"
            @base64image="callbackPngImage"
            @close="canvas.isShow = false"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import Sprite from "@/components/Sprite.vue";
import SpriteImage from "@/components/SpriteImage.vue";
import Canvas from "@/components/Canvas/Canvas.vue";
import { Firebase } from "@/util/FirebaseUtil.js";
import SpriteEditMenu from "@/components/SpriteEditMenu/index.vue";
const colors = ["red", "blue", "green"];
const image =
  "https://storage.googleapis.com/co_backham_me/images/vrmonkey.png";

export default {
  name: "App",
  components: {
    // Sprite,
    SpriteImage,
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
    console.log({ ...this.mainCanvasRect });

    // Firebaseから取得
    const data = await this.Firebase.getData();
    console.log(data);
    this.items = data;
  },
  methods: {
    //　画像スプライトを追加
    add() {
      const index = Math.floor(Math.random() * colors.length);
      const items = [...this.items];
      const id = items.length + 1;
      items.push({
        id,
        color: colors[index],
        image_url: image,
        image_base64: null,
        transform: {
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
      const index = Math.floor(Math.random() * colors.length);
      const items = [...this.items];
      const id = items.length + 1;
      items.push({
        id,
        color: colors[index],
        image_url: "",
        image_base64: base64Image,
        transform: {
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

    deleteSprite() {
      const items = [...this.items];
      const index = items.findIndex((item) => {
        return item.id === this.selectedId;
      });
      items.splice(index, 1);
      this.items = items;
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
      console.log(id, { ...transform });
      let items = [...this.items];
      items = items.map((item) => {
        if (item.id === id) {
          item.transform = transform;
        }
        return item;
      });
      this.items = items;
      this.Firebase.setData(this.items);
      console.log([...this.items]);
    },

    onSelect(id) {
      this.selectedId = id;
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
.mainCanvas {
  flex: 1;
  height: 100%;
  background-color: blue;
  position: relative;
}
.innerCanvas {
  width: 100%;
  height: 100%;
}
</style>
