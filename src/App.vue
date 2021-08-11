<template>
  <div id="app">
    <div class="drawApp">
      <div class="leftPanel">
        <button @click="onCallMainpanel('add')">VR MONKEY</button>
        <button @click="onCallMainpanel('addShape')">四角</button>
        <button @click="onCallMainpanel('showCanvas')">Draw Line</button>
        <button @click="onCallMainpanel('addText')">Add Text</button>
        <button @click="onScreenShot">ScreenShot</button>
      </div>
      <div id="mainPanel" class="mainPanel">
        <!-- メイン画面 -->
        <Mainpanel
          ref="mainPanel"
          :readOnly="isShoot"
          :items="items"
          :background="background"
          @on-update-items="onUpdateItems"
          @on-update-background="onUpdateBackground"
        />
      </div>
      <div v-if="tmpScreenShot" class="previewScreenshot">
        <img :src="tmpScreenShot" />
      </div>
    </div>
  </div>
</template>

<script>
// import Sprite from "@/components/Sprite.vue";
import { Firebase } from "@/util/FirebaseUtil.js";
import html2canvas from "html2canvas";
/**
 * 描画
 */
import Mainpanel from "@/components/Mainpanel.vue";

const image =
  "https://storage.googleapis.com/co_backham_me/images/vrmonkey.png";

export default {
  name: "App",
  components: {
    Mainpanel,
  },
  data: () => {
    return {
      Firebase: Firebase(),
      // スプライト
      items: [],
      // 背景図面
      background: {
        id: 10000,
        image_url: image,
        transform: {
          z_index: 0,
          x: 0,
          y: 0,
          width: 800,
          height: 800,
          rotation: 0,
        },
      },
      // スクショ
      isShoot: false,
      tmpScreenShot: null,
    };
  },
  computed: {},
  async mounted() {
    this.loadData();
  },
  methods: {
    async loadData() {
      // Firebaseから取得
      const data = await this.Firebase.getData();
      if (data) this.items = data.filter((v) => v);
      const background = await this.Firebase.getBackground();
      if (background) this.background = background;
    },

    onCallMainpanel(method) {
      console.log(this.$refs.mainPanel);
      if (method === "add") this.$refs.mainPanel.add();
      if (method === "addShape") this.$refs.mainPanel.addShape();
      if (method === "showCanvas") this.$refs.mainPanel.showCanvas();
      if (method === "addText") this.$refs.mainPanel.addText();
    },

    onUpdateItems(items) {
      this.items = items;
      this.Firebase.setData(this.items);
    },

    onUpdateBackground(background) {
      this.background = background;
      this.Firebase.setBackground(this.background);
    },

    onScreenShot() {
      this.isShoot = true;
      this.$nextTick(() => {
        html2canvas(document.getElementById("mainPanel")).then((canvas) => {
          canvas.id = "screenshot";
          document.body.appendChild(canvas);
          this.tmpScreenShot = canvas.toDataURL("image/png");
          setTimeout(() => {
            this.isShoot = false;
            this.tmpScreenShot = null;
            document.getElementById("screenshot").remove();
          }, 3000);
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
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
  position: relative;
  min-width: 800px;
  min-height: 800px;
}
.mainPanelGoast {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}
.previewScreenshot {
  position: fixed;
  bottom: 32px;
  right: 32px;
  width: 320px;
  height: 320px;
  display: flex;
  align-items: center;
  border: 1px solid black;
  z-index: 999;
  background-color: white;
  img {
    width: 100%;
  }
}
</style>
