<style scoped rel="stylesheet/scss" lang="scss">

.ui-loading-view {
  transition: all 218ms;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
  color: white;
  text-align: center;
}

.loading-tip {
  margin-top: 30%;
  font-size: 24px;
  font-weight: 200;
  margin-bottom: 20px;
  transition: all 1s ease;
}
</style>

<template>
  <section class="ui-loading-view loading-web theme-background-gradient">
    <div class="loading-mask">
      <div class="loading-tip">
        正在<span>载入中</span>
      </div>
      <view-loading light="1" />
    </div>
    <slot></slot>
  </section>
</template>

<script>
export default {
  name: 'view-loading-web',
  data() {
    return {};
  }
};
</script>
