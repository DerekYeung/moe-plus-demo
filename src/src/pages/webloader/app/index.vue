<template>
  <div v-title :data-title="title">
    <view-header :title="title" :frame="frame" left-arrow noShadow ref="header" @on-right-tap="showDevMenu">
      <span v-if="isDev" slot="right"><Icon name="menu" /></span>
    </view-header>
    <view-mask :message="serviceMessage" v-if="!showLoading" />
  </div>
</template>

<script>
export default {
  name: 'webloader-app-index',
  data() {
    return {
      title: '',
      showLoading: false,
      frame: null,
      isDev: false,
      host: ''
    };
  },
  computed: {
    serviceMessage() {
      return this.host ? `应用由 ${this.host} 提供服务` : '';
    }
  },
  methods: {
    showOauth(options = {}) {
      const link = options.url || '';
      const json = options.json || null;
      const id = 'app-oauth';
      const exists = this.Webview.getWebviewById(id);
      if (exists) {
        return false;
      }
      const oauthUrl = link + (link.indexOf('?') > -1 ? '&' : '?') + 'install_app=1&token=' + this.Runtime.Passport.token + '&oauth_info=' + encodeURIComponent(JSON.stringify(json));
      const oauth = this.Webview.create(oauthUrl, id, {
        // top: this.$refs.header.$el.offsetHeight,
        // top: 0,
        // height: height + 'px',
        plusrequire: 'ahead',
        popGesture: 'none',
        cachemode: 'noCache',
        zindex: 99
      }, {
        isInvoke: true
      });
      // setTimeout(() => {
      // }, timeout);
      oauth.addEventListener('loaded', () => {
        oauth.show('slide-in-bottom');
      });
      let oauthResult = false;
      const receiveConfirm = e => {
        const detail = e.detail;
        oauthResult = true;
        this.Page.trigger(this.frame, 'oauth-app-confirm', detail);
        oauth.close('auto');
        window.removeEventListener('oauth-confirm', receiveConfirm, false);
        // oauth.close('auto');
      };
      const receiveRject = () => {
        oauth.close('auto');
        window.removeEventListener('oauth-reject', receiveRject, false);
      };
      oauth.onclose = () => {
        if (!oauthResult) {
          this.Page.trigger(this.frame, 'oauth-app-reject');
          // this.Page.back();
        }
      };
      // window.removeEventListener('oauth-redirect', receiveRedirect, false);
      window.addEventListener('oauth-confirm', receiveConfirm, false);
      window.addEventListener('oauth-reject', receiveRject, false);
    },
    onPageBack() {
      if (this.frame) {
        this.frame.close('none');
      }
    },
    onPageShow() {
      this.isDev = (process.env.NODE_ENV == 'development') || this.Runtime.Developer.isEnabled;
      const app = this.Page.Param.app;
      this.createFrame(app.url);
    },
    createFrame(url) {
      this.showLoading = true;
      if (this.frame) {
        this.frame.close('none');
        this.frame = null;
      }
      const isHtml5Plus = this.Runtime.isHtml5PlusRuntime;
      const Os = this.Runtime.Client.os.name;
      const isAndroid = (Os.toLowerCase() == 'android');
      const current = this.Page.current;
      const app = this.Page.Param.app;
      this.title = app.name;
      // const isSafe = url.indexOf('.ewsedu.com') > -1;
      let height = 0;
      if (isHtml5Plus) {
        height = this.Runtime.engine.screen.resolutionHeight - this.$refs.header.$el.offsetHeight;
        if (isAndroid) {
          // height += this.$store.getters.getImmersedHeight;
        }
      } else {
        height = '100%';
      }
      const frame = this.Webview.create(url, null, {
        top: this.$refs.header.$el.offsetHeight,
        height: height + 'px',
        kernel: 'WKWebview',
        // plusrequire: isSafe ? 'ahead' : 'none',
        plusrequire: 'ahead',
        cachemode: 'noCache',
        progress: {
          color: '#269BFF',
          height: '5px'
        },
        videoFullscreen: 'landscape-primary'
      }, {
      });
      if (isHtml5Plus) {
        // frame.hide();
        frame.appendJsFile('_www/js/bridge.min.js');
        frame.appendJsFile('_www/js/sdk.min.js');
        frame.setBounce({
          position: { top: '100px' },
          changeoffset: { top: '0px' }
        });
      }
      this.frame = frame;
      frame.addEventListener('loaded', e => {
        // this.$refs.header.stopProgress();
        this.showLoading = false;
        const loadingUrl = frame.getURL();
        if (isHtml5Plus && loadingUrl.indexOf('.ewsedu.com/passport/auth/oauth') > -1) {
          // this.showOauth(loadingUrl);
        }
        frame.evalJS(`
          var ewsvideos = document.getElementsByTagName('video');
          for (var i = 0; i < ewsvideos.length; i++) {
            var video = ewsvideos[i];
            video.controls = false;
          }`);
      });

      const parseUri = this.Runtime.Helper.url.parse_url(url);
      this.host = parseUri.host;
      frame.addEventListener('loading', e => {
      // this.$refs.header.startProgress();
        const loadingUrl = this.frame.getURL();
        if (isHtml5Plus && loadingUrl.indexOf('.ewsedu.com/passport/auth/oauth') > -1) {
        // this.showOauth(loadingUrl);
        }
      }, false);

      current.append(frame);
    },
    showDevMenu() {
      if (!this.isDev) {
        return false;
      }
      const buttons = [{
        title: '复制当前页面地址',
        action: 'copy-url'
      }, {
        title: '在浏览器中打开',
        action: 'open-in-browser'
      }, {
        title: '刷新',
        action: 'reload'
      }, {
        title: '开启vConsole',
        action: 'open-v-console'
      }];
      this.Runtime.engine.nativeUI.actionSheet({
        title: '操作',
        cancel: '取消',
        buttons
      }, e => {
        if (e.index <= 0) {
          return false;
        }
        const button = buttons[e.index - 1];
        if (button) {
          switch (button.action) {
            case 'copy-url': this.copyFrameUrl(); break;
            case 'open-in-browser': this.openFrameInBrowser(); break;
            case 'reload': this.reloadFrame(); break;
            case 'open-v-console': this.openVconsole(); break;
          }
        }
      });
    },
    copyFrameUrl() {
      const self = this;
      this.$copyText(this.frame.getURL()).then(function(e) {
        self.Toast.show('复制成功');
      }, function(e) {
        self.Toast.show('复制失败：' + JSON.stringify(e));
      });
    },
    openFrameInBrowser() {
      const engine = this.Runtime.engine;
      engine.runtime.openURL(this.frame.getURL());
    },
    reloadFrame() {
      this.frame.reload();
    },
    openVconsole() {
      const engine = this.Runtime.engine;
      // const remote = 'https://raw.githubusercontent.com/Tencent/vConsole/master/dist/vconsole.min.js';
      const remote = 'https://sdk.ewsedu.com/app/vconsole.min.js';
      const local = '_doc/vconsole.min.js';
      engine.io.resolveLocalFileSystemURL(local, entry => {
        this.frame.appendJsFile(local);
        setTimeout(() => {
          this.frame.evalJS('new window.VConsole();');
        }, 300);
      }, e => {
        const Downloader = this.Runtime.Downloader;
        const task = Downloader.create(remote, {
          filename: local,
          auto: false
        });
        task.on('start', () => {
          this.Toast.show(`vConsole 不存在 正在从[${remote}]下载...`);
        });
        task.on('percent', percent => {
          if (percent >= 10) {
            this.Toast.show(`vConsole 下载中...[${percent}]`);
          }
        });
        task.on('error', e => {
          this.Toast.show(`vConsole 下载失败...[${e.message}]`);
        });
        task.on('success', e => {
          this.Toast.show(`vConsole 下载完毕... 正在打开`);
          this.openVconsole();
        });
        task.start();
      });
    },
    back() {
      const top = this.Runtime.engine.webview.getTopWebview();
      if (top.id == this.Page.current.id) {
        this.$refs.header.clickLeftBtn();
      }
    }
  },
  mounted() {
    const isHtml5Plus = this.Runtime.isHtml5PlusRuntime;
    const engine = this.Runtime.engine;
    if (isHtml5Plus) {
      engine.key.addEventListener('backbutton', this.back, false);
      engine.key.addEventListener('menubutton', this.back, false);
    }
    const transmissionToken = e => {
      const url = this.frame.getURL();
      const parseUri = this.Runtime.Helper.url.parse_url(url);
      const host = parseUri.host;
      const isSafe = host.indexOf('.ewsedu.com');
      if (isSafe) {
        this.Page.trigger(this.frame, 'oauth-receive-token', this.Runtime.Passport.token);
      }
    };
    window.addEventListener('oauth-request-token', transmissionToken, false);
    const receiveRedirect = e => {
      const url = e.detail;
      this.createFrame(url);
    };
    window.addEventListener('oauth-redirect', receiveRedirect, false);

    window.addEventListener('ews-bridge-message', event => {
      const message = event.detail;
      const uuid = message.uuid;
      const cmd = message.cmd || '';
      const args = message.args || message.params || {};
      const resolve = data => {
        this.Page.trigger(this.frame, 'ews-bridge-callback', {
          uuid,
          success: 1,
          data
        });
      };
      const reject = data => {
        this.Page.trigger(this.frame, 'ews-bridge-callback', {
          uuid,
          success: 0,
          data
        });
      };
      if (cmd == 'bridge.api.test') {
        resolve('success');
      } else if (cmd == 'bridge.api.openVconsole') {
        this.openVconsole();
        resolve(1);
      } else if (cmd == 'app.get.target') {
        resolve(this.Runtime.Config.target);
      } else if (cmd == 'oauth.request.auth') {
        this.showOauth(args);
      } else if (cmd == 'oauth.get.identity') {
        const scope = args.scope;
        const identity = this.Runtime.Identity.target || {};
        if (scope == 'base') {
          resolve({
            id: identity.id,
            type: this.Runtime.Config.target,
            name: identity.name
          });
        } else if (scope == 'id') {
          resolve(identity.id);
        } else if (scope == 'full') {
          const copy = Object.assign({
            type: this.Runtime.Config.target
          }, identity);
          delete copy.userid;
          delete copy.mobile;
          delete copy.parent_user;
          delete copy.parent_mobile;
          delete copy.update_time;
          delete copy.create_time;
          this.Api.Oauth.get('/user', {
            access_token: args.access_token || ''
          }).promisify.then(() => {
            resolve(copy);
          }).catch(e => {
            reject(e);
          });
        }
      }
      if (cmd == 'oauth.get.user') {
        const requestConfirm = e => {
          const detail = e.detail;
          result = detail;
          request.close('auto');
          resolve(result);
        };
        const requestReject = e => {
          request.close('auto');
        };
        let result = null;
        window.removeEventListener('request-confirm', requestConfirm);
        window.removeEventListener('request-reject', requestReject);
        window.addEventListener('request-confirm', requestConfirm, false);
        window.addEventListener('request-reject', requestReject, false);

        const request = this.Page.invoke('/common/oauth/index', {
          styles: {
            background: 'transparent'
          }
        }, true);
        request.onclose = () => {
          if (!result) {
            reject(null);
          }
        };
      }
    });
  }
};
</script>
