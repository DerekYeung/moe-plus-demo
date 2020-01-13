import appConfig from '../config/app';
// const buildConfig = require('../config/app.build');
const helper = require('./helper');
const version = require('./version');

const config = appConfig;

export default (Runtime, instance) => {
  const M = Runtime;
  const Client = M.Client;
  const Os = M.Client.os.name;
  const isAndroid = (Os.toLowerCase() == 'android');
  const engine = M.engine;
  const launch = M.isHtml5PlusRuntime ? engine.webview.getLaunchWebview() : null;
  M.Build = version;
  M.Helper.app = helper;
  Client.set('build', M.Build);

  M.Api.loadAgents(config.agents);
  M.Api.request.intercept.request.use(request => {
    request.headers['x-moe-access-token'] = M.Passport.token;
    request.headers['x-moe-identity-id'] = M.Identity.id;
    request.headers['x-moe-identity-type'] = config.target;
    request.headers['x-moe-client'] = JSON.stringify(Client);
    if (config.dev) {
      request.headers['x-moe-dev-token'] = M.Helper.id.make();
    }
    return request;
  });
  M.Api.request.intercept.response.use(response => {
    const json = response.data || {};
    if (json && json.event == 'un-auth') {
      M.Passport.logout(true);
    }
  });
  M.Api.Passport.request.intercept.request.use(request => {
    request.headers['x-moe-client'] = JSON.stringify(Client);
  });

  if (config.page) {
    M.Page.setBasePath(config.page);
  }

  const Passport = {
    UserInstance: Symbol('user'),
    Token: 'access-token',
    get token() {
      return M.Session.get(this.Token) || M.Session.get('authorize');
    },
    get user() {
      return M.Session.get('user') || {};
    },
    get history() {
      const history = M.Session.get('user/history') || [];
      return history;
    },
    login(accessToken = '') {
      M.Session.set(this.Token, accessToken);
      this.hideLogin();
      return this.access(false);
    },
    access(logined) {
      return new Promise(resolve => {
        M.Api.get('/user/access').on('success', json => {
          const user = json.data.user || {};
          const identityList = json.data.identityList || {};
          const lists = identityList[config.target] || [];
          M.User.login(user);
          if (!lists || lists.length <= 0) {
            if (config.target == 'student') {
              this.loadPreEntry();
            } else {
              M.Toast.show('您的账号当前暂无身份信息');
              this.logout();
            }
            return false;
          }
          M.Identity.setIdentityList(identityList);
          resolve(user);
        });
      }).then(user => {
        if (!logined) {
          return this.loadHome();
        } else {
          return user;
        }
      });
    },
    logout(already = false, redirect = true) {
      const logout = already ? Promise.resolve(already) : M.Api.get('/user/access/logout').promisify;
      return logout.then(() => {
        const user = this.user;
        if (user.id > 0) {
          const history = this.history;
          const exists = history.find(data => {
            return data.id == user.id;
          });
          if (exists) {
            history.splice(history.indexOf(exists), 1);
          }
          const save = [user];
          if (history) {
            save.push(...history);
          }
          M.Session.set('user/history', save);
        }
        M.Session.del(this.Token);
        M.Identity.logout();
        M.User.logout();
        M.App.setBadgeNumber(0);

        if (redirect) {
          M.App.restart();
        }
      });
    },
    loadHome(webview) {
      const isHtml5Plus = M.isHtml5PlusRuntime;
      if (!isHtml5Plus) {
        M.Page.open('/');
        return false;
      }
      webview = webview || engine.webview.getLaunchWebview();
      const id = 'app/home';
      const last = M.Webview.getWebviewById(id);
      if (last) {
        last.close('none');
      }
      this.hideLogin();
      const view = M.Webview.create('/home.html', id, {
        cachemode: 'noCache'
      });
      view.hide();
      webview.append(view);
      setTimeout(() => {
        this.showHome();
      }, 3000);
      return view;
    },
    showHome() {
      const id = 'app/home';
      const last = M.Webview.getWebviewById(id);
      if (last) {
        const isVisible = last.isVisible();
        if (!isVisible) {
          last.show('fade-in');
        }
      }
    },
    loadPreEntry() {
      const page = M.Page.invoke('/user/auth/form');
      page.onclose = () => {
        M.App.restart();
      };
    },
    hideLogin() {
      const path = '/user/auth/index';
      const index = M.Page.exists(path);
      if (index) {
        index.hide();
      }
    },
    showLogin(webview) {
      const path = '/user/auth/index';
      const isHtml5Plus = M.isHtml5PlusRuntime;
      if (!isHtml5Plus) {
        M.Page.open(path);
        return false;
      }
      let view = M.Page.exists(path);
      if (!view) {
        view = M.Page.create(path);
        view.hide();
        webview.append(view);
      }
      view.show('slide-in-bottom');
      return view;
    },
    Connect: {
      services: [],
      init() {
        const isHtml5Plus = M.isHtml5PlusRuntime;
        if (!isHtml5Plus) {
          return Promise.resolve([]);
        }
        const engine = M.engine;
        return new Promise((resolve, reject) => {
          engine.oauth.getServices(services => {
            this.services = services;
            resolve(services);
          });
        });
      },
      isAvailable(service) {
        var find = this.services.find(data => {
          return data.id === service;
        });
        return find || false;
      },
      auth(service) {
        if (!service) {
          return Promise.reject(new Error('No Service'));
        }
        return new Promise((resolve, reject) => {
          service.login(() => {
            service.getUserInfo(event => {
              resolve(event.target);
            }, e => {
              service.logout();
              reject(new Error('认证失败，请重试'));
            });
          }, e => {
            reject(new Error('授权失败，请重试'));
          });
        });
      }
    }
  };

  const User = {
    get userid() {
      return this.user.id || 0;
    },
    get user() {
      return Passport.user;
    },
    login(user = {}) {
      return M.Session.set('user', user);
    },
    logout() {
      return M.Session.del('user');
    },
    isLogined() {
      return Passport.token && this.userid > 0;
    }
  };
  const Identity = {
    get Key() {
      const userid = User.userid;
      return {
        id: `user/${userid}/identity/id`,
        list: `user/${userid}/identity/list`,
        time: `user/${userid}/identity/time`
      };
    },
    get id() {
      const id = M.Session.get(this.Key.id);
      if (!id) {
        const target = this.first;
        const defaultId = target.id || 0;
        if (defaultId > 0) {
          this.setIdentityId(defaultId);
        }
        return defaultId;
      }
      return id;
    },
    get target() {
      const id = this.id;
      const list = this.list;
      if (list.length <= 0) {
        return {};
      }
      let target = {};
      if (!id) {
        target = this.first;
      } else {
        const exists = list.find(data => {
          return data.id == id;
        });
        target = exists || list[0];
      }
      const newId = target.id;
      if (newId != id) {
        this.setIdentityId(newId);
      }
      return target;
    },
    get first() {
      const list = this.list;
      return list.length > 0 ? list[0] : {};
    },
    get list() {
      const list = M.Session.get(this.Key.list) || [];
      return list;
    },
    get time() {
      const time = M.Session.get(this.Key.time);
      return time;
    },
    setIdentityId(id = 0) {
      M.Session.set(this.Key.id, id);
      M.Page.emit('identity-change', this.target);
      return id;
    },
    setIdentityList(identityList) {
      let list = [];
      if (identityList instanceof Array) {
        list = identityList;
      } else {
        list = identityList[config.target];
      }
      M.Session.set(this.Key.list, list);
      M.Session.set(this.Key.time, M.Helper.datetime.time());
      M.Page.emit('identity-refresh', list);
      return list;
    },
    logout() { }
  };
  const Track = {
    report(action = '', target = '', anchor = '', key = '') {
      const data = {
        action,
        target,
        anchor,
        key
      };
      return M.Api.background.post('/home/track/report', data).on('success', () => { }).on('error', () => { }).on('mistake', () => { });
    }
  };

  const Safety = {
    getKey(name = 'main') {
      return `app/safety/${name}`;
    },
    get running() {
      return this.status;
    },
    get status() {
      return this.isEnable();
    },
    get isSupportFingerprint() {
      return this.fingerprint.isSupport;
    },
    get fingerprint() {
      return M.Security.fingerprint;
    },
    get isEnable() {
      const key = this.getKey();
      return M.Session.get(key);
    },
    get isEnableFingerprint() {
      const key = this.getKey('fingerprint');
      return M.Session.get(key) && this.isSupportFingerprint;
    },
    enableFingerprint() {
      const key = this.getKey('fingerprint');
      M.Session.set(key, true);
      return true;
    },
    disableFingerprint() {
      const key = this.getKey('fingerprint');
      M.Session.del(key);
      return false;
    },
    requestAuthFingerprint(force = false) {
      return new Promise((resolve, reject) => {
        const request = this.fingerprint.authenticate();
        const promise = request.promisify;
        let view = null;
        if (isAndroid) {
          const param = {
            force,
            styles: {
              background: 'transparent'
            }
          };
          view = M.Page.invoke('/user/auth/fingerprint', param, true);
          view.onclose = () => {
            request.cancel();
          };
        }
        promise.finally(() => {
          if (view) {
            view.close('auto');
          }
        });
        promise.then(result => {
          resolve(result);
        }).catch(e => {
          reject(e);
        });
      });
    },
    securityCheck() {
      if (this.isEnableFingerprint && User.isLogined()) {
        return this.requestAuthFingerprint(true);
      }
    }
  };

  const Developer = {
    get key() {
      return 'app/developer';
    },
    get isEnabled() {
      return M.Session.get(this.key);
    },
    enable() {
      return M.Session.set(this.key, 1);
    },
    disable() {
      return M.Session.del(this.key);
    }
  };

  const Updater = {
    use(top) {
      this.top = top;
    },
    get status() {
      return {
        failed: -1,
        unwanted: 1,
        success: 2,
        apk: 3
      };
    },
    data: {},
    check(version = '', build = '', recovery = false) {
      return new Promise((resolve, reject) => {
        const api = '/home/version/check';
        M.Api.get(api, {
          version,
          build
        }).promisify.then(json => {
          this.data = json.data;
          const status = this.data.serverStatus || {};
          if (!status.access) {
            return this.accessDenied();
          }
          if (this.data.low) {
            resolve(this.status.failed);
          }
          if (this.data.url && (recovery || (config.mode != 'beta' && config.mode != 'development'))) {
            resolve(this.download(json));
          } else {
            resolve(this.status.unwanted);
          }
        }).catch(e => {
          reject(e);
        });
      });
    },
    accessDenied() {
      let view = M.Page.exists('/common/notice/index');
      if (view) {
        view.close('');
      }
      view = M.Page.create('/common/notice/index', null, {}, {
        param: {
          data: M.Updater.data
        }
      });
      view.onclose = () => {
        M.App.restart();
      };
      view.hide();
      M.Page.current.append(view);
      view.show('fade-in');
    },
    download(json) {
      return new Promise(resolve => {
        const downloader = M.Downloader;
        const task = downloader.app(json.data.url).on('success', res => {
          resolve(this.install(res.filename, json));
        }).on('error', () => {
          resolve(this.status.failed);
        });
        task.on('percent', percent => {
          M.Page.trigger(engine.webview.currentWebview(), 'download-app', percent);
          if (this.top) {
            M.Page.trigger(this.top, 'download-app', percent);
          }
        });
        task.start();
      });
    },
    install(path, json) {
      if (this.top) {
        M.Page.trigger(this.top, 'install-app', true);
      }
      return new Promise(resolve => {
        const force = !!json.data.force;
        if (json.data.openFile) {
          engine.runtime.openFile(path);
          resolve(path);
          return false;
        }
        engine.runtime.install(path, {
          force
        }, (info) => {
          if (json.data.autoRestart) {
            M.App.restart();
            return false;
          }
          if (json.data.returnInfo) {
            resolve(info);
          } else {
            resolve(this.status.success);
          }
        }, e => {
          console.log('安装新版本失败：' + e.message);
          resolve(this.status.failed);
        });
      });
    }
  };
  const IO = {
    socket: null,
    listener: [],
    init() {
      const self = this;
      window.addEventListener('socket/communication', e => {
        const detail = e.detail || {};
        const action = detail.action || '';
        const channel = detail.channel || '';
        const id = detail.id || '';
        const args = detail.args || [];
        const view = engine.webview.getWebviewById(id);
        self[action].apply(self, args).then(result => {
          M.Page.trigger(view, `socket-communication-${channel}`, result);
        });
      }, false);
      window.addEventListener('socket/listen', e => {
        const detail = e.detail || {};
        const channel = detail.channel || '';
        const id = detail.id || '';
        const view = engine.webview.getWebviewById(id);
        // self.on.apply(self, result => {
        self.on(detail.name, result => {
          M.Page.trigger(view, `socket-listen-${channel}`, result);
        });
      }, false);
      window.addEventListener('socket/emit', () => { }, false);
      window.addEventListener('socket/on', event => {
        const {
          id,
          sid,
          name
        } = event;
        this.listener.push({
          id,
          sid,
          name
        });
        this.socket.io.on(name, data => {
          this.receive(name, data);
        });
      }, false);
      const ip = M.Api.Socket.baseUrl + '/app';
      this.socket = new M.Socket(ip, {
        query: {
          userId: M.User.userid,
          accessToken: M.Passport.token
        }
      });
      this.socket.io.on('connect', () => {
        console.log(`io connect ${ip}`);
      });
      this.socket.io.on('test', () => {
        this.socket.io.emit('test-back');
      });
      this.socket.io.on('remote/assistance/get/screenshots', data => {
        M.Capture.getScreenshots().then(base64 => {
          this.socket.io.emit('remote/assistance/put/screenshots', {
            uuid: data.uuid,
            base64
          });
        }).catch(e => {
          console.log(e);
          console.log('not support');
        });
      });
      this.master = true;
    },
    receive(name = '', data = {}) {
      const listener = this.listener.filter(data => {
        return data.name == name;
      }) || [];
      if (listener) {
        listener.forEach(node => {
          const view = engine.webview.getWebviewById(node.id);
          if (view) {
            M.Page.trigger(view, `socket/${node.sid}/on/${node.name}`, data);
          } else {
            this.listener.splice(this.listener.indexOf(node), 1);
          }
        });
      }
    },
    get id() {
      return this.socket.io.id;
    },
    get io() {
      if (this.socket && this.socket.io) {
        return this.socket.io;
      }
    },
    communicate(action, args = []) {
      return new Promise(resolve => {
        const channel = M.Helper.id.make();
        const eventName = `socket-communication-${channel}`;
        const eventCallback = e => {
          const detail = e.detail;
          resolve(detail);
          window.removeEventListener(eventName, eventCallback);
        };
        window.addEventListener(eventName, eventCallback, false);
        const current = engine.webview.currentWebview();
        M.Page.trigger(launch, 'socket/communication', {
          action,
          channel,
          id: current.id,
          args
        });
      });
    },
    listen(name, callback) {
      const channel = M.Helper.id.make();
      const eventName = `socket-listen-${channel}`;
      const eventCallback = e => {
        const detail = e.detail;
        callback.call(this, detail);
      };
      window.addEventListener(eventName, eventCallback, false);
      const current = engine.webview.currentWebview();
      M.Page.trigger(launch, 'socket/listen', {
        name,
        channel,
        id: current.id
      });
    },
    emit(name, data) {
      // console.log('emit() call');
      // console.log(name);
      console.log(JSON.stringify(data));
      if (this.master) {
        return new Promise(resolve => {
          this.io.emit(name, data, result => {
            console.log(result);
            resolve(result);
          });
        });
      } else {
        return this.communicate('emit', [name, data]);
      }
    },
    on(name, event) {
      if (this.master) {
        return this.io.on(name, event);
      } else {
        return this.listen(name, event);
      }
    },
    getSocketIo() {
      if (this.master) {
        const io = this.io;
        return Promise.resolve({
          id: io.id
        });
      } else {
        return this.communicate('getSocketIo');
      }
    },
    getSocketStatus() {
      if (this.master) {
        const io = this.io;
        return Promise.resolve({
          connected: io.connected,
          disconnected: io.disconnected
        });
      } else {
        return this.communicate('getSocketStatus');
      }
    }
  };
  const Permission = {
    init() {
      this.MainActivity = null;
      if (isAndroid) {
        try {
          this.Build = engine.android.importClass('android.os.Build');
          this.Manifest = engine.android.importClass('android.Manifest');
          this.MainActivity = engine.android.runtimeMainActivity();

          const Permissions = [
            this.Manifest.permission.READ_PHONE_STATE,
            this.Manifest.permission.READ_EXTERNAL_STORAGE,
            this.Manifest.permission.WRITE_EXTERNAL_STORAGE,
            this.Manifest.permission.CAMERA
          ];
          this.request(Permissions);
        } catch (e) {
          this.hasError = true;
        }
      }
      window.addEventListener('request-permission', e => {
        const detail = e.detail;
        this.request(detail);
      });
    },
    check(permission) {
      if (this.Build && this.Build.VERSION.SDK_INT >= 23) {
        if (this.MainActivity) {
          if (this.MainActivity.checkSelfPermission(permission) == -1) {
            return false;
          }
        }
      }
      return true;
    },
    getPermissionByAction(action = '') {
      if (this.Manifest && this.Manifest.permission) {
        const actions = {
          gallery: this.Manifest.permission.READ_EXTERNAL_STORAGE
        };
        return actions[action];
      }
    },
    request(permission) {
      const REQUEST_CODE_CONTACT = 101;
      if (this.Build && this.Build.VERSION.SDK_INT >= 23) {
        if (this.MainActivity) {
          if (!(permission instanceof Array)) {
            permission = [this.getPermissionByAction(permission)];
          }
          this.MainActivity.requestPermissions(permission, REQUEST_CODE_CONTACT);
        }
      }
    },
    require(permission = []) {
      if (!this.MainActivity) {
        M.Page.trigger(launch, 'request-permission', permission);
      } else {
        this.request(permission);
      }
    }
  };

  M.Config = config;

  M.Permission = Permission;
  M.Passport = Passport;
  M.User = User;
  M.Identity = Identity;
  M.Track = Track;
  M.IO = IO;
  M.Safety = Safety;
  M.Developer = Developer;
  M.Updater = Updater;
};
