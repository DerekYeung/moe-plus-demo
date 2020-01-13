
'use strict';
const pkg = require('../package.json');
const remoteConsole = require('remote-console.io').Master;
let local = {};
try {
  local = require('../config/local.setting');
} catch (e) {
  local = {};
}
remoteConsole.start({
  bundle: pkg.name,
  host: local.ip
});
window.remoteConsole = remoteConsole;
