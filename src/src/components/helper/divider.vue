<style scoped rel="stylesheet/scss" lang="scss">
  .divider {
    width: 100%;
  }
</style>

<template>
  <div class="divider" :style="{ 'background-color': color, height: height,'margin-top': margin,'margin-bottom':margin }">
  </div>
</template>

<script>
export default {
  name: 'divider',
  props: {
    color: {
      default: '#f0f3f5'
    },
    height: {
      default: '1px'
    },
    margin: {
      default: '10px'
    }
  },
  data() {
    return {
    };
  }
};
</script>
