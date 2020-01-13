<style scoped rel="stylesheet/scss" lang="scss">

</style>

<template>
  <div v-title data-title="首页">
    <view-header left-arrow title="路由跳转"></view-header>
    <view-content>
      页面打开次数： {{count}} 次<br />
      页面关闭后自动销毁
    </view-content>
  </div>
</template>

<script>
export default {
  name: 'index',
  data() {
    return {
      count: 0
    };
  },
  mounted() {
  },
  methods: {
    onPageShow() {
      this.count++;
    },
    open() {
      this.Page.open('/demo/router/open');
    }
  }
};
</script>
