<style scoped rel="stylesheet/scss" lang="scss">
.van-pull-refresh {
  position: absolute;
  top: 0;
  padding-top: 44px;
  left: 0;
  width: 100%;
  height: 100%;
  -webkit-overflow-scrolling : touch;
  overflow-y: auto;
}

.van-pull-refresh__track {
  height: 100%;
  -webkit-overflow-scrolling : touch;
  overflow-y: auto;
}
</style>

<template>
  <van-pull-refresh v-model="pullIsLoading" @refresh="onRefresh" :style="style" :disabled="disabled">
    <slot></slot>
  </van-pull-refresh>
</template>

<script>
export default {
  name: 'view-pull-refresh',
  computed: {
    style() {
      const top = 'padding-top';
      const bottom = 'padding-bottom';
      const index = 'z-index';

      return {
        [top]: this.top + 'px',
        [bottom]: this.bottom + 'px',
        [index]: this.fullscreen ? '1999' : ''
      };
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    headHeight: {
      type: Number,
      default: 44
    },
    disabled: false,
    fullscreen: false,
    paddingTop: null,
    paddingBottom: null
  },
  data() {
    return {
      top: 0,
      bottom: 0,
      pullIsLoading: false,
      pullOnRefresh: () => {
      }
    };
  },
  watch: {
    value(val) {
      this.pullIsLoading = val;
    },
    pullIsLoading(val) {
      this.$emit('input', val);
    }
  },
  created() {
    this.top = this.headHeight;
    this.pullIsLoading = this.value;
    this.pullOnRefresh = this.refresh;
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
    onRefresh() {
      this.$emit('refresh');
    }
  }
};
</script>
