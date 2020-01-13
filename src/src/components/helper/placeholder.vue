<style scoped rel="stylesheet/scss" lang="scss">
  .placeholder-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 10px;
    padding: 10px 0;
    color: #666;
    letter-spacing: 2px;
    border: 1px solid #efefef;
    border-radius: 10px;
    background: #fff;
  }
</style>

<template>
  <div class="placeholder-container" :style="{ color: color, height: height }">
    <div class="placeholder-body">
      {{text}}
    </div>
  </div>
</template>

<script>
export default {
  name: 'placeholder',
  props: {
    text: {
      default: 'Placeholder Name'
    },
    color: {
      default: '#666'
    },
    height: {
      default: '300px'
    }
  },
  data() {
    return {
      msg: 'test'
    };
  }
};
</script>
