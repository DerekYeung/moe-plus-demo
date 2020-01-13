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
      <helper-margin-block height="16px" />
      <biscuit-item action="打开更新页" @tap="getLocation">
        <template slot="left">
          获取当前地址
        </template>
      </biscuit-item>
      <helper-margin-block height="16px" />
      <div class="pre">
        {{location}}
      </div>
      <biscuit-item action="监听位置变化" @tap="watchingPosition">
        <template slot="left">
          监听位置变化
        </template>
      </biscuit-item>
      <helper-margin-block height="16px" />
      <biscuit-item action="停止监听" @tap="stopWatching">
        <template slot="left">
          停止监听
        </template>
      </biscuit-item>
      <helper-margin-block height="16px" />
      <div class="pre">
        监听状态：{{watching ? '是' : '否'}}<br />
        位置：{{watching_position}}
      </div>
      <helper-margin-block height="16px" />
      <biscuit-item action="创建" @tap="createMap">
        <template slot="left">
          创建地图
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
      title: '地图',
      location: '',
      watching_position: '',
      watching: null,
      map: null
    };
  },
  methods: {
    getLocation() {
      const engine = this.Runtime.engine;
      engine.geolocation.getCurrentPosition(p => {
        this.location = JSON.stringify(p);
      }, e => {
        this.location = JSON.stringify(e.message);
      }, {
        enableHighAccuracy: true,
        geocode: true,
        provider: 'baidu'
      });
    },
    createMap() {
      this.map = this.Runtime.engine.maps.create('map', {
        top: '100px',
        left: '0px',
        width: '100%',
        height: '200px',
        position: 'static'
      });
      this.Page.current.append(this.map);
    },
    watchingPosition() {
      this.watching = this.Runtime.engine.geolocation.watchPosition(p => {
        this.watching_position = JSON.stringify(p);
      }, e => {
        this.watching_position = JSON.stringify(e.message);
      }, {
        enableHighAccuracy: true,
        maximumAge: 1000,
        geocode: true,
        provider: 'baidu'
      });
    },
    stopWatching() {
      this.Runtime.engine.geolocation.clearWatch(this.watching);
      this.watching = null;
      this.watching_position = '';
    }
  }
};
</script>
