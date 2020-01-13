<style scoped rel="stylesheet/scss" lang="scss">

.header-user {
  position: fixed;
  z-index: 99;
  display: flex;
  width: 100%;
  height: 100px;
  padding: 0 20px;
  justify-content: space-between;
  flex-flow: row nowrap;
  align-items: flex-end;
  padding-bottom: 15px;
  color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, .15);

  .header-user-item {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;

    .header-user-avatar {
      width: 64px;
      height: 64px;

      img {
        border: 1px solid #eee;
        border-radius: 64px;
        width: 100%;
        height: 100%;
        -webkit-box-shadow: 0 2px 10px rgba(165, 160, 160, 1);
        box-shadow: 0 2px 10px rgba(165, 160, 160, 0.25);
      }
    }

    .header-user-tool {
      width: 40px;
      height: 40px;
      text-align: center;
    }

    .header-user-text {
      text-align: left;
      margin-left: 10px;

      .header-user-name {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 1.2rem;
      }

      .header-user-description {
        padding-top: 2px;
        font-size: 0.8rem;
        max-width: 220px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
      }
    }
  }
}

/* Identity header and mask */

.identity-btn {
  position: absolute;
  right: 0;
  top: 0;
  padding: 0 16px;
}

.identity-title {
  height: 45px;
  line-height: 45px;
  font-size: .95rem;
  letter-spacing: 1px;
  padding-left: 16px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.15);
  color: #fff;
}

.identity-mask {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 998;
  background: black;
  opacity: 0.3;
  top: 0;
  left: 0;
}

/* Identity component */

/deep/ .identity {
  position: fixed;
  z-index: 999;
  bottom: 0;
  left: 0;
  width: 100%;

  .identity-content {
    // 如果是 弹出层则必须使用 max-height
    max-height: 300px;
  }
}
</style>

<template>
  <div>
    <div class="header-user theme-background-gradient" :style="{'height':height}" ref="ref">
      <v-touch class="header-user-item" @tap="clickIdentityMenuButton()">
        <div class="header-user-avatar">
          <Avatar :url="user.avatar" :gender="user.gender" />
        </div>
        <div class="header-user-text">
          <div class="header-user-name">{{ user.name }}
            <Icon v-if="hasUnread" name="dot-big" class="theme-highlight-color" />
            <span class="header-user-menu"><icon
              name="dropdown" color="#fff" /></span>
          </div>
          <div class="header-user-description">{{ limitText(user.school_name, 12) }}</div>
          <div class="header-user-description">{{ user.level | studentLevel }} {{ user.grade_name + ' ' + user.classes_name}}</div>
        </div>
      </v-touch>
      <div class="header-user-item" style="padding-bottom: 20px;">
        <v-touch class="header-user-tool" v-show="inPlus" @tap="clickToolButton">
          <Icon :name="toolIconName" color="#fff" size="2.2rem" />
          <span style="font-size: 12px">扫一扫</span>
        </v-touch>
      </div>
    </div>
    <v-touch v-show="maskStatus" tag="div" class="identity-mask" @tap="switchIdentityDisplay"></v-touch>
    <Identity :show="showIdentity" @close="switchIdentityDisplay" :badges="badges">
      <div slot="top" class="identity-title theme-background-gradient">
        选择当前身份
        <v-touch tag="a" class="identity-btn" @tap="switchIdentityDisplay">
          <Icon name="close" />
        </v-touch>
      </div>
    </Identity>
  </div>
</template>

<script>
export default {
  name: 'header-user',
  props: {
    toolIconName: {
      default: 'scan'
    },
    user: {},
    badges: {}
  },
  filters: {
    studentLevel(level) {
      switch (level) {
        case 0:
          return '学前';
        case 1:
          return '小学';
        case 2:
          return '初中';
        case 3:
          return '高中';
      }
    }
  },
  data() {
    return {
      inPlus: false,
      height: Number(100 + this.$store.getters.getImmersedHeight) + 'px',
      showIdentity: false,
      hasUnread: false,
      maskStatus: false
    };
  },
  watch: {
    badges() {
      this.hasUnread = this.checkUnreadStatus();
    }
  },
  mounted() {
    this.inPlus = this.Runtime.isHtml5PlusRuntime;
    this.$emit('componentHeight', this.$refs.ref.offsetHeight);
    this.hasUnread = this.checkUnreadStatus();
    console.log(this.user);
  },
  methods: {
    clickToolButton() {
      this.Page.invoke('/tool/qrcode/scan');
    },
    clickIdentityMenuButton() {
      this.switchIdentityDisplay();
    },
    checkUnreadStatus() {
      let has = false;
      let all = 0;
      const badges = this.badges || {};
      const identityid = this.Runtime.Identity.id;
      for (const k in badges) {
        const badge = badges[k];
        if (badge) {
          for (const i in badge) {
            const item = badge[i];
            const count = parseInt(item.count);
            if (count > 0) {
              all += count;
            }
          }
        }
        const key = 'id-' + identityid;
        if (k !== key) {
          has = true;
        }
      }
      this.Runtime.App.setBadgeNumber(all);
      return has;
    },
    limitText(text = '', num = 0) {
      const maxLen = num;
      const fullText = text.toString();
      return fullText.length > maxLen ? fullText.slice(0, maxLen) + '...' : fullText;
    },
    switchIdentityDisplay() {
      this.showIdentity = !this.showIdentity;
      this.maskStatus = !this.maskStatus;
    }
  }
};
</script>
