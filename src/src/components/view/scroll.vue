<style scoped rel="stylesheet/scss" lang="scss">
  .ui-scroll-view {
    position: relative;
    -webkit-overflow-scrolling: touch;
    overflow: hidden;
  }

  .ui-scroll-view.fullscreen {
    position: absolute;
    width: 100%;
    height: 100%;
  }
</style>

<template>
  <section class="ui-scroll-view" :class="fullscreen ? 'fullscreen' : ''" :style="style">
    <slot></slot>
  </section>
</template>

<script>
import scrollUtils from 'vant/lib/utils/scroll';
import Touch from 'vant/lib/mixins/touch';

export default {
  name: 'view-scroll',
  mixins: [ Touch ],
  props: {
    disabled: Boolean,
    pullingText: String,
    loosingText: String,
    loadingText: String,
    animationDuration: {
      type: Number,
      default: 300
    },
    headHeight: {
      type: Number,
      default: 50
    },
    fullscreen: {
      default: false
    },
    paddingTop: null,
    paddingBottom: null
  },
  data() {
    return {
      status: 'normal',
      height: 0,
      translateY: 0,
      duration: 0
    };
  },
  computed: {
    style: function style() {
      const top = 'padding-top';
      const bottom = 'padding-bottom';
      return {
        transform: 'translate3d(0,' + this.translateY + 'px, 0) translateZ(0px)',
        'transition-duration': this.duration + 'ms',
        'transition-timing-function': 'cubic-bezier(0.165, 0.84, 0.44, 1)',
        'min-height': this.fullscreen ? this.height + 'px' : 'auto',
        [top]: this.top + 'px',
        [bottom]: this.bottom + 'px'
      };
    },
    untouchable: function untouchable() {
      return this.disabled;
    }
  },
  watch: {
    value: function value(val) {
      this.duration = this.animationDuration;
      // this.getStatus(val ? this.headHeight : 0, val);
    }
  },
  mounted: function mounted() {
    this.scrollEl = scrollUtils.getScrollEventTarget(this.$el);
    this.$el.addEventListener('touchstart', (event) => {
      this.onTouchStart(event);
    });
    this.$el.addEventListener('touchmove', (event) => {
      this.onTouchMove(event);
    });
    this.$el.addEventListener('touchend', (event) => {
      this.onTouchEnd(event);
    });
    this.$el.addEventListener('touchcancel', (event) => {
      this.onTouchEnd(event);
    });
    const height = this.getFullscreenlHiehgt();
    this.height = height;
    const paddingTop = this.paddingTop || [ 0 ];
    const extendTop = paddingTop.reduce((partial, value) => {
      return partial + value;
    }) || 0;
    const top = parseInt(this.top) + parseInt(this.$store.getters.getImmersedHeight);
    if (parseInt(top) > 44) {
      this.top = top;
    }
    this.top += extendTop;
    const paddingBottom = this.paddingBottom || [ 0 ];
    const extendBottom = paddingBottom.reduce((partial, value) => {
      return partial + value;
    }) || 0;
    this.bottom = extendBottom;
  },
  methods: {
    onTouchStart: function onTouchStart(event) {
      if (this.untouchable) {
        return;
      }
      if (this.onEnd()) {
        this.duration = 0;
        this.touchStart(event);
      }
    },
    onTouchMove: function onTouchMove(event) {
      if (this.untouchable) {
        return;
      }
      this.touchMove(event);
      if (!this.ceiling && this.onEnd()) {
        this.duration = 0;
        this.startY = event.touches[0].clientY;
        this.deltaY = 0;
      }
      if (this.ceiling && this.deltaY <= 0) {
        if (this.direction === 'vertical') {
          const abs = Math.abs(this.deltaY);
          const ease = this.ease(abs);
          this.translateY = -ease;
          if (abs >= 50) {
            this.$emit('onBottom');
          }
          event.preventDefault();
        }
      }
    },
    onTouchEnd: function onTouchEnd() {
      this.$emit('onEnd');
      if (this.untouchable) {
        return;
      }
      this.duration = this.animationDuration;
      this.translateY = 0;
    },
    onEnd() {
      const scrollHeight = this.$el.scrollHeight;
      const top = scrollUtils.getScrollTop(this.scrollEl);
      const vheight = scrollUtils.getVisibleHeight(this.scrollEl);
      let paddingTop = 0;
      if (this.$el) {
        let parent = this.$el.parentNode;
        const isPull = parent.classList.contains('van-pull-refresh__track');
        if (isPull) {
          parent = parent.parentNode;
        }
        if (parent.style.paddingTop) {
          paddingTop = parseInt(parent.style.paddingTop);
        }
      }
      const now = top + vheight - paddingTop;
      this.ceiling = now >= scrollHeight;
      return this.ceiling;
    },
    ease(move) {
      const height = Math.abs(move);
      const headHeight = this.headHeight;
      const ease = height < headHeight ? height : height < headHeight * 2 ? Math.round(headHeight + (height - headHeight) / 2) : Math.round(headHeight * 1.5 + (height - headHeight * 2) / 4);
      return move < 0 ? -ease : ease;
    },
    getFullscreenlHiehgt() {
      let height = scrollUtils.getVisibleHeight(window);
      if (this.$el) {
        let parent = this.$el.parentNode;
        const isPull = parent.classList.contains('van-pull-refresh__track');
        if (isPull) {
          parent = parent.parentNode;
        }
        if (parent.style.paddingTop) {
          height -= parseInt(parent.style.paddingTop);
        }
      }
      return height;
    }
  }
};
</script>
