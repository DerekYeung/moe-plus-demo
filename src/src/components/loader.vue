<style>
    #app {
      width: 100%;
      height: 100%;
      overflow: hidden;
    }

  .container {
      width: 100%;
      height: 100%;
      overflow: hidden;
  }

  /* 上面是为了保证滑动的时候不出现抖动情况 */
  .ui-app-view {
      position: absolute;
      left:0;
      top: 0;
      height: 100%;
      width: 100%;
      background-color: #f0f3f5;
      transition: all .5s cubic-bezier(.55,0,.1,1);
      -webkit-overflow-scrolling: touch;
  }

  /* 全局默哀灰色滤镜 如 4.1 木里森林山火 */
  .memorial {
    filter: progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);
    -webkit-filter: grayscale(100%);
  }

  /* 当child-view的内容过多时会撑开child-view使得内部能够滚动 */
  .slide-left-enter, .slide-right-leave-active {
      opacity: 0;
      -webkit-transform: translate(750/32rem, 0);
      transform: translate(750/32rem, 0);
      transition-delay: .5s;
      -webkit-transition-delay: .5s;
  }

  .slide-left-leave-active, .slide-right-enter {
      opacity: 0;
      -webkit-transform: translate(-750/16rem, 0);
      transform: translate(-750/16rem, 0);
      transition-delay: .5s;
      -webkit-transition-delay: .5s;
  }

  .slide-enter-active {
      -webkit-transition: all .3s ease;
      transition: all .3s ease;
  }

  .slide-leave-active {
      -webkit-transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
      transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  /* 然后写上切换时候的类名的CSS变化(这里最好看一下VUE的transition文档) */
</style>

<template>
  <transition :name="transitionName">
    <router-view @hook:mounted="listenToChild" :class="['ui-app-view', low ? 'app-low-os' : '', retina ? 'app-retina-os' : '']" ref="subview" />
  </transition>
</template>

<script>
export default {
  data() {
    return {
      transitionName: 'slide-left',
      subview: null,
      low: false,
      retina: false
    };
  },
  beforeRouteUpdate(to, from, next) {
    const isBacking = this.$router.app.isBacking;
    this.transitionName = isBacking ? 'slide-right' : 'slide-left';
    next();
  },
  watch: {
    '$route'(to, from) {
      if (this.Page.clearWebview) {
        this.Page.clearWebview();
      }
      setTimeout(() => {
        this.subview = to.matched[1].instances.default;
        // this.triggerDefault();
      }, 10);
    }
  },
  mounted() {
    this.low = typeof (Proxy) == 'undefined';

    // Retina 1px 屏幕优化
    this.retina = this.getDevicePixelRatio();

    this.subview = this.$refs.subview;
    window.addEventListener('message', message => {
      const detail = message.data || null;
      if (detail instanceof Object && detail.event) {
        this.emit(detail.event, detail.data);
      }
    }, false);
    window.addEventListener('plus-webview-trigger', listener => {
      const detail = listener.detail;
      this.emit(detail.event, detail.data);
    });
    window.dispatchEvent(new CustomEvent('plus-loader-loaded', {
      detail: 'ok',
      bubbles: true,
      cancelable: true
    }));
  },
  methods: {
    listenToChild(e) {
      const subview = this.$refs.subview;
      if (subview.onPageShow) {
        subview.onPageShow();
      }
      if (subview.onPageShowSuccess) {
        subview.onPageShowSuccess();
      }
      subview.$off('page-show');
      subview.$off('page-open');
      subview.$off('page-back');
      subview.$off('child-back');
      subview.$on('page-show', data => {
        if (subview.onPageShow) {
          subview.onPageShow();
        }
      });

      subview.$on('page-open', data => {
        if (subview.onPageOpen) {
          subview.onPageOpen(data);
        }
      });

      subview.$on('page-back', data => {
        if (subview.onPageBack) {
          subview.onPageBack(data);
        }
      });
      subview.$on('child-back', data => {
        if (subview.onChildBack) {
          subview.onChildBack(data);
        }
      });
    },
    emit(event, data) {
      this.subview && this.subview.$emit(event, data);
    },
    getSubview() {
      if (this.subview) {
        return Promise.resolve(this.subview);
      }
      return new Promise(resolve => {
        const timer = setInterval(() => {
          if (this.subview) {
            clearInterval(timer);
            resolve(this.subview);
          }
        }, 10);
      });
    },
    registerEvent() {
      return this.getSubview().then(subview => {
        subview.$off('page-show');
        subview.$off('page-open');
        subview.$off('page-show-success');

        subview.$off('page-back');
        subview.$off('child-back');

        subview.$on('page-show', data => {
          console.log(subview);
          if (subview.onPageShow) {
            subview.onPageShow.apply(subview);
            // subview.onPageShow(data);
          }
        });
        subview.$on('page-show-success', data => {
          if (subview.onPageShowSuccess) {
            subview.onPageShowSuccess(data);
          }
        });
        subview.$on('page-open', data => {
          if (subview.onPageOpen) {
            subview.onPageOpen(data);
          }
        });

        subview.$on('page-back', data => {
          if (subview.onPageBack) {
            subview.onPageBack(data);
          }
        });
        subview.$on('child-back', data => {
          if (subview.onChildBack) {
            subview.onChildBack(data);
          }
        });
        return subview;
      });
    },
    triggerDefault() {
      this.registerEvent().then(() => {
        this.emit('page-open');
        this.emit('page-show');
        this.emit('page-show-success');
      });
    },
    getDevicePixelRatio() {
      if (window.devicePixelRatio >= 2) {
        return true;
      }

      return false;
    }
  }
};
</script>
