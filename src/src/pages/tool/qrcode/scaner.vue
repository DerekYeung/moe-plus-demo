<style scoped rel="stylesheet/scss" lang="scss">
#scanner {
  width: 100%;
  position: absolute;
  left: 0px;
  top: 0;
  height: 100%;
  text-align: center;
}
.ui-app-view, body{
  background: black;
}
.tip{
  padding-top: 30%;
}
</style>

<template>
  <div v-title :data-title="title">
    <div id="scanner">
      <section v-if="loading">
        <p class="tip">{{tip}}</p>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: 'setting-index',
  data() {
    return {
      title: '',
      loading: true,
      tip: '...载入中...',
      timer: null
    };
  },
  methods: {
  },
  mounted() {
    window.opener = null;
    window.done = false;
    const plus = this.Runtime.engine;
    if (!plus.barcode) {
      this.tip = '本功能需在客户端内使用';
      return false;
    }
    this.loading = false;
    this.timer = setInterval(() => {
      const webview = this.Page.current;
      window.opener = webview.opener();
      let scanner = null;
      scanner = new plus.barcode.Barcode('scanner');
      scanner.onmarked = (type, result, file) => {
        if (window.done) {
          return false;
        }
        window.done = true;
        switch (type) {
          case plus.barcode.QR:
            type = 'QR';
            break;
          case plus.barcode.EAN13:
            type = 'EAN13';
            break;
          case plus.barcode.EAN8:
            type = 'EAN8';
            break;
          default:
            type = '其它' + type;
            break;
        }
        result = result.replace(/\n/g, '');
        this.Page.trigger(window.opener, 'scaned', {
          type: type,
          result: result,
          file: file
        });
      };
      scanner.start({
        conserve: true,
        filename: '_doc/barcode/'
      });
      clearInterval(this.timer);
    }, 100);
  },
  destroyed() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
};
</script>
