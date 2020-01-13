<style scoped rel="stylesheet/scss" lang="scss">
</style>

<template>
  <div v-title :data-title="title">
    <view-header :title="title" left-arrow />
    <view-content>
      <helper-margin-block height="16px" />
      <biscuit-item action="绑定">
        <template slot="left">地址：<input v-model="url" type="text" /></template>
      </biscuit-item>
      <helper-margin-block height="16px" />
      <biscuit-item action="解绑" @tap="open">
        <template slot="left">
          打开
        </template>
      </biscuit-item>
    </view-content>
  </div>
</template>

<script>
export default {
  name: 'profile-form-connect',
  data() {
    return {
      title: '浏览器',
      url: 'http://www.baidu.com'
    };
  },
  methods: {
    open() {
      const url = this.url;
      this.Page.invoke('/webloader/browser/index', {
        url
      });
    }
  }
};
</script>
