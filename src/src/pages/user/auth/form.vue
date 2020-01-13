<style scoped lang="scss">
  .index {
    header {
      position: fixed;
      top: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 44px;
      padding-bottom: 16px;
      width: 100%;
      height: 142px;
      text-align: center;
      color: white;

      .title {
        width: 80%;
        font-size: 1.75rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .tips {
        margin-top: 4px;
        font-size: 0.625rem;
      }

      .back-btn {
        position: absolute;
        top: 0;
        left: 0;
        padding: 10px;
      }
    }

    .main-container {
      padding-top: 142px;

      .step-tip {
        position: fixed;
        top: 142px;
        margin: 0 auto;
        width: 100%;
        padding-top: 16px;
        padding-bottom: 16px;
        padding-left: 16px;
        font-size: 1rem;
        text-align: left;
        box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.15);
        color: #393939;
        background: white;
        z-index: 10;
      }

      .main.step-first {
        .step-section {
          position: fixed;
          top: 197px;
          width: 100%;

          .search-form {
            .search-group {
              position: relative;
              width: 100%;
              margin: 0 auto;
              border-bottom: 1px solid rgba(216, 216, 216, 0.5);
              z-index: 5;

              .refill-btn {
                position: absolute;
                width: 32px;
                height: 32px;
                line-height: 32px;
                text-align: center;
                top: 9px;
                right: 16px;
                padding: 0px 4px;
                // visibility: hidden;
                transition: all 218ms;
              }
            }

            .search-input {
              margin-bottom: 0 !important;
              padding: 16px !important;
              height: auto !important;
              width: 100%;
              font-size: 1rem;
              border: none !important;
              outline: none;
            }
          }
        }

        .select-section {
          padding-top: 110px;
          padding-bottom: 40px;
          height: 330px;
          overflow: auto;

          .school-close {
            opacity: .35;
          }

          .item {
            padding: 8px 16px;
            text-align: left;
            border-bottom: 1px solid rgba(216, 216, 216, 0.5);
            background-color: #fff;

            .item-name {
              font-size: 1rem;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }

            .item-pos {
              margin-top: 4px;
              color: #9e9e9e;
              font-size: 0.75rem;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
        }
      }

      .main.step-second {

        .step-section {
          padding-top: 55px;
          padding-bottom: 40px;
          width: 100%;

          .search-group {
            width: 100%;
            margin: 0 auto;
            background: white;
            color: #393939;
            border-top: 1px solid rgba(216, 216, 216, 0.5);
            border-bottom: 1px solid rgba(216, 216, 216, 0.5);
          }

          .search-input {
            width: 100%;
            border: none !important;
            outline: none;
            padding: 8px 16px !important;
            height: auto !important;
            font-size: 1rem;
            font-weight: 200;
            margin-bottom: 0 !important;
            line-height: 1;
          }

          .search-section {
            text-align: center;
            overflow: auto;
          }

          .search-result {
            width: 90%;
            margin: 0 auto;
            box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.15);
            max-height: 225px;
            overflow: auto;
          }

          .school-item {
            text-align: left;
            padding: 16px;
            border-bottom: 1px solid rgba(216, 216, 216, 0.5);

            .school-name {
              font-size: 20px;
              font-weight: 200;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }

            .school-region {
              font-size: 12px;
              color: #9e9e9e;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }

            &:active {
              background: #0BA3F6;
              color: white;

              .school-region {
                color: #e6e6e6;
              }
            }
          }
          .search-result .error-tip {
            text-align: center;
            padding: 16px;
          }

          .select-tip {
            text-align: left;
            padding-top: 16px;
            padding-left: 16px;
            border-bottom: 1px solid rgba(216, 216, 216, 0.5);
            display: none;
          }

          .search-select {
            font-weight: 200;
            font-size: 1rem;
            padding: 8px 16px;
            text-align: left;
            position: relative;

            .icon {
              position: absolute;
              top: 14px;
              right: 16px;
            }
          }

          .label {
            font-size: .9rem;
            letter-spacing: 2px;
            font-weight: 300;
            padding: 8px 0;
            margin: 0 16px;
            text-align: left !important;
          }

          .student-avatar {
            padding: 8px 16px;

            .avatar-btn {
              position: relative;
              width: 90px;
              height: 90px;
              line-height: 90px;
              border-radius: 8px;
              border: 1px solid rgba(216, 216, 216, 0.5);
              overflow: hidden;

              input {
                position: absolute;
                top: 0;
                left: 0;
                bottom: 0;
                right: 0;
                width: 100%;
                opacity: 0;
              }

              i {
                color: rgba(216, 216, 216, 1);
                font-size: 3em;
              }

              img {
                width: 100%;
                height: 100%;
              }
            }
          }

          .upload-tip {
            text-align: left;
            padding-left: 16px;
            font-size: 12px;
            color: #a5a5a5;
          }
        }

        .select-section {
          padding-top: 110px;
          padding-bottom: 40px;

          .item {
            padding: 8px 16px;
            text-align: left;
            border-bottom: 1px solid rgba(216, 216, 216, 0.5);
            background-color: #fff;

            .item-name {
              font-size: 1rem;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }

            .item-pos {
              margin-top: 4px;
              color: #9e9e9e;
              font-size: 0.75rem;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }

            & .school-close {
              cursor: pointer;
            }
          }
        }
      }
    }

    footer {
      position: fixed;
      bottom: 0;
      width: 100%;

      .next-btn {
        display: table-cell;
        width: 1%;
        height: 40px;
        line-height: 40px;
        color: #fff;
        background-color: #838181;
        text-align: center;

        &.disable {
          cursor: not-allowed;
          pointer-events: none;
          background-color: #848181 !important;
        }
      }
    }
  }
</style>

<template>
  <div class="index" v-title data-title="注册信息">
    <header class="theme-background-gradient" v-if="status === 'intro'">
      <h2 class="title">您还未绑定学生信息</h2>
      <span class="tips">请按照提示录入信息</span>
      <span class="tips">审核通过后即可享更多服务</span>
    </header>
    <div class="main-container">
      <div class="step-tip">{{ status === 'intro' ? '第一步：选择学校' : '第二步：填写信息'}}</div>
      <div class="main step-first" v-if="status === 'intro'">
        <div class="step-section">
          <form class="search-form">
            <div class="search-group">
              <input v-model="searchInput" class="search-input" type="text" value="" placeholder="在此输入学校名称"/>
              <v-touch tag="span" v-show="searchInput !== ''" class="refill-btn" @tap="clickRemoveBtn">
                <Icon name="cancel" color="#8a8a8a" size="24px"></Icon>
              </v-touch>
            </div>
            <div class="search-result"></div>
          </form>
        </div>
        <ul class="select-section" v-if="filterList.length > 0">
          <v-touch
            tag="li"
            class="item"
            :class="{'school-close': !item.open_join}"
            v-for="item in filterList"
            :key="item.id"
            @tap="clickSelectBtn(item)">
            <p class="item-name">{{ item.name }}</p>
            <p class="item-pos">{{ item.pos }}</p>
          </v-touch>
        </ul>
        <ul class="select-section" v-else-if="searchInput !== ''">
          <li class="item">
            <p class="item-name">未找到相关学校信息</p>
          </li>
        </ul>
      </div>
    </div>
    <footer>
      <v-touch tag="a" class="next-btn" @tap="clickLogoutBtn">退出登录</v-touch>
      <v-touch tag="a" class="next-btn theme-background-gradient" @tap="clickNextBtn" :class="{disable: btnDisabled}">下一步</v-touch>
    </footer>
  </div>
</template>

<script>

export default {
  name: 'common-auth-infoSchool',
  data() {
    return {
      timer: null,
      status: 'intro',

      /**
         *  intro 状态 方法
         */

      alternative: [], // 学校备选项
      searchInput: '',
      filterList: [],
      btnDisabled: true,

      school: {
      },
      /**
         *  input 状态 方法
         */
      // 填写资料
      profile: {
        school: '',
        className: '',
        name: '',
        relation: '',
        gender: '',
        avatar: ''
      },
      show1: false,
      show2: false,
      // 关系选择器
      columns2: [ '家长', '爸爸', '妈妈', '爷爷', '奶奶', '外公', '外婆', '叔叔', '阿姨', '舅舅', '姑姑' ],
      show3: false,
      columns3: ['男', '女']
    };
  },
  methods: {
    /**
       * 状态通用方法
       */

    // 下一步方法
    clickNextBtn() {
      if (this.btnDisabled) {
        return false;
      }
      this.Page.open('/user/auth/post', {
        school: this.school
      });
    },
    clickLogoutBtn() {
      this.Runtime.Passport.logout();
    },

    /**
       * intro 状态包含的方法
       */

    // 移除所选学校方法
    clickRemoveBtn() {
      this.searchInput = '';
      this.btnDisabled = true;
    },
    // 选中学校方法
    clickSelectBtn(item) {
      if (!item.open_join) {
        this.$toast('当前学校暂未开通', 'error');
        return false;
      }

      const name = item.name;
      this.school = item;
      this.searchInput = name;
      this.profile.school = name;
      this.btnDisabled = false;
    },

    /**
       * input 状态包含的方法
       */

    // 返回到 intro 状态
    clickBackBtn() {
      // 切换状态
      this.status = 'intro';
    },

    openClassesSelect() {
      setTimeout(() => {
        this.showClassesSelect = true;
      }, 50);
    },
    onClassesConfirm(value) {
      this.profile.className = value.join('');
      this.showClassesSelect = false;
    },
    onShow2Confirm(value) {
      this.profile.relation = value;
      this.show2 = false;
    },
    onShow3Confirm(value) {
      this.profile.gender = value;
      this.show3 = false;
    },
    getImage(e) { // 图片读取
      let _this = this;
      var files = e.target.files[0];
      if (!e || !window.FileReader) return; // 是否支持 FileReader
      let reader = new FileReader();
      reader.readAsDataURL(files); // 图片转换为 base64
      reader.onloadend = function() {
        _this.profile.avatar = this.result;
      };
    },
    searchSchool() {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        this.Api.get('/school/search', {
          name: this.searchInput
        }).on('success', (json, response) => {
          this.alternative = json.data.schools;
          this.filterList = this.alternative;
          for (const k in this.filterList) {
            if (this.filterList[k].name == this.searchInput) {
              this.btnDisabled = false;
            }
          }
        });
      }, 300);
    }

  },
  watch: {
    // 监听输入框变化，动态修改备选学校列表
    searchInput(newVal, oldVal) {
      this.btnDisabled = true;
      this.searchSchool(this.searchInput);
    }
  }
};
</script>
