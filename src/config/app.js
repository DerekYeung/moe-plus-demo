'use strict';
const configure = require('../app/config');

let local = {};
try {
  local = require('./local.setting');
} catch (e) {
  local = {};
}

module.exports = configure(local);
// if (module.exports) {
// } else {
//   export default proxy;
// }
