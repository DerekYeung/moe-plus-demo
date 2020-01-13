<style scoped rel="stylesheet/scss" lang="scss">
</style>

<template>
  <div v-title :data-title="title">
    <view-header :title="title" left-arrow />
    <view-content>
      <biscuit-item>
        <template slot="left">
          数据库名称：<input v-model="databaseName" />
        </template>
      </biscuit-item>
      <helper-margin-block height="16px" />
      <biscuit-item action="打开数据库" @tap="openDatabase">
        <template slot="left">
          打开数据库
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
      title: '数据库',
      databaseName: 'test',
      db: null,
      badge: 0
    };
  },
  mounted() {
    this.refreshBadge();
  },
  methods: {
    openDatabase() {
      this.db = new this.Database(this.databaseName);
      this.db.openDatabase().then(() => {
        alert('open success');
      }).catch(e => {
        alert('open failed');
      });
    }
  }
};
</script>
