<style scoped rel="stylesheet/scss" lang="scss">

.ui-loading-view {
  transition: all 218ms;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
  color: #b1adad;
  text-align: center;
}

.loading-tip {
  margin-top: 100px;
  font-size: 14px;
  font-weight: 200;
  margin-bottom: 20px;
  transition: all 1s ease;
}
</style>

<template>
  <section class="ui-loading-view loading-web">
    <div class="loading-mask">
      <div class="loading-tip" v-if="message">{{message}}</div>
    </div>
    <slot />
  </section>
</template>

<script>
export default {
  name: 'view-loading-web',
  props: [ 'message' ],
  data() {
    return {};
  }
};
</script>
