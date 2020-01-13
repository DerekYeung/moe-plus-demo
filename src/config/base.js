'use strict';

const db = require('./db');

const config = {
  db,
  dev: false,
  build: true,
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
  page: '/dist/index.html',
  target: 'student'
};

module.exports = config;