'use strict';
const Plus = require('moe-plus');
const Main = require('./main').default;

const Moe = new Plus();
Moe.on('plusReady', () => {
  Main(Moe.Runtime);
  const M = Moe.Runtime;
  window.resetDefault = function() {
    M.App.restart();
  };
  window.resetDefault = function() {
    M.Updater.check(1, 1, true).then(() => {
      M.App.restart();
    });
  };
});
const tip = document.getElementById('local-tip');
document.addEventListener('error', e => {
  const url = e.url; // 错误页面的url地址
  const href = e.href; // 错误页面的完整路径（包括完整的协议头）
  const isLocal = href.indexOf('192.168') > -1;
  const urlTip = document.getElementById('url-tip');
  if (urlTip) {
    urlTip.classList.remove('hide');
    urlTip.innerHTML = `无法打开${url}`;
  }
  if (isLocal && tip) {
    tip.classList.remove('hide');
  }
}, false);
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
  tip.innerHTML = '正在更新应用';
});
