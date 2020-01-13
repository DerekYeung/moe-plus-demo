<style scoped rel="stylesheet/scss" lang="scss">
  header {
    position: fixed;
    width: 100%;
    height: 44px;
    line-height: 44px;
    color: #fff;
    z-index: 1999;
    box-shadow: 0 0 10px rgba(0, 0, 0, .15);

    .container {
      position: relative;

      .header-title {
        font-size: 1.1rem;
        font-weight: 500;
        line-height: 44px;
        position: absolute;
        margin: 0 -10px;
        padding: 0;
        text-align: center;
        white-space: nowrap;
        color: white;
        right: 40px;
        left: 40px;
        display: inline-block;
        overflow: hidden;
        width: auto;
        margin: 0;
        text-overflow: ellipsis;
        z-index: 199;
      }

      .left, .right {
        text-align: center;
        z-index: 200;

        span {
          display: inline-block;
        }
        .button {
          padding: 0 16px;
        }
      }

      .left {
        position: absolute;
        left: 0;
        top: 0;
      }

      .right {
        padding: 0 16px;
        float: right;
        font-size: .9rem;
        position: inherit;
        z-index: 1000;
      }
    }

    &.no-shadow {
      box-shadow: none;
    }
    .no-padding-left {
      padding-left: 0px !important;
    }
  }
</style>

<template>
  <header class="header-container" :class="classNames" :style="styles">
    <div class="container">
      <div class="left" v-if="leftArrow || leftText" :style="centerHeight">
        <v-touch @tap="clickLeftBtn" tag="span">
          <Icon class="button" v-if="leftArrow" name="arrow-left" size="1.1rem" />
          <span class="button" v-if="leftText">{{ leftText }}</span>
        </v-touch>
        <v-touch @tap="closeBack" tag="span">
          <Icon class="button no-padding-left" v-if="hasFrame" name="close" size="1.1rem" />
        </v-touch>
      </div>
      <section class="header-title" :style="centerHeight">{{ title }}</section>
      <v-touch class="right" v-if="hasRight" :style="centerHeight" @tap="clickActionBtn">
        <slot name="right">
          <span v-if="rightText" v-text="rightText" />
        </slot>
      </v-touch>
      <vue-progress-bar></vue-progress-bar>
    </div>
  </header>
</template>

<script>

export default {
  name: 'view-header',
  props: {
    title: String,
    leftArrow: Boolean,
    leftText: String,
    rightText: String,
    noShadow: Boolean,
    height: {
      default: 44
    },
    editType: Boolean,
    frame: {
      default: undefined
    }
  },
  data() {
    return {
      calculateHeight: '44px'
    };
  },
  computed: {
    hasFrame() {
      return this.frame;
    },
    hasRight() {
      return true;
    },
    classNames() {
      return [
        'theme-background-gradient',
        {'no-shadow': this.noShadow}
      ];
    },
    styles() {
      const paddingTop = this.$store.getters.getImmersedHeight;
      return {
        height: this.calculateHeight,
        'padding-top': paddingTop + 'px'
      };
    },
    // 处理导航栏文字和图标垂直居中
    centerHeight() {
      const paddingTop = this.$store.getters.getImmersedHeight;
      return {
        'height': parseInt(this.calculateHeight) - paddingTop + 'px',
        'line-height': parseInt(this.calculateHeight) - paddingTop + 'px'
      };
    }
  },
  created() {
    //  height = 状态栏 + 标题栏
    const height = parseInt(this.height + this.$store.getters.getImmersedHeight) + 'px';
    if (parseInt(height) > 44) {
      this.calculateHeight = height;
    }
  },
  methods: {
    startProgress() {
      this.$Progress.start();
    },
    stopProgress() {
      this.$Progress.finish();
    },
    closeBack() {
      this.$emit('on-left-tap');
      this.$emit('on-back');
      this.back();
    },
    clickLeftBtn() {
      if (!this.leftArrow) {
        return false;
      }
      if (this.editType) {
        return this.$emit('on-exit');
      }
      if (this.frame) {
        this.frame.canBack(e => {
          if (e.canBack) {
            this.frame.back();
          } else {
            this.closeBack();
          }
        });
        return false;
      }
      this.closeBack();
    },
    back() {
      const isInvoke = this.Page.current.isInvoke;
      this.Page.back(isInvoke);
    },
    editTypeExit(fullClose = false) {
      if (fullClose) {
        return this.Page.back(true);
      }

      this.Page.back(false);
    },
    clickActionBtn() {
      this.$emit('on-right-tap');
      this.$emit('on-post');
    }
  }
};
</script>
