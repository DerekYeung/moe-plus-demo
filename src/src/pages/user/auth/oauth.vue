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
      <h2 class="login-tip">载入中...</h2>
    </div>
  </div>
</template>

<script>

export default {
  name: 'common-auth-index',
  data() {
    return {
    };
  },
  methods: {
    onPageShow() {
      const accessToken = this.Page.Param.accessToken || this.Page.Param.oauth || '';
      this.Runtime.Passport.login(accessToken);
    }
  }
};
</script>
