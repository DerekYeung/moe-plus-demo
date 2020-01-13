<style scoped rel="stylesheet/scss" lang="scss">

</style>

<template>
  <div v-title data-title="首页">
    <view-header title="MoePlus Demo"></view-header>
    <view-content>
      <van-cell title="路由跳转(Page)" is-link @click="showRouterDemo" />
      <van-cell title="HTTP请求(Api)" is-link @click="showApiDemo" />
      <van-cell title="Storage(Session)" is-link @click="showSessionDemo" />
      <van-cell title="Socket(Socket)" is-link @click="showSocketDemo" />
      <van-cell title="数据库(Database)" is-link @click="showDatabaseDemo" />
      <van-cell title="浏览器(Browser)" is-link @click="showBrowserDemo" />
      <van-cell title="扫码(Qrcode)" is-link @click="showQrcodeDemo" />
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
    showRouterDemo() {
      this.Page.open('/demo/router/index');
    },
    showApiDemo() {
      this.Page.open('/demo/api/index');
    },
    showSessionDemo() {
      this.Page.open('/demo/session/index');
    },
    showSocketDemo() {
      this.Page.open('/demo/developer/socket');
    },
    showDatabaseDemo() {
      this.Page.open('/demo/developer/database');
    },
    showBrowserDemo() {
      this.Page.open('/demo/developer/browser');
    },
    showQrcodeDemo() {
      this.Page.invoke('/tool/qrcode/scan');
    }
  }
};
</script>
