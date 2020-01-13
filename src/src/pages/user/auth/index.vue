<style scoped rel="stylesheet/scss" lang="scss">
  .app-low-os .wave-background{
    display: none;
  }
  .ui-app-view {
    background: white;
  }

  .auth-view {
    background-repeat: no-repeat;
    background-size: contain;
    background-position: bottom;

    header {
      position: relative;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-orient: vertical;
      -webkit-box-direction: normal;
      -ms-flex-direction: column;
      flex-direction: column;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      -webkit-box-pack: center;
      -ms-flex-pack: center;
      justify-content: center;
      height: 200px;
      padding: 0;
      background: #4e8cfe;
      color: #fff;
      overflow: hidden;
      transition: all 0.6s ease;

      .inner {
        // position: absolute;
        background: transparent;
        z-index: 100;
        // top: 0;
        // left: 0;
        // width: 100%;
        // height: 100%;
        .logo-title {
          // margin-top: 60px;
          text-align: center;
          font-size: 30px;
          font-weight: lighter;
          text-shadow: 1px 1px rgba(0, 0, 0, 0.1);
          font-family: "Microsoft Yahei";
        }
        .logo-sub-title {
          text-align: center;
          margin-top: 8px;
          font-size: 18px;
          font-weight: lighter;
          text-shadow: 1px 1px rgba(0, 0, 0, 0.1);
        }
      }

      .next {
        height: 100px;
      }
      .wave-background {
        position: absolute;
        top: 0;
        align-items: center;
        width: 100%;
        height: 100%;
        background-color: rgba(255, 255, 255, 0.52);
        overflow: hidden;
        z-index: 99;

        // &:before, &:after {
        //   content: "";
        //   position: absolute;
        //   left: 50%;
        //   min-width: 300vw;
        //   min-height: 300vw;
        //   background-color: #0084ff;
        //   background: -webkit-gradient(linear, left top, right top, from(#4e8cfe), to(#38b9fd)) !important;
        //   background: linear-gradient(90deg, #4e8cfe, #38b9fd) !important;
        //   background: -o-linear-gradient(90deg, #4e8cfe, #38b9fd) !important;
        //   animation-name: rotate;
        //   animation-iteration-count: infinite;
        //   animation-timing-function: linear;
        // }

        // &:before {
        //   bottom: 5vh;
        //   border-radius: 45%;
        //   animation-duration: 10s;
        // }

        // &:after {
        //   bottom: 2vh;
        //   opacity: .5;
        //   border-radius: 47%;
        //   animation-duration: 10s;
        // }
      }
    }

    .actions {
      margin: 20px;
    }

    .privacy {
      text-align: center;
      font-size: 12px;
      clear: both;
      padding-top: 10px;
    }
    .privacy .link {
      color: #40a8fe;
    }

    .form {
      z-index: 999;
      margin: 20px 20px 0 20px;

      .form-group {
        position: relative;
        text-align: left;
        display: flex;
        flex-direction: column-reverse;
        margin-bottom: 15px;
        label {
          padding-left: 8px;
          font-size: 24px;
          font-weight: lighter;
          margin-top: 8px;
          margin-bottom: 8px;
          display: block;
          transition: all 0.1s ease;
        }
        input {
          width: 100%;
          border: none;
          border-bottom: 1px solid #ebebeb;
          padding: 8px 10px;
          font-size: 1rem;
          text-align: left;
          letter-spacing: 4px;
          background: inherit;
          transition: all 0.3s ease;
        }
        input:focus {
          color: #4e8cfe;
          border-bottom: 2px solid #4e8cfe;
        }
        input:focus + label {
          color: #0084ff;
          font-size: 30px;
        }

        .list-btn {
          position: absolute;
          display: inline-block;
          bottom: 0px;
          right: 0;
          padding: 10px;
        }

        .list-container {
          position: absolute;
          width: 100%;
          top: 84px;
          z-index: 100;
          .list-body {
            padding: 10px;
            border: 1px solid #efefef;
            background: rgba(255, 255, 255, 1);
            box-shadow: 2px 2px 10px 0 rgba(0, 0, 0, .2);
            -webkit-box-shadow: 2px 2px 10px 0 rgba(0, 0, 0, .2);
            -moz-box-shadow: 2px 2px 10px 0 rgba(0, 0, 0, .2);
            max-height: 200px;
            overflow: auto;
            ul {
              li {
                display: flex;
                flex-flow: row nowrap;
                align-items: center;
                justify-content: space-between;
                padding: 10px 0;
                &:active {
                  background-color: #efefef !important;
                }
                &:not(:last-child) {
                  border-bottom: 1px solid #eee;
                }
                .list-avatar {
                  float: left;
                  width: 32px;
                  height: 32px;
                  margin-right: 10px;
                  img {
                    border-radius: 50px;
                    width: 100%;
                    height: 100%;
                    box-shadow: 0 0 10px rgba(189, 185, 185, 0.15);
                  }
                }
                .list-info {
                  color: #666;
                  letter-spacing: 2px;
                  font-size: 1rem;
                }
              }
            }
          }
        }

        .user-avatar {
          position: absolute;
          display: inline-block;
          bottom: 6px;
          right: 40px;
          width: 32px;
          height: 32px;
          img {
            border: 1px solid #efefef;
            border-radius: 50px;
            width: 100%;
            height: 100%;
          }
        }

        .captcha-btn {
          display: inline-block;
          position: absolute;
          bottom: 0px;
          right: 0;
          font-size: .85rem;
          border-radius: 4px;
          padding: 10px;
          -webkit-transition: all 100ms;
          transition: all 100ms;
          &:active {
            background: #4e8cfe;
            color: #fff;
          }
        }
      }
    }

    .footer {
      font-size: .9rem;
      float: right;
      padding: 0 20px;
    }
  }

  .slide-fade-enter-active {
    transition: all .3s ease;
  }

  .slide-fade-leave-active {
    transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }

  .slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active for below version 2.1.8 */
  {
    transform: translateX(10px);
    opacity: 0;
  }

  .user-list-enter-active {
    animation: userListAnimation .2s;
  }

  .user-list-leave-active {
    animation: userListAnimation .2s reverse;
  }

  @keyframes userListAnimation {
    0% {
      opacity: .2;
    }
    100% {
      opacity: 1;
    }
  }

  @keyframes rotate {
    0% {
      transform: translate(-50%, 0) rotateZ(0deg);
    }
    50% {
      transform: translate(-50%, -2%) rotateZ(180deg);
    }
    100% {
      transform: translate(-50%, 0%) rotateZ(360deg);
    }
  }

