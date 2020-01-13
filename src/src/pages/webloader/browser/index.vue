<template>
  <div v-title :data-title="title">
    <view-header :title="title" left-arrow noShadow ref="header" />
    <!-- <view-loading-web /> -->
  </div>
</template>

<script>
export default {
  name: 'webloader-browser-index',
  data() {
    return {
      title: '载入中...',
      frame: null,
      redirect: null,
      url: ''
    };
  },
  mounted() {
    const url = this.Page.Param.url || '';
    const isSafe = url.indexOf('.ewsedu.com') > -1;
    const receiveTransmission = e => {
      const detail = e.detail;
      const action = detail.action || '';
      const path = detail.path || '';
      if (action == 'redirect') {
        if (path.indexOf('://') > -1) {
          if (detail.outBrowser) {
            this.redirect = this.Runtime.Webview.create(detail.path);
            this.redirect.show();
            this.readyToClose();
          } else {
            this.createWebview(path);
          }
        } else {
          if (detail.invoke) {
            this.redirect = this.Page.invoke(detail.path, detail.params);
          } else {
            this.redirect = this.Page.open(detail.path, detail.params);
          }
          this.readyToClose();
        }
      }
    };
    if (isSafe) {
      window.addEventListener('ewsedu-transmission', receiveTransmission, false);
    }
  },
  methods: {
    readyToClose() {
      this.redirect.onloaded = () => {
        this.close();
      };
      this.redirect.onclose = () => {
        this.close();
      };
      setTimeout(() => {
        this.close();
      }, 1000);
    },
    close() {
      if (this.Page.current) {
        setTimeout(() => {
          this.Page.current.close('none');
        }, 300);
      }
    },
    onPageShow() {
      if (this.frame) {
        this.frame.close();
      }

      this.createWebview();
    },
    createWebview(url = '') {
      url = url || this.Page.Param.url || '';
      const current = this.Page.current;
      const plus = this.Runtime.engine;
      const isSafe = url.indexOf('.ewsedu.com') > -1;
      // 根据 Runtime 环境创建 Webview
      if (plus.barcode) { // html5plus 环境
        this.frame = this.Webview.create(url, null, {
          top: this.getPaddingTop(),
          bottom: '0',
          plusrequire: isSafe ? 'ahead' : 'none'
          // cachemode: 'noCache'
        });
      } else { // Vue 环境
        this.frame = this.Webview.create(url, null, {
          top: this.getPaddingTop(),
          bottom: '0',
          height: 'calc(100% - ' + this.getPaddingTop() + 'px)',
          cachemode: 'noCache'
        }, {
        });
      }

      // this.frame.hide();
      // this.frame.addEventListener('loaded', () => {
      //   try {
      //     if (!this.frame.plusLoaded) {
      //       if (isSafe) {
      //         this.frame.appendJsFile('_www/js/build/vendor.bundle.js');
      //         this.frame.appendJsFile('_www/js/build/bridge.js');
      //       }
      //     // this.frame.show('fade-in');
      //     }
      //     this.frame.plusLoaded = true;
      //   } catch (e) {
      //     console.log(e);
      //   }
      // });
      this.frame.addEventListener('titleUpdate', () => {
        const title = this.frame.getTitle();
        this.title = title;
      });
      current.append(this.frame);
    },
    getPaddingTop() {
      // view-header 组件已经包含沉浸式高度
      return this.$refs.header.$el.offsetHeight;
    }
  }
};
</script>
