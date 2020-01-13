<style scoped rel="stylesheet/scss" lang="scss">

  @import "../assets/css/global.scss";

  .button-control {
    display: flex;
    justify-content: center;
    vertical-align: middle;

    .button {
      display: block;
      font-size: 1rem;
      line-height: 36px;
      text-align: center;
      box-shadow: 0 1px 2px rgba(0,0,0,.3);
      transition: all 0.3s ease;

      &.default {
        margin-top: 10px;
        margin-bottom: 10px;
        width: 94%;
        height: 36px;
        border-radius: 6px;
        color: #fff;
        background-color: $primary-color;
      }

      &.fill {
        width: 100%;
        height: 50px;
        line-height: 50px;
        border-radius: 0;
        color: #fff;
        background-color: $primary-color;
      }

      &.active {
        opacity: 0.75;
      }
      &.disabled{
        opacity: 0.5;
      }
    }
  }
</style>

<template>
  <div class="button-control">
    <v-touch tag="a" :class="classNames" :style="styles" @tap="clickButton(path)">
      <slot></slot>
    </v-touch>
  </div>
</template>

<script>
export default {
  name: 'btn',
  props: {
    type: {
      type: String,
      default: 'default' // default/fill
    },

    /* custom style */
    hMargin: String,
    width: String,
    height: String,
    color: String,
    bgColor: String,
    radius: String,
    fontSize: {},

    double: {
      default: undefined
    },
    magic: Boolean,
    disabled: Boolean,
    path: {
      default: ''
    },
    captcha: {
      default: false
    },
    captchaAppId: {
      default: '2010762194'
    }
  },
  data() {
    return {
      awaiting: false,
      active: false
    };
  },
  computed: {
    w() {
      const width = this.width;
      return width;
    },
    classNames() {
      const config = [
        'button',
        this.type
      ];

      if (this.magic) {
        config.push('theme-background-gradient');
      }

      if (this.disabled) {
        config.push('disabled');
      }

      if (this.active) {
        config.push('active');
      }

      return config;
    },
    styles() {
      const config = ['bgColor', 'width', 'color', 'height', 'hMargin', 'radius'];
      let style = {};
      config.forEach(element => {
        if (!this[element]) {
          return false;
        }

        switch (element) {
          case 'hMargin':
            Object.assign(style, {'margin-top': this.hMargin, 'margin-bottom': this.hMargin});
            break;
          case 'width':
            Object.assign(style, {width: this.w});
            break;
          case 'height':
            Object.assign(style, {height: this.height, 'line-height': this.height});
            break;
          case 'color':
            Object.assign(style, {color: this.color});
            break;
          case 'bgColor':
            Object.assign(style, {background: this.bgColor});
            break;
          case 'radius':
            Object.assign(style, {'border-radius': this.radius});
        }
      });

      return style;
    },
    doubleClick() {
      return this.double !== undefined;
    }
  },
  methods: {
    clickButton(path) {
      if (this.awaiting || this.disabled) {
        return false;
      }
      this.active = true;
      setTimeout(() => {
        this.active = false;
      }, 300);

      this.$emit('click');

      if (path) {
        this.Page.open(path);
      }
      if (!this.doubleClick) {
        this.awaiting = true;
        setTimeout(() => {
          this.awaiting = false;
        }, 300);
      }
    },
    checkCaptcha() {
      this.$emit('click');
      let captcha1 = new window.TencentCaptcha(this.captchaAppId, res => {
        console.log(res);
        // res（未通过验证）= {ret: 1, ticket: null}
        // res（验证成功） = {ret: 0, ticket: "String", randstr: "String"}
        if (res.ret === 0) {
          console.log(res.ticket); // 票据
        }
      });
      captcha1.show();
    }
  }
};
</script>
