<style scoped rel="stylesheet/scss" lang="scss">
</style>

<template>
  <div v-title :data-title="title">
    <view-header :title="title" left-arrow />
    <view-content>
      <biscuit-item>
        <template slot="left">
          Client Info
        </template>
      </biscuit-item>
      <helper-margin-block height="16px" />
      <div>{{pusher}}</div>
      <div>{{msg}}</div>
      <helper-margin-block height="16px" />
      <biscuit-item action="绑定" @tap="bindPush">
        <template slot="left">
          绑定
        </template>
      </biscuit-item>
      <helper-margin-block height="16px" />
      <biscuit-item action="解绑" @tap="unBindPush">
        <template slot="left">
          解绑
        </template>
      </biscuit-item>
      <helper-margin-block height="16px" />
      <biscuit-item action="推送" @tap="postPush">
        <template slot="left">
          推送
        </template>
      </biscuit-item>
      <helper-margin-block height="16px" />
      <biscuit-item action="延迟5秒" @tap="delayPush">
        <template slot="left">
          延迟推送
        </template>
      </biscuit-item>
      <helper-margin-block height="16px" />
      <biscuit-item action="延迟30秒" @tap="longDelayPush">
        <template slot="left">
          延迟推送
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
      title: '推送',
      pusher: '',
      msg: ''
    };
  },
  mounted() {
    this.$root.$on('push/click', () => {
      console.log('click');
    });
    this.$root.$on('push/receive', msg => {
      console.log('receive');
      this.msg = JSON.stringify(msg);
    });
  },
  methods: {
    onPageShow() {
      this.pusher = JSON.stringify(this.Runtime.Client.pusher);
    },
    bindPush() {
      this.Api.get('/test/push/bind').on('success', json => {
        console.log(JSON.stringify(json.data));
      });
    },
    unBindPush() {
      this.Api.get('/test/push/unbind').on('success', json => {
        console.log(JSON.stringify(json.data));
      });
    },
    postPush() {
      this.Api.get('/test/push/post').on('success', json => {
        console.log(JSON.stringify(json.data));
      });
    },
    delayPush() {
      this.Api.get('/test/push/post', {
        delay: 5
      }).on('success', json => {
        console.log(JSON.stringify(json.data));
      });
    },
    longDelayPush() {
      this.Api.get('/test/push/post', {
        delay: 30
      }).on('success', json => {
        console.log(JSON.stringify(json.data));
      });
    }
  }
};
</script>
