<template>
  <div style="padding: 0 15px;" @click="toggleClick">
    <svg-icon :class="{ 'is-active': isActive }" class="hamburger" icon-class="fold" />
  </div>
</template>

<script>
export default {
  name: 'Hamburger',
  props: {
    isActive: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    toggleClick() {
      this.$emit('toggleClick')
    }
  }
}
</script>

<style scoped>
.hamburger {
  display: inline-block;
  vertical-align: middle;
  width: 20px;
  height: 20px;
}

.hamburger.is-active {
  /* transform: rotate(180deg); */ /* 如果用 fold-arrow 则旋转 180 度 */
  transform: rotate(90deg); /* 如果用 fold 则只旋转 90 度 */
}
</style>
