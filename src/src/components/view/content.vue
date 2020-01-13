<style scoped lang="scss">
  .ui-content-view {
    padding-top: 44px;
    width: 100%;
    height: auto;
    background: #f0f3f5;
  }
</style>

<template>
  <section class="ui-content-view" :style="{'padding-top': top}">
    <slot></slot>
  </section>
</template>

<script>
export default {
  name: 'view-content',
  props: {
    title: {
      default: '*title'
    },
    list: {},
    action: {},
    marginHeight: {
      default: 44
    }
  },
  data() {
    return {
      top: '44px'
    };
  },
  created() {
    const top = Number(this.marginHeight) + this.$store.getters.getImmersedHeight + 'px';
    if (parseInt(top) > 44) {
      this.top = top;
    }
  }
};
</script>
