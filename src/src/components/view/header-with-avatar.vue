<style scoped rel="stylesheet/scss" lang="scss">
  .header-container {
    // position: fixed;
    position: relative;
    width: 100%;
    height: 240px;
    box-shadow: 0 0 10px rgba(0, 0, 0, .15);
    z-index: 100;

    .overlay {
      position: absolute;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 110;
      background-color: rgba(74,116,226,.52);
    }

    .header-container-inner {
      position: relative;
      display: flex;
      flex-direction: column;
      z-index: 120;
    }

    .top {
      position: fixed;
      display: flex;
      align-items: center;
      white-space: nowrap;
      padding: 0 10px;
      width: 100%;
      height: 44px;
      line-height: 1;

      .top-button {
        flex: .5;
        height: 44px;
        line-height: 44px;

        &.is-left {
          text-align: left;
        }

        &.is-right {
          text-align: right;
        }
      }

      h1 {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-weight: 400;
        flex: 1;
        font-size: 1rem;
        text-align: center;
        color: #fff;
      }
    }

    .main {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-top: 44px;
      height: 196px;
      width: 100%;

      .avatar {
        width: 86px;
        height: 86px;

        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }

      .avatar-desc {
        margin-top: 12px;
        font-size: 0.8rem;
        color: #fff;
      }
    }
  }
</style>

<template>
  <div class="header-container theme-background-gradient" :style="{'padding-top':paddingTop,'height':height}">
    <div class="overlay"></div>
    <div class="header-container-inner">
      <div id="header" class="top" :style="{'height': hei}">
        <div class="top-button is-left">
          <v-touch tag="span" @tap="clickLeftButtonTrigger">
            <Icon name="arrow-left" color="#fff" size="16px" />
          </v-touch>
        </div>
        <h1>{{ title }}</h1>
        <div class="top-button is-right">
          {{ action }}
        </div>
      </div>
      <div class="main">
        <div class="avatar">
          <Avatar />
        </div>
        <v-touch tag="div" class="avatar-desc" @tap="clickButtonTrigger(path)">{{ desc }}</v-touch>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'view-header-height-test',
  props: {
    title: {
      default: ''
    },
    avatarResUrl: {
      default: 'http://img5.imgtn.bdimg.com/it/u=3527916118,1559491205&fm=27&gp=0.jpg'
    },
    desc: {
      default: '*desc'
    },
    path: {
      default: '*path'
    },
    action: {}
  },
  data() {
    return {
      paddingTop: '0',
      height: '240px'
    };
  },
  mounted() {
    // this.height = Number(44 + this.$store.getters.getImmersedHeight) + 'px';
    this.paddingTop = this.$store.getters.getImmersedHeight + 'px';
    this.height = Number(240 + this.$store.getters.getImmersedHeight) + 'px';
    window.addEventListener('scroll', this.handleScroll);
  },
  methods: {
    clickLeftButtonTrigger: function() {
      this.Page.back();
    },
    clickRightBtn: function() {
      alert('Header right btn call');
    },
    clickButtonTrigger: function(path) {
      if (path !== '*path') {
        this.Page.open(path);
      }
    },
    handleScroll: function(e) {
      const headerElm = document.getElementById('header');
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      if (scrollTop >= 5) {
        headerElm.style.background = 'linear-gradient(90deg, #4e8cfe, #38b9fd)';
        headerElm.style.opacity = 0.004166667 * scrollTop;
      } else {
        headerElm.style.background = 'transparent';
        headerElm.style.opacity = 1;
      }
    }
  }
};
</script>
