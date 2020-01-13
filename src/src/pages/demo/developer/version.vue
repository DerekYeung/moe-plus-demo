<style scoped rel="stylesheet/scss" lang="scss">
.fake-input {
  width: 80%;
  border: none;
}
</style>

<template>
  <div v-title :data-title="title">
    <view-header :title="title" left-arrow />
    <view-content>
      <helper-margin-block height="16px" />
      <biscuit-item action="绑定">
        <template slot="left">版本：{{version}} / {{mode}}</template>
      </biscuit-item>
      <helper-margin-block height="16px" />
      <biscuit-item action="版本管理" @tap="openUpdate">
        <template slot="left">
          版本管理
        </template>
      </biscuit-item>
      <helper-margin-block height="16px" />
      <biscuit-item action="打开更新页" @tap="openPage">
        <template slot="left">
          打开更新页
        </template>
      </biscuit-item>
      <helper-margin-block height="16px" />
      <div>{{tip}}</div>
    </view-content>
  </div>
</template>

<script>
export default {
  name: 'profile-form-connect',
  data() {
    return {
      title: '版本管理',
      url: 'http://oss.app.ewsedu.com/app-release.apk',
      tip: '',
      mode: '',
      version: ''
    };
  },
  methods: {
    onPageShow() {
      this.version = this.Runtime.Client.version + ' build ' + this.Runtime.Build;
      this.mode = this.Runtime.Config.mode == 'beta' ? '测试版' : '发行版';
    },
    update() {
      const Updater = this.Runtime.Updater;
      this.tip = 'downloading';
      Updater.download({
        data: {
          url: this.url,
          force: true,
          returnInfo: true
        }
      }).then(json => {
        this.tip = 'success: ' + JSON.stringify(json);
      }).catch(e => {
        this.tip = 'error';
      });
    },
    openPage() {
      this.Page.open('/common/update/index');
    },
    openUpdate() {
      this.Page.open('/user/developer/update');
    },
    openFile() {
      const Updater = this.Runtime.Updater;
      this.tip = 'downloading';
      Updater.download({
        data: {
          url: this.url,
          force: true,
          openFile: true,
          returnInfo: true
        }
      }).then(json => {
        this.tip = 'success: ' + json;
      }).catch(e => {
        this.tip = 'error';
      });
    }
  }
};
</script>
