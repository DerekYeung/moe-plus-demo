webpackJsonp([2],{

/***/ 542:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Plus = __webpack_require__(64);
var Moe = new Plus();
var Main = __webpack_require__(99).default;

Moe.on('ready', function () {
  Main(Moe.Runtime);
  var M = Moe.Runtime;
  var engine = M.engine;
  var home = M.Page.current;
  var pages = [{
    id: 'index',
    path: '/module/index/index',
    main: true
  }, {
    id: 'profile',
    path: '/user/page/index'
  }, {
    id: 'contact',
    path: '/chat/contact/index'
  }];
  var loading = document.querySelector('.ui-loading-view');
  var showLoading = function showLoading() {
    if (loading) {
      loading.classList.remove('hide');
    }
  };
  var hideLoading = function hideLoading() {
    if (loading) {
      loading.classList.add('hide');
    }
  };

  pages.forEach(function (node, index) {
    var id = 'app/home/' + node.id;
    var exists = engine.webview.getWebviewById(id);
    if (!exists && (index == 0 || node.preload)) {
      var view = M.Page.create(node.path, id, {
        top: 0,
        bottom: 51,
        plusrequire: 'ahead'
      });

      home.append(view);

      if (!node.main) {
        view.hide('none');
      }
    }
  });
  var active = pages[0].id;
  hideLoading();
  var nodes = document.querySelectorAll('.mui-tab-item');
  var callback = function callback(e) {
    var now = document.querySelector('.mui-active');
    if (now) {
      now.classList.remove('mui-active');
    }
    this.classList.add('mui-active');
    var target = this.getAttribute('controller');

    if (target == active) {
      return false;
    }
    hideLoading();
    var id = 'app/home/' + active;
    var view = engine.webview.getWebviewById('app/home/' + target);
    engine.webview.hide(id);
    active = target;
    if (view) {
      view.show('fade-in', 100);
    } else {
      var page = pages.find(function (data) {
        return data.id == target;
      });
      var subview = M.Page.create(page.path, 'app/home/' + target, {
        top: 0,
        bottom: 51,
        plusrequire: 'ahead'
      });
      home.append(subview);
    }
    setTimeout(function () {
      showLoading();
    }, 3000);
    setTimeout(function () {
      hideLoading();
    }, 10000);
  };
  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i];
    node.addEventListener('touchstart', callback, false);
  }
});

document.oncontextmenu = function (e) {
  e.preventDefault();
};

/***/ })

},[542]);