<template>
  <ul class="canvasMenu">
    <li><button @click="onDelete()">delete</button></li>
  </ul>
</template>
<script>
export default {
  methods: {
    onDelete() {
      this.$emit("on-delete");
    },
  },
};
</script>
<style lang="scss" scoped>
.canvasMenu {
  position: absolute;
  bottom: 8px;
  left: calc(50%);
  z-index: 1000;
}
</style>