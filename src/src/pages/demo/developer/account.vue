<style scoped rel="stylesheet/scss" lang="scss">
</style>

<template>
  <div v-title :data-title="title">
    <view-header :title="title" left-arrow />
    <view-content>
      <helper-margin-block height="16px" />
      <biscuit-item action="绑定" @tap="test">
        <template slot="left">
          测试
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
      title: '帐户',
      pusher: '',
      msg: ''
    };
  },
  methods: {
    test() {
      this.Session.set('authorize', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMDAyLCJpYXQiOjE1MzQxNzE2NzF9.rQMxGA4f4ttUxTgB5BzeXRa7SNy3D9u8cqV8T8xmHUs');
      this.Session.del('access-token');
      this.Runtime.App.restart();
    }
  }
};
</script>
