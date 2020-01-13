<style scoped rel="stylesheet/scss" lang="scss">
</style>

<template>
  <div v-title :data-title="title">
    <view-header :title="title" left-arrow />
    <view-content>
      <biscuit-item>
        <template slot="left">
          当前角标数量：{{badge}}
        </template>
      </biscuit-item>
      <helper-margin-block height="16px" />
      <biscuit-item action="刷新角标" @tap="refreshBadge">
        <template slot="left">
          刷新角标
        </template>
      </biscuit-item>
      <helper-margin-block height="16px" />
      <biscuit-item action="设置（原生）" @tap="original">
        <template slot="left">
          设置（原生）
        </template>
      </biscuit-item>
      <helper-margin-block height="16px" />
      <biscuit-item action="设置（兼容）" @tap="fixed">
        <template slot="left">
          设置（兼容）
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
      title: '角标',
      badge: 0
    };
  },
  mounted() {
    this.refreshBadge();
  },
  methods: {
    onPageShow() {
      this.badge = this.Runtime.App.getBadgeNumber();
    },
    refreshBadge() {
      this.badge = this.Runtime.App.getBadgeNumber();
    },
    original() {
      this.Runtime.engine.runtime.setBadgeNumber(99);
      this.refreshBadge();
    },
    fixed() {
      this.Runtime.App.setBadgeNumber(99);
      this.refreshBadge();
    }
  }
};
</script>
