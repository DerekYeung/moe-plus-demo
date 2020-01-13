<style scoped rel="stylesheet/scss" lang="scss">
</style>

<template>
  <div v-title :data-title="title">
    <view-header :title="title" left-arrow />
    <view-content>
      <biscuit-item action="截图" @tap="capture">
        <template slot="left">
          截图
        </template>
      </biscuit-item>
      <img v-if="img" style="width: 100%" :src="img" />
    </view-content>
  </div>
</template>

<script>
export default {
  name: 'profile-form-connect',
  data() {
    return {
      title: '截屏',
      url: '',
      img: ''
    };
  },
  methods: {
    capture() {
      const engine = this.Runtime.engine;
      const webview = this.Page.current;
      let bitmap = new engine.nativeObj.Bitmap('test');
      webview.draw(bitmap, () => {
        this.img = bitmap.toBase64Data();
        bitmap.clear();
        console.log('截屏成功');
      }, e => {
        console.log('截屏失败');
      });
    }
  }
};
</script>
