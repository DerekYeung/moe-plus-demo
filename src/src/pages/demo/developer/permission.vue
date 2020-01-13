<style scoped rel="stylesheet/scss" lang="scss">
.pre {
  width: 100%;
  height: auto;
  word-break: break-all;
  overflow: scroll;
  padding: 16px;
  padding-top: 0px;
}
</style>

<template>
  <div v-title :data-title="title">
    <view-header :title="title" left-arrow />
    <view-content>
      <biscuit-item action="截图" @tap="getPermissions">
        <template slot="left">
          读取权限信息
        </template>
      </biscuit-item>
      <div class="pre">
        <p v-for="(item, index) in permission" :key="index">{{item}}</p>
      </div>
    </view-content>
  </div>
</template>

<script>
export default {
  name: 'profile-form-connect',
  data() {
    return {
      title: '权限',
      Manifest: {},
      permission: {},
      img: ''
    };
  },
  methods: {
    getPermissions() {
      const Permission = this.Runtime.Permission;
      Permission.init();
      this.Manifest = Permission.Manifest || {};
      this.permission = this.Manifest.permission || {};
      console.log(JSON.stringify(this.permission));
      console.log(this.permission.READ_PHONE_STATE);
    }
  }
};
</script>
