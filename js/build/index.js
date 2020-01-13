webpackJsonp([1],{

/***/ 541:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _promise = __webpack_require__(223);

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Plus = __webpack_require__(64);
var Main = __webpack_require__(99).default;

var Moe = new Plus();
Moe.on('plusReady', function () {
  Main(Moe.Runtime);
  var M = Moe.Runtime;
  var engine = M.engine;
  var Top = engine.webview.getLaunchWebview();
  var Current = M.Page.current;
  var Push = M.Push;
  var Os = M.Client.os.name;
  var isAndroid = Os.toLowerCase() == 'android';

  var NotificationCenter = {
    pause: false,
    events: {
      click: function click(payload) {
        if (payload.path) {
          var path = payload.path;
          var local = path.indexOf('#') === 0;
          if (local) {
            M.Page.invoke(path.replace('#', ''), payload.query || {});
          }
        }
      },
      receive: function receive(payload) {
        var create = payload.text && payload.transmission;
        if (create) {
          engine.push.createMessage(payload.text, payload);
          engine.device.vibrate();
        }
        var badge = M.App.getBadgeNumber();
        M.App.setBadgeNumber(badge + 1);
      }
    },
    init: function init() {
      var _this = this;

      Push.addEventListener('click', function (msg) {
        msg.payload = msg.aps ? msg.payload.data : msg.payload;
        if (typeof msg.payload === 'string') {
          try {
            msg.payload = JSON.parse(msg.payload);
          } catch (e) {
            msg.payload = {};
          }
        }
        msg.payload.data = msg.payload.data || {};
        if (typeof msg.payload.data === 'string') {
          try {
            msg.payload.data = JSON.parse(msg.payload.data);
          } catch (e) {
            msg.payload.data = {};
          }
        }

        _this.events.click(msg.payload);
        M.Page.emit('push/click', msg);
      }, false);
      Push.addEventListener('receive', function (msg) {
        try {
          if (typeof msg.payload === 'string') {
            try {
              msg.payload = JSON.parse(msg.payload);
            } catch (e) {
              msg.payload = {};
            }
          }
          msg.payload.data = msg.payload.data || {};
          if (typeof msg.payload.data === 'string') {
            try {
              msg.payload.data = JSON.parse(msg.payload.data);
            } catch (e) {
              msg.payload.data = {};
            }
          }
          _this.events.receive(msg.payload);
          M.Page.emit('push/receive', msg);
        } catch (e) {
          console.error(e.message);
        }
      }, false);
      document.addEventListener('pause', function () {
        _this.pause = true;
      }, false);
      document.addEventListener('resume', function () {
        _this.pause = false;
        M.Safety.securityCheck();
      }, false);
    }
  };
  var Application = {
    loadingTip: document.querySelector('#loading-tip'),
    tip: document.querySelector('#tip') || {},
    start: function start() {
      var _this2 = this;

      M.Permission.init();
      M.Updater.use(Top);
      if (this.loadingTip) {
        this.loadingTip.classList.remove('hide');
      }
      window.addEventListener('home-loaded', function (listener) {
        _this2.tip.innerHTML = '';
        M.Passport.showHome();
      });
      window.addEventListener('download-app', function (listener) {
        var downloading = document.querySelector('#downloading');
        var percent = document.querySelector('#download-percent');
        if (downloading) {
          downloading.classList.remove('hide');
        }
        if (percent) {
          percent.innerHTML = listener.detail + '%';
        }
      });
      window.addEventListener('install-app', function (listener) {
        _this2.tip.innerHTML = '正在更新应用';
      });
      window.addEventListener('restart-app', function (listener) {
        M.App.restart();
      });
      var back = function back(e) {
        var view = engine.webview.getTopWebview();
        var isInvoke = view.isInvoke || false;
        view.canBack(function (e) {
          if (e.canBack) {
            window.history.back();
          } else {
            if (view.id == engine.runtime.appid) {
              if (isAndroid) {
                var runtimeMainActivity = engine.android.runtimeMainActivity();
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
    restart: function restart() {
      M.App.restart();
    },
    check: function check() {
      var _this3 = this;

      return this.checkAppVersion().then(function (status) {
        if (status == M.Updater.status.failed) {
          var e = new Error('需要更新版本');
          e.name = 'update';
          return _promise2.default.reject(e);
        }
        return 1;
      }).then(function () {
        _this3.tip.innerHTML = '';
        return _this3.getLoginState();
      }).then(function (userid) {
        return M.Passport.loadHome(Top);
      }).then(function () {
        return _promise2.default.resolve(NotificationCenter.init());
      }).then(function () {
        return _promise2.default.resolve(M.IO.init());
      }).then(function () {
        return _this3.checkArguments();
      }).catch(function (e) {
        _this3.showError(e);
      });
    },
    checkAppVersion: function checkAppVersion() {
      return _promise2.default.resolve(1);
    },
    checkWelcome: function checkWelcome() {
      var showed = M.Session.get('welcome/show');
      if (!showed) {
        return new _promise2.default(function (resolve) {
          var welcome = M.Page.pop('/common/welcome/index');
          if (welcome) {
            welcome.onclose = function () {
              resolve();
            };
          } else {
            resolve();
          }
        });
      }
      return showed;
    },
    checkArguments: function checkArguments() {
      var args = engine.runtime.arguments;
      if (args) {
        var json = '';
        try {
          json = JSON.parse(args);
        } catch (e) {
          json = {};
        }
        NotificationCenter.events.click(json);
      }
    },
    getLoginState: function getLoginState() {
      return M.User.isLogined() ? M.User.userid : 0;
    },
    parseError: function parseError() {
      var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (typeof e == 'string') {
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
    showUpdate: function showUpdate() {
      var view = M.Page.exists('/common/update/index');
      if (view) {
        view.close('');
      }
      view = M.Page.create('/common/update/index', null, {}, {
        param: {
          data: M.Updater.data
        }
      });
      view.onclose = function () {
        Application.restart();
      };
      view.hide();
      Current.append(view);
      view.show('fade-in');
    },
    showError: function showError(e) {
      e = e || {};
      e = this.parseError(e);
      if (e.name == 'update') {
        this.showUpdate();
        return false;
      }

      var message = e;
      var tip = '';
      if (e instanceof Error) {
        message = e.message;
        message += e.stack;
      }
      var view = M.Page.exists('/common/status/error');
      if (view) {
        view.close('none');
      }
      if (e.noNetworkError) {
        message = '无法访问网络';
        tip = '请检查网络以及网络访问权限后重试';
      }
      view = M.Page.create('/common/status/error', null, {}, {
        param: {
          message: message,
          tip: tip,
          showRetry: true
        }
      });
      view.onclose = function () {
        Application.restart();
      };
      view.hide();
      Current.append(view);
      view.show('fade-in');
    }
  };
  Application.start();
});

/***/ })

},[541]);