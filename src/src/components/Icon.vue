<style scoped rel="stylesheet/scss" lang="scss">
  .v-icon {
    vertical-align: middle;
  }
</style>

<template>
  <i class="iconfont v-icon" :style="style" :class="'icon-'+name" @click="clickIcon"></i>
</template>

<script>
export default {
  name: 'icon',
  props: {
    name: {
      default: ''
    },
    color: {
      default: 'inherit'
    },
    size: {
      default: 'inherit'
    },
    margin: {
      default: '0'
    },
    rotate: {
      default: true
    }
  },
  computed: {
    style() {
      const color = this.color;
      const fontSize = this.size;
      const margin = this.margin;
      let style = {
        color,
        fontSize,
        margin
      };
      return style;
    }
  },
  methods: {
    clickIcon() {
      this.$emit('click');
      this.$emit('tap');
    }
  }
};
</script>