</style>

<template>
  <div class="auth-view" v-title data-title="登录" :style="{backgroundImage:'url(' + bgUrl + ')'}">
    <header :class="[onNext ? 'next' : '', 'theme-background-gradient']" :style="headerStyle">
      <div class="inner" v-if="!onNext" :style="innerStyle">
        <div class="logo-title">
          学拓帮
        </div>
        <div class="logo-sub-title">
          让家校沟通更紧密
        </div>
      </div>
      <div class="inner" v-else :style="innerStyle">
        <div class="logo-title" v-if="status == 'login'">
          登录学拓帮
        </div>
        <div class="logo-title" v-else-if="status == 'register'">
          加入学拓帮
        </div>
      </div>
    </header>
    <div class="form">
      <div class="form-group">
        <input placeholder="请输入手机号" type="tel" v-bind:readonly="autolock" v-model="mobile" maxlength="11" @keyup="onKeyup" @click="showUserList = false" ref="mobile">
        <label>手机号</label>
        <div class="user-avatar" v-if="isSelectedMobile">
          <Avatar :url="avatar"/>
        </div>
        <v-touch class="list-btn" v-if="userList.length > 0 && !autolock" @tap="showUserList = !showUserList">
          <Icon :name="showUserList?'dropup':'dropdown'" color="#999" size="1.2rem"></Icon>
        </v-touch>
        <transition name="user-list">
          <div class="list-container" v-show="showUserList">
            <div class="list-body">
              <ul>
                <v-touch tag="li" v-for="(item, index) in userList" :key="index" @tap="selectMobile(item)">
                  <div class="list-info">{{item.mobile}}</div>
                  <div class="list-avatar">
                    <Avatar v-if="item.avatar" :url="item.avatar"/>
                    <Avatar v-else/>
                  </div>
                </v-touch>
              </ul>
            </div>
          </div>
        </transition>
      </div>
      <transition name="slide-fade">
        <div class="form-group" v-show="status !== ''">
          <input placeholder="请输入密码" type="password" ref="password" v-model="password">
          <label>密码</label>
        </div>
      </transition>
    </div>
    <div class="actions">
      <div class="on-normal" v-if="!onNext">
        <Btn
          magic
          hMargin="5px"
          radius="4px"
          width="100%"
          height="40px"
          fontSize="1.1rem"
          @click="checkAccount">
          下一步
        </Btn>
      </div>
      <div class="on-login" v-else-if="onNext && status == 'login'">
        <Btn
          magic
          width="100%"
          radius="4px"
          height="40px"
          fontSize="1.1rem"
          @click="login">
          登录
        </Btn>
      </div>
      <div class="on-register" v-else-if="onNext && status == 'register'">
        <Btn
          magic
          width="100%"
          radius="4px"
          height="40px"
          fontSize="1.1rem"
          @click="register">
          注册
        </Btn>
      </div>
      <div class="on-reset" v-else-if="onNext && status == 'reset'">
        <Btn
          magic
          width="100%"
          radius="4px"
          height="40px"
          fontSize="1.1rem"
          @click="reset">
          重设密码
        </Btn>
      </div>
    </div>
    <div class="footer">
      <v-touch tag="span" class="theme-primary-color" v-if="status ==='login'" @tap="status='reset'">忘记密码
        <Icon name="question" />
      </v-touch>
      <v-touch tag="span" v-if="status==='reset'" @tap="status='login'">登录
        <Icon name="youjiantou" />
      </v-touch>
    </div>
    <div class="privacy">
      登录或注册即代表已阅读并同意<v-touch tag="span" class="link" @tap="showPolicy">服务条款</v-touch>
    </div>
    <Policy v-if="isShowPolicy"></Policy>
  </div>
