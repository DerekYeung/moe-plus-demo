'use strict';

const fs = require('fs');
const path = require('path');
const config = require('./config');
let local = {};
try {
  local = require('../config/local.setting.js');
} catch (e) {
  local = {};
}
const cwd = __dirname;
const customPath = path.join(cwd, '../config/custom');

const Helper = {
  config,
  getEnvChoices() {
    return [
      {
        name: '开发',
        value: 'development'
      },
      {
        name: '测试',
        value: 'beta'
      },
      {
        name: '生产',
        value: 'production'
      }
    ];
  },
  getReleaseChoices() {
    return [
      {
        name: '否',
        value: 0
      },
      {
        name: '是',
        value: 1
      }
    ];
  },
  getConfChoices() {
    let custom = [];
    if (fs.existsSync(customPath)) {
      custom = fs.readdirSync(customPath);
    }
    const choices = [
      {
        name: '跟随环境',
        value: 'env'
      },
      {
        name: '开发',
        value: 'dev'
      },
      {
        name: '生产',
        value: 'production'
      }
    ];
    if (custom && custom.length > 0) {
      custom.forEach(node => {
        choices.push({
          name: `自定义：${node}`,
          value: node
        });
      });
    }
    return choices;
  },
  confirm(target = {}) {
    const conf = this.getConfigByEnv(target);
    if (conf.customError) {
      return conf;
    }
    const ask = {
      '构建类型': target.env,
      '版本号': target.buildVersion,
      'APP服务器地址': `${conf.agents.app.protocol}://${conf.agents.app.host}`,
      'Passport服务器地址': `${conf.agents.passport.protocol}://${conf.agents.passport.host}`,
      'Socket服务器地址': `${conf.agents.socket.protocol}://${conf.agents.socket.host}`,
      'Dist页面地址': conf.page
    };
    return ask;
  },
  getConfByEnv(target = {}) {
    let configEnv = target.configEnv;
    if (target.configEnv == 'env') {
      if (target.env == 'development') {
        configEnv = 'dev';
      } else {
        configEnv = '';
      }
    }
    return configEnv;
  },
  getBuildVersion(target = {}) {
    const version = require('./version');
    let newVersion = version;
    if (target.env != 'development' && target.release) {
      newVersion++;
    }
    return newVersion;
  },
  getConfigByEnv(target = {}) {
    const basic = config();
    let custom = {};
    const configEnv = this.getConfByEnv(target);
    if (configEnv) {
      try {
        custom = require('../config/custom/' + configEnv);
      } catch (e) {
        custom = {
          customError: true
        };
      }
    }
    const conf = Object.assign({}, basic, custom);
    return conf;
  },
  getCustomConfigPath() {
    return customPath;
  },
  getCustomConfig() {
    let custom = [];
    if (fs.existsSync(customPath)) {
      custom = fs.readdirSync(customPath);
    }
    return custom;
  },
  getCustomConfigCode(file = '') {
    return fs.readFileSync(file);
  },
  getLocalInfo() {
    return local;
  }
};

module.exports = Helper;
