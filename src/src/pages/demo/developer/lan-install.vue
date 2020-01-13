<style scoped rel="stylesheet/scss" lang="scss">

  .about-container {
    margin-top: 100px;
    text-align: center;

    .about-title {
      font-size: 1rem;
      letter-spacing: 1px;
      color: #666;
    }

    .about-img {
      display: inline-block;
      margin-top: 20px;

      img {
        width: 86px;
        height: 86px;
        box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.1);
      }
    }
  }

  .us-app-name {
    font-size: 24px;
    margin-top: 16px;
    margin-bottom: 16px;
    letter-spacing: 4px;
    font-weight: 400;
  }

  .copyright {
    position: absolute;
    bottom: 80px;
    text-align: center;
    width: 100%;
    font-size: 12px;
    color: #4A4A4A;
  }

  .us-app-version {
    font-size: .9rem;
    color: #b9b5b5;
  }
</style>

<template>
  <div v-title data-title="远程调试">
    <view-header title="远程调试" left-arrow />
    <view-content>
      <div class="about-container">
        <div class="about-img">
          <Pic src="logo.png" />
        </div>
        <p class="us-app-name">远程调试 {{project.name}}</p>

        <!-- <biscuit-item>
          <template slot="left">版本</template>
          <template slot="right">{{pkg.version}}</template>
        </biscuit-item>
        <biscuit-item>
          <template slot="left">Build</template>
          <template slot="right">{{pkg.build}}</template>
        </biscuit-item>
        <biscuit-item>
          <template slot="left">UUID</template>
          <template slot="right">{{pkg.uuid}}</template>
        </biscuit-item>
        <biscuit-item v-if="pkg.mode">
          <template slot="left">模式</template>
          <template slot="right">{{pkg.mode == 'beta' ? '测试版' : '发行版'}}</template>
        </biscuit-item> -->

        <van-progress v-if="loading" :percentage="percentage" />

        <div class="install-action">
          <Btn magic :disabled="loading" @click="install">确认</Btn>
        </div>

        <v-touch tag="div" class="copyright app-version">
          <div class="us-app-version">当前版本：<span class="version">{{version}} build {{build}}</span></div>
        </v-touch>
      </div>
    </view-content>
  </div>
</template>

<script>
export default {
  name: 'user-page-about',
  data() {
    return {
      clickCount: 0,
      percentage: 0,
      devCode: '',
      showDevCodePanel: false,
      version: '',
      build: '',
      uuid: '',
      loading: false,
      pkg: {},
      project: {}
    };
  },
  methods: {
    onPageShow() {
      this.version = this.Runtime.Client.version;
      this.build = this.Runtime.Build;
      this.project = this.Page.Param.project || {};
    },
    install() {
      this.loading = true;
      this.tip = 'downloading';
      const host = `http://${this.Page.Param.host}:${this.Page.Param.port}`;
      this.Runtime.Http.post(host + '/archive-package', {
        project: this.project
      }).on('success', json => {
        const data = {
          data: {
            url: host + json.data.file,
            force: true,
            returnInfo: true
          }
        };
        const downloader = this.Runtime.Downloader;
        const task = downloader.app(data.data.url).on('success', res => {
          this.Runtime.Updater.install(res.filename, data).then(status => {
            this.Runtime.App.restart();
          });
        }).on('error', () => {
          this.tip = 'error';
        });
        task.on('percent', percent => {
          this.percentage = parseFloat(percent);
        });
        task.start();
      }).on('complete', () => {
        this.percentage = 0;
      });
    }
  }
};
</script>
