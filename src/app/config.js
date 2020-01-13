const base = require('../config/base');

module.exports = (local = {}) => {
  let custom = {};
  if (local.conf) {
    if (local.conf == 'env') {
      if (local.mode == 'development') {
        local.conf = 'dev';
      } else {
        local.conf = '';
      }
    }
  }
  if (local.conf) {
    try {
      custom = require(`../config/custom/${local.conf}`);
    } catch (e) {
      custom = {};
      console.log(`custom config not exists`);
    }
  }
  const proxy = Object.assign({}, base, custom);
  proxy.env = local.env;
  proxy.dev = proxy.env == 'development';
  proxy.mode = local.mode;
  proxy.local = local;
  return proxy;
};
