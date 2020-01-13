<style scoped rel="stylesheet/scss" lang="scss">

  .biscuit-container {
    position: relative;
    width: 100%;
    text-align: left;
    background-color: #fff;
    height: 50px;
    line-height: 50px;

    &:not(.disable):active {
      background-color: rgba(0,0,0,.05);
    }

    .biscuit-container-inner {
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      align-items: center;
      width: 100%;

      .biscuit-item {
        display: flex;
        align-items: center;
        font-size: 0.875rem;
      }

      .biscuit-item-left {
        /deep/ i {
          margin-right: 12px !important;
          font-size: 1.2rem !important;
        }
      }

      .biscuit-item-right {
        color: #9b9b9b;
      }
    }
  }
</style>

<template>
  <v-touch
    class="biscuit-container"
    :class="classNames"
    :style="styles"
    @tap="clickItemTrigger(path, param)"
  >
    <div class="biscuit-container-inner">
      <div class="biscuit-item biscuit-item-left">
        <slot name="left"></slot>
      </div>
      <div class="biscuit-item biscuit-item-right">
        <slot name="right"></slot>
        <Icon v-if="rightArrow" name="arrow-right" color="#9b9b9b" size="14px" />
      </div>
    </div>
  </v-touch>
</template>

<script>
export default {
  name: 'biscuit-item',
  props: {
    height: {
      default: '50px'
    },
    paddingLeft: {
      default: '18px'
    },
    paddingRight: {
      default: '18px'
    },
    divider: {
      type: Boolean,
      default: true
    },
    path: {
      default: ''
    },
    rightArrow: Boolean,
    param: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {};
  },
  computed: {
    classNames() {
      return [
        {
          disable: this.validatePath,
          'theme-divider': this.divider,
          'theme-divider-bottom': this.divider
        }
      ];
    },
    styles() {
      return {
        'padding-left': this.paddingLeft,
        'padding-right': this.paddingRight,
        'height': this.height,
        'line-height': this.height
      };
    },
    validatePath() {
      if (this.path === '') {
        return true;
      }
      return false;
    }
  },
  methods: {
    clickItemTrigger(path, param = {}) {
      this.$emit('click');
      this.$emit('tap');
      if (path !== '') {
        this.Page.open(path, param);
      }
    }
  }
};
</script>
