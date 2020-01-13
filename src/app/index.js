const Plus = require('moe-plus');
const Main = require('./main').default;

const Moe = new Plus();
Moe.on('plusReady', () => {
  Main(Moe.Runtime);
  const M = Moe.Runtime;
  const engine = M.engine;
  const Top = engine.webview.getLaunchWebview();
  const Current = M.Page.current;
  const Push = M.Push;
  const Os = M.Client.os.name;
  const isAndroid = (Os.toLowerCase() == 'android');

  const NotificationCenter = {
    pause: false,
    events: {
      click(payload) {
        if (payload.path) {
          const path = payload.path;
          const local = (path.indexOf('#') === 0);
          if (local) {
            M.Page.invoke(path.replace('#', ''), payload.query || {});
          }
        }
      },
      receive(payload) {
        const create = (payload.text && payload.transmission);
        if (create) {
          engine.push.createMessage(payload.text, payload);
          engine.device.vibrate();
        }
        const badge = M.App.getBadgeNumber();
        M.App.setBadgeNumber(badge + 1);
      }
    },
    init() {
      Push.addEventListener('click', msg => {
        msg.payload = msg.aps ? msg.payload.data : msg.payload;
        if (typeof (msg.payload) === 'string') {
          try {
            msg.payload = JSON.parse(msg.payload);
          } catch (e) {
            msg.payload = {};
          }
        }
        msg.payload.data = msg.payload.data || {};
        if (typeof (msg.payload.data) === 'string') {
          try {
            msg.payload.data = JSON.parse(msg.payload.data);
          } catch (e) {
            msg.payload.data = {};
          }
        }
        // const data = msg.payload.data;
        // if (data.identityid) {
        //   M.Identity.setIdentityId(data.identityid);
        // }
        this.events.click(msg.payload);
        M.Page.emit('push/click', msg);
      }, false);
      Push.addEventListener('receive', msg => {
        try {
          if (typeof (msg.payload) === 'string') {
            try {
              msg.payload = JSON.parse(msg.payload);
            } catch (e) {
              msg.payload = {};
            }
          }
          msg.payload.data = msg.payload.data || {};
          if (typeof (msg.payload.data) === 'string') {
            try {
              msg.payload.data = JSON.parse(msg.payload.data);
            } catch (e) {
              msg.payload.data = {};
            }
          }
          this.events.receive(msg.payload);
          M.Page.emit('push/receive', msg);
        } catch (e) {
          console.error(e.message);
        }
      }, false);
      document.addEventListener('pause', () => {
        this.pause = true;
      }, false);
      document.addEventListener('resume', () => {
        this.pause = false;
        M.Safety.securityCheck();
      }, false);
    }
  };
  const Application = {
    loadingTip: document.querySelector('#loading-tip'),
    tip: document.querySelector('#tip') || {},
    start() {
      M.Permission.init();
      M.Updater.use(Top);
      if (this.loadingTip) {
        this.loadingTip.classList.remove('hide');
      }
      window.addEventListener('home-loaded', listener => {
        this.tip.innerHTML = '';
        M.Passport.showHome();
      });
      window.addEventListener('download-app', listener => {
        const downloading = document.querySelector('#downloading');
        const percent = document.querySelector('#download-percent');
        if (downloading) {
          downloading.classList.remove('hide');
        }
        if (percent) {
          percent.innerHTML = listener.detail + '%';
        }
      });
      window.addEventListener('install-app', listener => {
        this.tip.innerHTML = '正在更新应用';
      });
      window.addEventListener('restart-app', listener => {
        M.App.restart();
      });
      const back = e => {
        const view = engine.webview.getTopWebview();
        const isInvoke = view.isInvoke || false;
        view.canBack(e => {
          if (e.canBack) {
            window.history.back();
          } else {
            if (view.id == engine.runtime.appid) {
              if (isAndroid) {
                const runtimeMainActivity = engine.android.runtimeMainActivity();
                runtimeMainActivity.moveTaskToBack(true);
              }
            } else {
              if (isInvoke) {
                M.Page.close('auto', view);
              } else {
                M.Page.back(false, 'auto', view);
              }
            }
          }
        });
        return false;
      };
      engine.key.addEventListener('backbutton', back, false);
      engine.key.addEventListener('menubutton', back, false);
      return this.check();
    },
    restart() {
      M.App.restart();
    },
    check() {
      return this.checkAppVersion().then(status => {
        if (status == M.Updater.status.failed) {
          const e = new Error('需要更新版本');
          e.name = 'update';
          return Promise.reject(e);
        }
        return 1;
      }).then(() => {
        this.tip.innerHTML = '';
        return this.getLoginState();
      }).then(userid => {
        return M.Passport.loadHome(Top);
        // if (userid > 0) {
        //   return M.Passport.access(true).then(() => {
        //     return M.Passport.loadHome(Top);
        //   });
        // } else {
        //   return M.Passport.showLogin(Top);
        // }
      }).then(() => {
        return Promise.resolve(NotificationCenter.init());
      }).then(() => {
        return Promise.resolve(M.IO.init());
      }).then(() => {
        return this.checkArguments();
      }).catch(e => {
        this.showError(e);
      });
    },
    checkAppVersion() {
      return Promise.resolve(1);
      // return M.Updater.check();
    },
    checkWelcome() {
      const showed = M.Session.get('welcome/show');
      if (!showed) {
        return new Promise(resolve => {
          const welcome = M.Page.pop('/common/welcome/index');
          if (welcome) {
            welcome.onclose = () => {
              resolve();
            };
          } else {
            resolve();
          }
        });
      }
      return showed;
    },
    checkArguments() {
      const args = engine.runtime.arguments;
      if (args) {
        let json = '';
        try {
          json = JSON.parse(args);
        } catch (e) {
          json = {};
        }
        NotificationCenter.events.click(json);
      }
    },
    getLoginState() {
      return M.User.isLogined() ? M.User.userid : 0;
    },
    parseError(e = {}) {
      if (typeof (e) == 'string') {
        return e;
      }
      if (e.engine) {
        e.isNetworkError = true;
        if (e.status === 0) {
          e.noNetworkError = true;
        }
      }
      return e;
    },
    showUpdate() {
      let view = M.Page.exists('/common/update/index');
      if (view) {
        view.close('');
      }
      view = M.Page.create('/common/update/index', null, {}, {
        param: {
          data: M.Updater.data
        }
      });
      view.onclose = () => {
        Application.restart();
      };
      view.hide();
      Current.append(view);
      view.show('fade-in');
    },
    showError(e) {
      e = e || {};
      e = this.parseError(e);
      if (e.name == 'update') {
        this.showUpdate();
        return false;
      }

      let message = e;
      let tip = '';
      if (e instanceof Error) {
        message = e.message;
        message += e.stack;
      }
      let view = M.Page.exists('/common/status/error');
      if (view) {
        view.close('none');
      }
      if (e.noNetworkError) {
        message = '无法访问网络';
        tip = '请检查网络以及网络访问权限后重试';
      }
      view = M.Page.create('/common/status/error', null, {}, {
        param: {
          message,
          tip,
          showRetry: true
        }
      });
      view.onclose = () => {
        Application.restart();
      };
      view.hide();
      Current.append(view);
      view.show('fade-in');
    }
  };
  Application.start();
});
