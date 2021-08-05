<template>
  <ul class="canvasMenu">
    <li>
      <button
        class="canvasMenu__btn"
        :disabled="!isSelected"
        @click="onDelete()"
      >
        delete
      </button>
    </li>
  </ul>
</template>
<script>
export default {
  props: {
    isSelected: {
      type: Number,
      default: null,
    },
  },
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
.canvasMenu__btn {
  &:disabled {
    opacity: 0.3;
    &:hover {
      cursor: default;
    }
  }
}
</style>