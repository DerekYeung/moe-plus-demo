'use strict'
const db = require('../db');
let local = {};
try {
  local = require('../local.setting');
} catch (e) {
  local = {};
}

const config = {
  db,
  agents: {
    app: {
      protocol: 'http',
      host: 'app.plus.demo.ewsedu.org',
      main: true
    },
    passport: {
      protocol: 'http',
      host: 'passport.plus.demo.ewsedu.org',
    },
    socket: {
      protocol: 'ws',
      host: 'socket.plus.demo.ewsedu.org',
      socket: true,
      nsp: '/app'
    }
  },
  page: 'http://' + (local.ip || '127.0.0.1') + ':' + (local.port || 8080)
};

module.exports = config;