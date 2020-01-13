<style scoped rel="stylesheet/scss" lang="scss">

</style>

<template>
  <div v-title data-title="首页">
    <view-header left-arrow title="路由跳转"></view-header>
    <view-content>
      <van-cell title="打开新页面" is-link @click="open" />
      <van-cell title="从下方弹出" is-link @click="popup" />
      <van-cell title="打开自动销毁的页面" is-link @click="invoke" />
    </view-content>
  </div>
</template>

<script>
export default {
  name: 'index',
  data() {
    return {
      isHtml5Plus: false
    };
  },
  mounted() {
  },
  methods: {
    open() {
      this.Page.open('/demo/router/page');
    },
    popup() {
      this.Page.pop('/demo/router/page');
    },
    invoke() {
      this.Page.invoke('/demo/router/invoke');
    }
  }
};
</script>
