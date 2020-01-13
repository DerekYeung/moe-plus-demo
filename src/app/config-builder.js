const args = process.argv.splice(2) || [];

const fs = require('fs');
const path = require('path');
const config = require('./config')();
const inquirer = require('inquirer');
const chromafi = require('chromafi');

const cwd = __dirname;
const customPath = path.join(cwd, '../config/custom');

const ask = promps => {
  return inquirer.prompt(promps);
};

let defaultEnv = args[0] || 'dev';
const Builder = {
  env: '',
  agents: {
    app: '',
    passport: '',
    socket: ''
  },
  page: '',
  init(env = '') {
    if (env) {
      defaultEnv = env;
    }
    return this.setEnv().then(() => {
      return this.setAgent('app');
    }).then(() => {
      return this.setAgent('passport');
    }).then(() => {
      return this.setAgent('socket');
    }).then(() => {
      return this.setPage();
    }).then(() => {
      return this.confirm();
    }).then(confirm => {
      if (!confirm) {
        return false;
      }
      return this.createConfigFile();
    });
  },
  setEnv() {
    return ask([{
      type: 'input',
      name: 'env',
      message: `配置环境(${defaultEnv})`,
      filter(value = '') {
        return value || defaultEnv;
      }
    }]).then(response => {
      this.env = response.env || '';
      return this.env;
    });
  },
  setAgent(agent = 'app') {
    const current = config.agents[agent] || {};
    const defaults = current.protocol + '://' + current.host;
    return ask([{
      type: 'input',
      name: 'url',
      message: `${agent}服务器地址(${defaults})`,
      filter: (value = '') => {
        value = value || defaults;
        const row = this.parseUrl(value);
        return row.protocol + '://' + row.host;
      }
    }]).then(response => {
      this.agents[agent] = response.url;
      return response;
    });
  },
  setPage() {
    const ip = {
      id: 1,
      name: '局域网IP',
      value: 'ip'
    };
    const dist = {
      id: 2,
      name: 'dist目录',
      value: 'dist'
    };
    const choices = [ip, dist];
    if (this.env == 'production') {
      choices.sort((a, b) => {
        return b.id - a.id;
      });
    }
    return ask([{
      type: 'list',
      name: 'page',
      choices
    }]).then(response => {
      this.page = response.page;
      return response;
    });
  },
  confirm() {
    const promps = [];
    const qa = {
      '环境': this.env,
      'APP服务器地址': this.agents.app,
      'Passport服务器地址': this.agents.passport,
      'Socket服务器地址': this.agents.socket,
      'Page地址': this.page
    };
    const chromafiMessage = chromafi(qa);
    const message = `${chromafiMessage}
    配置是否正确？`;
    promps.push({
      type: 'confirm',
      name: 'confirm',
      message
    });
    return ask(promps).then(answers => {
      if (answers.confirm) {
        return answers;
      } else {
        return this.init();
      }
    });
  },
  parseUrl(url = '') {
    url = url || '';
    const split = url.split('://');
    let protocol = split[0];
    let host = split[1];
    if (split.length <= 1) {
      protocol = 'http';
      host = split[0];
    }
    return {
      protocol,
      host
    };
  },
  createConfigFile() {
    const app = this.parseUrl(this.agents.app);
    const passport = this.parseUrl(this.agents.passport);
    const socket = this.parseUrl(this.agents.socket);
    const ip = getIPAdress();
    const page = this.page == 'dist' ? `'/dist/index.html'` : `'http://' + (local.ip || '${ip}') + ':' + (local.port || 8080)`;
    const code = `'use strict'
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
      protocol: '${app.protocol}',
      host: '${app.host}',
      main: true
    },
    passport: {
      protocol: '${passport.protocol}',
      host: '${passport.host}'
    },
    resource: {
      protocol: 'http',
      host: 'static.ewsedu.com'
    },
    socket: {
      protocol: '${socket.protocol}',
      host: '${socket.host}',
      socket: true,
      nsp: '/app'
    }
  },
  page: ${page}
};

module.exports = config;`;
    return new Promise(resolve => {
      if (!exists(customPath)) {
        fs.mkdirSync(customPath);
      }
      const file = path.join(customPath, `${this.env}.js`);
      fs.writeFile(file, code, () => {
        resolve();
      });
    });
  }
};

function exists(src) {
  return fs.existsSync(src);
}
function getIPAdress() {
  var interfaces = require('os').networkInterfaces();
  for (var devName in interfaces) {
    var iface = interfaces[devName];
    for (var i = 0; i < iface.length; i++) {
      var alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address;
      }
    }
  }
}

module.exports = Builder;