</template>

<script>
export default {
  name: 'common-auth-index',
  data() {
    return {
      bgUrl: require('../../../assets/image/login-bg.png'),
      top: 200,
      onNext: false,
      isShowPolicy: false,
      mobile: '',
      status: '',
      password: '',
      captcha: '',
      avatar: '',
      autolock: false,
      autonext: false,
      userList: this.Runtime.Passport.history,
      showUserList: false,
      captchaWaitTime: 0,
      captchaLength: 4,
      focus: false,
      social: {
        weixin: null
      },
      socialState: {
        weixin: {
          default: '微信登录',
          text: '微信登录',
          login: false
        }
      },
      connect: {},
      isSelectedMobile: false,
      sendMsgDisabled: false
    };
  },
  methods: {
    checkMobile(mobile, showTip = true) {
      let rule = /^((1[3,5,8][0-9])|(14[5,6,7,8,9])|(16[6])|(17[0,1,2,3,6,7,8])|(19[1,7,8,9]))\d{8}$/;
      if (rule.test(mobile)) {
        return true;
      } else {
        showTip && this.Toast.show('请输入正确的11位手机号');
        return false;
      }
    },
    checkAccount() {
      if (!this.checkMobile(this.mobile)) return;
      this.Runtime.Key.hideKeyboard();
      this.Api.Passport.get('/auth/login/is/registered', {
        mobile: this.mobile
      }).on('success', (json) => {
        this.onNext = true;
        this.status = json.data.registered ? 'login' : 'register';
        if (this.status === 'login') {
          // setTimeout(() => {
          //   this.Runtime.Key.showKeyboard(this.$refs.password);
          // }, 100);
        }
      });
    },
    wechatLogin() {
      this.Runtime.Passport.Connect.auth(this.social.weixin).then(target => {
        return this.Api.Passport.post('/auth/connect/authed', {
          service: target.id,
          openid: target.authResult.openid
        }).on('success', json => {
          if (json.data.accessToken) {
            const accessToken = json.data.accessToken;
            this.logined(accessToken);
          } else {
            this.Page.invoke('/user/auth/connect', {
              mobile: this.mobile,
              connect: target
            }, true);
          }
        }).promisify;
      }).catch(e => {
        this.Toast.show(e.message);
      });
    },
    showAwait(wait) {
      this.captchaWaitTime = wait;
      this.sendMsgDisabled = true;
      const interval = window.setInterval(() => {
        if ((this.captchaWaitTime--) <= 0) {
          this.captchaWaitTime = this.captchaWaitTime;
          this.sendMsgDisabled = false;
          window.clearInterval(interval);
        }
      }, 1000);
    },
    sendCaptcha() {
      if (!this.checkMobile(this.mobile)) {
        return false;
      }
      let api = '';
      this.status === 'register' ? api = '/auth/login/sms/registry' : api = '/auth/login/sms/forget';
      this.Api.Passport.post(api, {
        mobile: this.mobile
      }).on('success', (json, response) => {
        this.Toast.show('短信已发送，请查收！');
        const wait = parseInt(json.data.wait);
        if (wait > 0) {
          this.showAwait(wait);
        }
      }).on('request-limit', json => {
        const wait = parseInt(json.wait);
        if (wait > 0) {
          this.showAwait(wait);
        }
      });
    },
    login() {
      if (!this.checkMobile(this.mobile)) {
        return;
      }
      const param = {
        mobile: this.mobile,
        password: this.password,
        connect: this.connect
      };
      this.Api.Passport.post('/auth/login', param).on('success', (json, response) => {
        const accessToken = json.data.accessToken;
        this.logined(accessToken, '登录成功！');
        this.Runtime.Key.hideKeyboard();
      });
    },
    logined(token = '', toast = '') {
      this.Runtime.Passport.login(token);
      if (toast) {
        this.Toast.show(toast);
      }
    },
    register: function() {
      if (!this.checkMobile(this.mobile)) {
        return;
      }
      this.Api.Passport.post('/auth/login/registry', {
        mobile: this.mobile,
        password: this.password,
        code: this.captcha
      }).on('success', json => {
        const accessToken = json.data.accessToken;
        this.logined(accessToken, '注册成功！');
      });
    },
    reset: function() {
      if (!this.checkMobile(this.mobile)) {
        return;
      }
      this.Api.Passport.post('/auth/login/forget/password', {
        mobile: this.mobile,
        password: this.password,
        code: this.captcha
      }).on('success', (json, response) => {
        const accessToken = json.data.accessToken;
        this.logined(accessToken, '密码修改成功！');
      });
    },
    selectMobile(userInfo) {
      this.showUserList = false;
      this.isSelectedMobile = true;
      this.mobile = userInfo.mobile;
      this.password = userInfo.password;
      this.avatar = userInfo.avatar;
      this.login();
    },
    onKeyup(e) {
      const mobile = this.mobile;
      if (this.checkMobile(mobile, false)) {
        this.checkAccount();
      }
    },
    onPageShow() {
      const Param = this.Page.Param;
      const autonext = !!Param.autonext;
      const connect = this.Page.Param.connect || '';
      const generalToken = this.Page.Param.general_token_login || '';
      if (connect) {
        this.connect = connect instanceof Object ? connect : JSON.parse(connect);
      }
      this.status = this.Page.Param.status || '';
      this.autolock = false;
      this.autonext = autonext && this.mobile;
      if (generalToken) {
        this.logined(generalToken);
      }
      // if (autonext) {
      //   this.checkAccount();
      //   setTimeout(() => {
      //     this.Runtime.Key.showKeyboard(this.$refs.password);
      //   }, 300);
      // } else {
      //   setTimeout(() => {
      //     this.Runtime.Key.showKeyboard(this.$refs.mobile);
      //   }, 300);
      // }
    },
    clear() {
      this.onNext = false;
      this.status = '';
    },
    showPolicy() {
      this.Page.pop('/privacy/policy/clause');
    }
  },
  computed: {
    headerStyle() {
      const basic = this.onNext ? 100 : 200;
      const top = basic + this.$store.getters.getImmersedHeight;
      return {
        'padding-top': top + 'px'
      };
    },
    innerStyle() {
      const basic = this.onNext ? 100 : 200;
      const top = basic + this.$store.getters.getImmersedHeight;
      return {
        'margin-top': -top + 'px'
      };
    }
  },
  watch: {
    mobile(mobile) {
      this.clear();
      if (mobile.length !== 11) {
        this.isSelectedMobile = false;
        this.showUserList = false;
        this.password = '';
        this.avatar = '';
      }
    }
  },
  mounted() {
    const Param = this.Page.Param || {};
    const mobile = Param.mobile;
    const userList = this.userList;
    if (userList.length > 0) {
      const first = userList[0];
      this.mobile = first.mobile;
    }
    if (mobile) {
      this.mobile = mobile;
    }
    this.Runtime.Passport.Connect.init().then(services => {
      this.social.weixin = this.Runtime.Passport.Connect.isAvailable('weixin');
    });
    this.isShowPolicy = !this.Session.get('policy/show');
    this.$on('wechatConnect', data => {
      this.clear();
      this.mobile = data.mobile;
      this.connect = data.connect;
      this.checkAccount();
    });
  }
};
</script>
