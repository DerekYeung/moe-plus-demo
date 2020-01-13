<style scoped rel="stylesheet/scss" lang="scss">
</style>

<template>
  <div v-title :data-title="title">
    <view-header :title="title" left-arrow />
    <view-content>
      <biscuit-item action="截图" @tap="getSocket">
        <template slot="left">
          获取socket-info
        </template>
      </biscuit-item>
      {{socket}}
    </view-content>
  </div>
</template>

<script>
export default {
  name: 'profile-form-connect',
  data() {
    return {
      title: 'Socket',
      socket: {},
      url: '',
      img: ''
    };
  },
  methods: {
    getSocket() {
      const IO = this.Runtime.IO;
      IO.emit('login', {
        accessToken: this.Runtime.Passport.token
      }).then(response => {
        this.socket = JSON.stringify(response);
        console.log(this.socket);
      });
      IO.getSocketIo().then(io => {
        console.log(io.id);
        console.log(JSON.stringify(io));
      });
    }
  }
};
</script>
