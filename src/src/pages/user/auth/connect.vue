<style scoped rel="stylesheet/scss" lang="scss">

  .index {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    background: white;
    -webkit-background-size: cover;
    background-size: cover;
    .container {
      height: 600px;
      align-self: center;
      .input-box {
        position: relative;
        .list-btn {
          position: absolute;
          display: inline-block;
          bottom: 10px;
          right: 46px;
          padding: 0 10px;
        }
        .list-container {
          position: absolute;
          width: 100%;
          .list-body {
            padding: 10px;
            margin: 0 60px;
            border: 1px solid #efefef;
            background: rgba(255, 255, 255, 1);
            box-shadow: 2px 6px 10px 0 hsla(0, 0%, 69%, .5);
            -webkit-box-shadow: 2px 6px 10px 0 hsla(0, 0%, 69%, .5);
            -moz-box-shadow: 2px 6px 10px 0 hsla(0, 0%, 69%, .5);
            border-radius: 0 0 6px 6px;
            max-height: 180px;
            overflow: auto;
            ul {
              li {
                display: flex;
                flex-flow: row nowrap;
                align-items: center;
                justify-content: center;
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
        input {
          outline: none;
          border: none;
          border-bottom: 1px solid #efefef;
          padding: 8px 10px;
          width: 80%;
          font-size: 1.2rem;
          text-align: center;
          letter-spacing: 4px;
          background: inherit;
        }
      }
    }
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

  .user-avatar {
    position: relative;
    width: 90px;
    height: 90px;
  }

  .connect-avatar {
    width: 90px;
    height: 90px;
    margin: 0 auto;
    line-height: 90px;
    color: white;
    border-radius: 4px;
    margin-bottom: 30px;
  }

  .connect-avatar img {
    width: 100%;
    height: 100%;
    border-radius: 4px;
  }

  .connect-logo {
    width: 30px;
    height: 30px;
    margin: 0 auto;
    background: #00bc0c;
    line-height: 30px;
    color: white;
    border-radius: 4px;
    text-align: center;
  }

  .connect-logo {
    position: absolute;
    right: 0;
    bottom: 0px;
  }

  .connect-logo i {
    font-size: 1em;
  }

  .login-tip {
    font-weight: lighter;
    color: #393939;
    font-family: "Microsoft YaHei" ,"微软雅黑";
    text-align: center;
  }

  .input-box {
    text-align: center;
  }

</style>

<template>
  <div class="index" v-title data-title="学拓帮 - 登录">
    <div class="container">
      <helper-margin-block height="90px"></helper-margin-block>
      <section class="connect-avatar">
        <div class="user-avatar">
          <Avatar :url="avatar" width="90px" gender="1"></Avatar>
          <div class="connect-logo">
            <Icon name="wechat" size="1.1rem"></Icon>
          </div>
        </div>
      </section>
      <helper-margin-block height="20px"></helper-margin-block>
      <h2 class="login-tip">绑定手机号</h2>
      <helper-margin-block height="20px"></helper-margin-block>
      <div class="input-box">
        <input class="theme-primary-color" placeholder="输入手机号" type="tel" v-model="mobile"
               oninput="if(value.length>11)value=value.slice(0,11)">
      </div>
      <Btn
        magic
        width="80%"
        radius="4px"
        height="40px"
        fontSize="1.1rem"
        @click="checkAccount">
        下一步
      </Btn>
      <Btn
        width="80%"
        bgColor="#09BB07"
        radius="4px"
        height="40px"
        fontSize="1.1rem"
        @click="wechatLogin">
        <Icon name="wechat" size="1.1rem"></Icon>
        取消绑定
      </Btn>
    </div>
  </div>
</template>

<script>

export default {
  name: 'common-auth-index',
  data() {
    return {
      // bgUrl: require('../../../assets/image/loginBg.jpg'),
      mobile: '',
      status: '',
      showUserList: false,
      userList: this.Runtime.Passport.history,
      avatar: '',
      connect: {}
    };
  },
  methods: {
    checkMobile(mobile) {
      let rule = /^((1[3,5,8][0-9])|(14[5,6,7,8,9])|(16[6])|(17[0,1,2,3,6,7,8])|(19[1,7,8,9]))\d{8}$/;
      if (rule.test(mobile)) {
        return true;
      } else {
        this.Toast.show('请输入正确的11位手机号');
        return false;
      }
    },
    wechatLogin() {
      this.Page.back(true);
    },
    checkAccount() {
      if (!this.checkMobile(this.mobile)) {
        return;
      }
      const current = this.Page.current;
      this.Api.Passport.get('/auth/login/is/registered', {
        mobile: this.mobile
      }).on('success', (json) => {
        const connected = json.data.connected;
        if (connected) {
          this.Toast('该手机号已绑定' + this.connect.description);
          return false;
        }
        const AuthIndex = this.Page.exists('/user/auth/index');
        this.Page.trigger(AuthIndex, 'wechatConnect', {
          mobile: this.mobile,
          connect: this.connect
        });
        setTimeout(() => {
          current.close();
        }, 300);
      });
    }
  },
  mounted() {
    const mobile = this.Page.Param.mobile;
    const connect = this.Page.Param.connect || {};
    if (mobile) {
      this.mobile = mobile;
    }
    this.connect = connect;
    if (connect.userInfo) {
      if (connect.userInfo.headimgurl) {
        this.avatar = connect.userInfo.headimgurl;
      }
    }
  }
};
</script>
