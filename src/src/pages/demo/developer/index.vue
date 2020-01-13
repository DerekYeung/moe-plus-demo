<style scoped rel="stylesheet/scss" lang="scss">
</style>

<template>
  <div v-title data-title="开发者模式">
    <view-header title="开发者模式" left-arrow></view-header>
    <view-content>
      <helper-margin-block height="16px" />
      <biscuit-item path="/user/developer/push">
        <template slot="left">
          推送
        </template>
      </biscuit-item>
      <helper-margin-block height="16px" />
      <biscuit-item path="/user/developer/version">
        <template slot="left">
          版本&OTA
        </template>
      </biscuit-item>
      <helper-margin-block height="16px" />
      <biscuit-item path="/user/developer/database">
        <template slot="left">
          数据库
        </template>
      </biscuit-item>
      <helper-margin-block height="16px" />
      <biscuit-item path="/user/developer/badge">
        <template slot="left">
          角标
        </template>
      </biscuit-item>
      <helper-margin-block height="16px" />
      <biscuit-item path="/user/developer/pay">
        <template slot="left">
          支付
        </template>
      </biscuit-item>
      <helper-margin-block height="16px" />
      <biscuit-item path="/user/developer/account">
        <template slot="left">
          帐户
        </template>
      </biscuit-item>
      <helper-margin-block height="16px" />
      <biscuit-item path="/user/developer/browser">
        <template slot="left">
          浏览器
        </template>
      </biscuit-item>
      <helper-margin-block height="16px" />
      <biscuit-item path="/user/developer/capture">
        <template slot="left">
          截屏
        </template>
      </biscuit-item>
      <helper-margin-block height="16px" />
      <biscuit-item path="/user/developer/socket">
        <template slot="left">
          Socket
        </template>
      </biscuit-item>
      <helper-margin-block height="16px" />
      <biscuit-item path="/user/developer/map">
        <template slot="left">
          地图
        </template>
      </biscuit-item>
      <helper-margin-block height="16px" />
      <biscuit-item path="/user/developer/contact">
        <template slot="left">
          联系人
        </template>
      </biscuit-item>
      <helper-margin-block height="16px" />
      <biscuit-item path="/user/developer/permission">
        <template slot="left">
          权限
        </template>
      </biscuit-item>
      <helper-margin-block height="16px" />
      <biscuit-item path="/chat/message/item">
        <template slot="left">
          聊天
        </template>
      </biscuit-item>
    </view-content>
  </div>
</template>

<script>
export default {
  name: 'profile-form-setting',
  data() {
    return {
    };
  },
  methods: {
    logout() {
      // this.ActionSheet.show();
      this.Runtime.Passport.logout();
    }
  }
};
</script>
