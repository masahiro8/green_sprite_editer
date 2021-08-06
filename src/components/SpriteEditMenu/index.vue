<template>
  <ul class="spriteEditMenu">
    <li><button @click="onCopy">copy</button></li>
    <li><button @click="onToBack">ToBack</button></li>
    <li><button @click="onToFront">ToFront</button></li>
    <li><button @click="deleteSprite">delete</button></li>
  </ul>
</template>
<script>
const getMaxZindex = (items) => {
  let z = 0;
  items.forEach((item) => {
    if ("z_index" in item.transform && z < item.transform.z_index) {
      z = item.transform.z_index;
    }
  });
  return z;
};

export default {
  props: {
    items: {
      type: Array,
    },
    selectedId: {
      type: Number,
    },
  },
  methods: {
    onCopy() {},

    onToBack() {
      let z = getMaxZindex(this.items);
      this.items.forEach((item) => {
        if ("z_index" in item.transform && z > item.transform.z_index) {
          z = item.transform.z_index;
        }
      });
      let items = JSON.parse(JSON.stringify(this.items));
      items = items.map((item) => {
        if (item.id === this.selectedId) {
          item.transform.z_index = z - 1;
          return item;
        }
        return item;
      });
      this.$emit("on-edit-items", items);
    },

    //一番手前に
    onToFront() {
      let z = getMaxZindex(this.items);
      let items = JSON.parse(JSON.stringify(this.items));
      items = items.map((item) => {
        if (item.id === this.selectedId) {
          let _item = { ...item };
          _item.transform["z_index"] = z + 1;
          return _item;
        }
        return item;
      });
      this.$emit("on-edit-items", items);
    },

    // 削除
    deleteSprite() {
      const items = [...this.items];
      const index = this.items.findIndex((item) => {
        return item.id === this.selectedId;
      });
      items.splice(index, 1);
      this.$emit("on-edit-items", items);
    },
  },
};
</script>
<style lang="scss" scoped>
.spriteEditMenu {
  position: absolute;
  bottom: 8px;
  left: calc(50%);
  z-index: 1000;
}
</style>