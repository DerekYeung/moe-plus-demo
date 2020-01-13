<style lang="scss">
  @import "assets/css/global.scss";

  * {
    margin: 0;
    padding: 0;
    outline: none;
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    // -webkit-user-select: none;
    -webkit-tap-highlight-color: transparent;
    -webkit-overflow-scrolling : touch; // 允许独立的滚动和触摸回弹
  }
    ::-webkit-scrollbar {
      width: 0;
    }

    ::-webkit-scrollbar:horizontal {
      height: 0;
    }

    ::-webkit-scrollbar-track {
      background-color: #efefef;
    }

    ::-webkit-scrollbar-thumb {
      border-radius: 2px;
      opacity: .35;
      background-color: #4e8cfe;
    }

  html {

    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #333;
  }

  body {

    input{-webkit-appearance:none;}// iphone 圆角处理

    .hide {
      display: none !important;
    }
    .disabled {
      cursor: not-allowed;
      pointer-events: none;
      opacity: 0.35;
    }
    .fade-enter-active,
    .fade-leave-active {
      transition: opacity .5s ease;
    }
    .fade-enter,
    .fade-leave-active {
      opacity: 0
    }

    .child-view {
      position: absolute;
      transition: all .5s cubic-bezier(.55, 0, .1, 1);
    }

    .slide-left-enter,
    .slide-right-leave-active {
      opacity: 0;
      -webkit-transform: translate(30px, 0);
      transform: translate(30px, 0);
    }

    .slide-left-leave-active,
    .slide-right-enter {
      opacity: 0;
      -webkit-transform: translate(-30px, 0);
      transform: translate(-30px, 0);
    }

  }

  .ui-html-webview{
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    z-index: 99999;
    background: white;
    .ui-webview-frame{
      border: none;
      width: 100%;
      height: 100%;
    }
  }
  input,
  button {
    -webkit-appearance: none !important;
    border-radius: 0px;
  }
  .ui-lazy-loading{
    position: relative;
    width: 100%;
  }
  .ui-lazy-loading .ui-loading-mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transition: all 218ms ease;
    text-align: center;
    display: none;
  }
  .ui-lazy-loading.downloading .ui-loading-mask {
    display: block;
  }
  .ui-lazy-loading .ui-loading-mask .loading-percent {
    position: absolute;
    width: 0%;
    top: 5px;
    left: 0;
    color: white;
    z-index: 99;
    transition: width 218ms ease;
  }
  .ui-lazy-loading .ui-loading-mask .loading-bar {
    position: absolute;
    display: block;
    width: 0%;
    top: 0;
    left: 0;
    height: 100%;
    opacity: 0.8;
    background: #4e8cfe;
    color: #4e8cfe;
    transition: width 218ms ease;
  }

</style>

<template>
  <transition :name="transition" mode="out-in" keep-alive>
    <router-view class="ui-app-loader" ref="app" />
  </transition>
</template>

<script>
import main from '../app/main';
import './assets/iconfont/iconfont.css';

export default {
  name: 'App',
  data() {
    return {
      transition: 'fade'
    };
  },
  mounted() {
    const isPlus = this.Runtime.isHtml5PlusRuntime;
    let immersedHeight = 0;
    let ms = (/Html5Plus\/.+\s\(.*(Immersed\/(\d+\.?\d*).*)\)/gi).exec(navigator.userAgent);
    if (ms && ms.length >= 3) {
      immersedHeight = parseInt(ms[2]);
    }
    this.$store.dispatch('setImmersedHeight', immersedHeight);
    main(this.Runtime, this.$root);
    if (!isPlus) {
      this.Runtime.IO.init();
    }
  }
};
</script>
