<style scoped rel="stylesheet/scss" lang="scss">
  .margin-block{
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: .9rem;
  }
</style>

<template>
  <div class="margin-block" :class="customClass" :style="{background: backgroundColor, height: height,color:textColor}">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'margin-block',
  props: {
    backgroundColor: {
      default: 'transparent'
    },
    height: {
      default: '10px'
    },
    textColor: {
      default: '#666'
    },
    classes: null
  },
  computed: {
    customClass() {
      return this.classes;
    }
  },
  data() {
    return {
    };
  }
};
</script>
