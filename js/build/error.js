webpackJsonp([3],{

/***/ 231:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Plus = __webpack_require__(64);
var Main = __webpack_require__(99).default;

var Moe = new Plus();
Moe.on('plusReady', function () {
  Main(Moe.Runtime);
  var M = Moe.Runtime;
  window.resetDefault = function () {
    M.App.restart();
  };
  window.resetDefault = function () {
    M.Updater.check(1, 1, true).then(function () {
      M.App.restart();
    });
  };
});
var tip = document.getElementById('local-tip');
document.addEventListener('error', function (e) {
  var url = e.url;
  var href = e.href;
  var isLocal = href.indexOf('192.168') > -1;
  var urlTip = document.getElementById('url-tip');
  if (urlTip) {
    urlTip.classList.remove('hide');
    urlTip.innerHTML = '\u65E0\u6CD5\u6253\u5F00' + url;
  }
  if (isLocal && tip) {
    tip.classList.remove('hide');
  }
}, false);
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
  tip.innerHTML = '正在更新应用';
});

/***/ })

},[231]);