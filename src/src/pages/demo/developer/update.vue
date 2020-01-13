<style scoped rel="stylesheet/scss" lang="scss">
.fake-input {
  width: 80%;
  border: none;
}
/deep/ .van-panel__content {
    padding: 20px;
}
/deep/ .van-panel {
  margin-bottom: 16px;
}
</style>

<template>
  <div v-title :data-title="title">
    <view-header :title="title" left-arrow />
    <view-content>
      <search-form :keyword.sync="keyword" placeholder="搜索..." :top="44" />
      <helper-margin-block height="60px" />
      <van-panel v-for="(item, index) in versions" :key="index">
        <div slot="header" class="van-cell van-panel__header">
          <div class="van-cell__title">
            <span>{{item.version}} build {{item.build}}</span>
            <div class="van-cell__label">
              <p>发布人：{{item.post}}</p>
              <p>系列：{{item.serial}}</p>
              <p>时间：{{item.date}}</p>
              <div class="detail"></div>
            </div>
          </div>
          <div class="van-cell__value">
            <van-tag type="success" v-if="item.master">主线版本</van-tag>
            <van-tag type="danger" v-if="item.mode == 'beta'">测试版</van-tag>
            <van-tag type="primary" v-else>发行版</van-tag>
          </div>
        </div>
        <div v-html="item.description || '暂无更新日志'"></div>
        <div slot="footer">
          <Btn @click="install(item)">安装该版本</Btn>
        </div>
      </van-panel>
    </view-content>
  </div>
</template>

<script>
export default {
  name: 'profile-form-connect',
  data() {
    return {
      title: 'OTA更新',
      url: 'http://oss.app.ewsedu.com/app-release.apk',
      keyword: '',
      versions: []
    };
  },
  methods: {
    onPageShow() {
      this.Api.get('/home/version/list', {
        keyword: this.keyword
      }).on('success', json => {
        this.versions = (json.data.versions || []).map(node => {
          node.date = this.Helper.datetime.date('Y-m-d H:i:s', node.create_time);
          node.showDetail = false;
          return node;
        });
      });
    },
    install(item) {
      this.Page.open('/user/developer/install', {
        uuid: item.uuid
      });
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
