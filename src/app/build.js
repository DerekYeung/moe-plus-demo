const args = process.argv.splice(2) || [];

const fs = require('fs');
const ora = require('ora');
const path = require('path');
const uuid = require('uuid');
const chalk = require('chalk');
const { exec, spawn } = require('child_process');
const config = require('./config');
const vueConfig = require('../config');
const version = require('./version');
const webpack = require('webpack');
const inquirer = require('inquirer');
const chromafi = require('chromafi');
const helper = require('./build-helper');
const ConfigBuilder = require('./config-builder');

const cwd = __dirname;
const customPath = path.join(cwd, '../config/custom');
let webpackConfig = {};

let isDevelopment = false;
let isBeta = false;
let isBuildVue = false;
let prepared = false;
let inited = false;

const arg = args[0] || '';

if (arg.indexOf('beta') > -1) {
  isBeta = true;
}
if (hasArg('--dev')) {
  isDevelopment = true;
} else {
  isDevelopment = false;
}
if (hasArg('build-vue')) {
  isBuildVue = true;
}
let options = args.find(node => {
  return node.indexOf('--options=') > -1;
});
options = options ? JSON.parse(decodeURIComponent(options.replace('--options=', ''))) : {
  // env: 'production',
  // config: 'production',
  // release: false,
  // version: 720,
  // cli: true
};
const vueServerspinner = ora('Starting Vue Server...');

const Configure = {
  env: '',
  configEnv: '',
  release: false,
  buildVersion: 0,
  init() {
    return this.setEnv().then(env => {
      return this.setRelease();
    }).then(env => {
      return this.setConf();
    }).then(conf => {
      return this.setVersion();
    }).then(response => {
      return this.confirm();
    });
  },
  setEnv() {
    if (options.env) {
      return Promise.resolve(this.env = options.env);
    }
    if (isDevelopment) {
      return Promise.resolve(this.env = 'development');
    }
    return this.ask({
      type: 'list',
      name: 'env',
      message: '环境',
      choices: helper.getEnvChoices()
    }).then(response => {
      this.env = response.env || '';
      return this.env;
    });
  },
  setRelease() {
    if (options.release != undefined) {
      return Promise.resolve(this.release = options.release);
    }
    if (this.env != 'production') {
      return Promise.resolve(false);
    }
    return this.ask({
      type: 'list',
      name: 'release',
      message: '是否发行',
      choices: helper.getReleaseChoices()
    }).then(response => {
      this.release = response.release || '';
      return this.release;
    });
  },
  setConf() {
    if (options.config != undefined) {
      return Promise.resolve(this.configEnv = options.config);
    }
    return this.ask({
      type: 'list',
      name: 'env',
      message: '配置文件',
      choices: helper.getConfChoices()
    }).then(response => {
      this.configEnv = response.env || '';
      return this.configEnv;
    });
  },
  setVersion() {
    if (options.version != undefined) {
      return Promise.resolve(this.buildVersion = options.version);
    }
    const version = this.getBuildVersion();
    this.buildVersion = version;
    if (this.env == 'development') {
      return Promise.resolve();
    }
    return this.ask({
      type: 'input',
      name: 'version',
      message: `构建版本号（${version}）`,
      filter(value) {
        return parseInt(value || version);
      },
      validate(input) {
        return isNaN(input) ? '请输入正确的版本号' : true;
      }
    }).then(response => {
      this.buildVersion = response.version || '';
      return this.buildVersion;
    });
  },
  handleConfError() {
    return this.ask({
      type: 'confirm',
      name: 'confirm',
      message: `当前环境配置文件不存在，是否创建`
    }).then(response => {
      if (response.confirm) {
        return ConfigBuilder.init(this.getConfByEnv());
      } else {
        return this.init();
      }
    });
  },
  confirm() {
    if (options.cli) {
      return Promise.resolve({
        confirm: true
      });
    }
    const conf = this.getConfigByEnv();
    if (conf.customError) {
      return this.handleConfError().then(() => {
        return this.confirm();
      });
    }
    const promps = [];
    const ask = {
      '构建类型': this.env,
      '版本号': this.buildVersion,
      'APP服务器地址': `${conf.agents.app.protocol}://${conf.agents.app.host}`,
      'Passport服务器地址': `${conf.agents.passport.protocol}://${conf.agents.passport.host}`,
      'Socket服务器地址': `${conf.agents.socket.protocol}://${conf.agents.socket.host}`,
      'Dist页面地址': conf.page
    };
    const chromafiMessage = chromafi(ask);
    const message = `${chromafiMessage}
    构建配置是否正确？`;
    promps.push({
      type: 'confirm',
      name: 'confirm',
      message
    });
    return inquirer.prompt(promps).then(answers => {
      if (answers.confirm) {
        return answers;
      } else {
        return this.init();
      }
    });
  },
  ask(promps = []) {
    return inquirer.prompt(promps);
  },
  getConfByEnv() {
    let configEnv = this.configEnv;
    if (this.configEnv == 'env') {
      if (this.env == 'development') {
        configEnv = 'dev';
      } else {
        configEnv = '';
      }
    }
    return configEnv;
  },
  getConfigByEnv() {
    const basic = config();
    let custom = {};
    const configEnv = this.getConfByEnv();
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
  getBuildVersion() {
    let newVersion = version;
    if (this.env != 'development' && this.release) {
      newVersion++;
    }
    return newVersion;
  }
};

const Builder = {
  initConfig() {
    return Configure.init();
  },
  updateSetting(port = '') {
    return new Promise(resolve => {
      const setting = {
        ip: getIPAdress(),
        port: port || vueConfig.dev.port,
        mode: Configure.env,
        conf: Configure.configEnv,
        release: Configure.release
      };
      const code = `module.exports = ${JSON.stringify(setting)};`;
      fs.writeFile(path.join(__dirname, '../config/local.setting.js'), code, () => {
        resolve(setting);
      });
    });
  },
  updateVersion() {
    const newVersion = Configure.buildVersion;
    if (newVersion == version) {
      return Promise.resolve(version);
    }
    const code = `module.exports = ${newVersion};`;
    return new Promise(resolve => {
      fs.writeFile(path.join(__dirname, '/version.js'), code, err => {
        if (err) {
          resolve(version);
        } else {
          resolve(newVersion);
        }
      });
    });
  },
  updatePkg() {
    const pkg = {
      uuid: uuid.v4(),
      version: Configure.buildVersion,
      isBeta,
      isRelease: !!Configure.release,
      isDevelopment
    };
    return new Promise(resolve => {
      const webpackPath = path.join(webpackConfig.output.path, '/pkg.json');
      fs.writeFile(webpackPath, JSON.stringify(pkg), () => {
        resolve(pkg);
      });
    });
  },
  updateCode() {
    return new Promise(resolve => {
      const spinner = ora('Build App Webpack...');
      if (Configure.env != 'development') {
        console.log(`You are build with ${Configure.env} env, it is need some time...`);
      }
      spinner.start();
      webpackConfig = require('./webpack.config');
      webpack(Object.assign({}, webpackConfig, {
        watch: !!isDevelopment
      }), (err, stats) => {
        spinner.stop();
        if (err) throw err;
        process.stdout.write(stats.toString({
          colors: true,
          modules: false,
          children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
          chunks: false,
          chunkModules: false
        }) + '\n\n');
        resolve();
      });
      // console.log(`[cwd : ${cwd}]`);
      // const ls = exec('webpack', {
      //   cwd,
      //   env: Object.assign({}, process.env, {
      //     NODE_ENV: process.env.NODE_ENV,
      //     MOE_ENV: isRelease ? 'release' : 'normal'
      //   })
      // });
      // const isProduction = process.env.NODE_ENV == 'production';
      // console.log(`process.env.NODE_ENV: [${process.env.NODE_ENV}]`);
      // console.log(`webpack env: [isProduction: ${isProduction}]`);
      // console.log(`webpack env: [isRelease: ${isRelease}]`);
      // ls.stdout.on('data', data => {
      //   console.log(`stdout: ${data}`);
      // });

      // ls.stderr.on('data', data => {
      //   console.log(`stderr: ${data}`);
      // });

      // ls.on('close', code => {
      //   console.log(`Webpack done: ${code}`);
      //   resolve();
      // });
    });
  },
  init() {
    if (!fs.existsSync(customPath)) {
      fs.mkdirSync(customPath);
    }
    return this.updateSetting().then(() => {
      if (isDevelopment) {
        VueBuilder.build();
      }
      return this.initConfig();
    }).then(response => {
      if (!response.confirm) {
        return false;
      }
      process.env.NODE_ENV = Configure.env;
      return this.updateSetting();
    }).then(mode => {
      return this.updateVersion();
    }).then(pkg => {
      return this.updateCode(pkg);
    }).then(v => {
      return this.updatePkg(v);
    }).then(() => {
      return Mapper.init();
    }).then(() => {
      prepared = true;
      if (!isDevelopment) {
        return VueBuilder.build();
      } else {
        console.clear();
        if (!inited) {
          vueServerspinner.start();
        }
      }
    });
  }
};

const Mapper = {
  init() {
    // const rootPath = path.dirname(__dirname);
    // const srcPath = path.join(rootPath, 'src');
    // const pageDir = path.resolve(srcPath, 'pages');
    // const watcher = wt.watch([pageDir]);
    // watcher.on('file', info => {
    //   if (info.event == 'rename') {
    //     console.log(chalk.yellow(`${info.path} file change rebuild map`));
    //     this.build();
    //   }
    // }).on('remove', info => {
    //   if (info.event == 'rename') {
    //     console.log(chalk.yellow(`${info.path} file change rebuild map`));
    //     this.build();
    //   }
    // });
    return this.build();
  },
  build() {
    return new Promise(resolve => {
      const mapper = spawn('node', ['build/map', isDevelopment ? '--watch&' : ''], {
        cwd: path.dirname(__dirname)
      });
      mapper.stdout.on('data', data => {
        if (data.toString().indexOf('ews-map-success') > -1) {
          resolve(true);
          // console.log(mapper);
          // mapper.kill(1);
        }
        // process.stdout.write(data);
      });
      mapper.stderr.on('data', data => {
        // process.stdout.write(data);
      });
      mapper.on('close', code => {
        // console.log('mapper close', code);
        // resolve(true);
      });
    });
  }
};

const VueBuilder = {
  build() {
    if (isDevelopment) {
      return this.dev();
    }
    if (!isBuildVue) {
      return false;
    }
    const spinner = ora('Build Vue Project...');
    spinner.start();
    const vue = spawn('node', ['build/build.js', Configure.env], {
      cwd: path.dirname(__dirname)
    });
    vue.stdout.on('data', data => {
      process.stdout.write(data);
      // console.log(data.toString());
    });
    vue.on('error', error => {
      console.log(error);
    });
    vue.on('close', code => {
      spinner.stop();
    });
  },
  dev() {
    // webpack-dev-server --inline --progress --config build/webpack.dev.conf.js
    const dev = spawn('npm', [
      'run',
      'server'
    ], {
      cwd: path.dirname(__dirname),
      shell: true
    });
    dev.stdout.on('data', data => {
      if (!process.pid) {
        dev.kill(9);
      }
      if (prepared || options.cli) {
        const str = data.toString();
        if (str.indexOf('running here') > -1) {
          console.clear();
          const scheme = str.split('http://');
          const url = scheme[1].replace('\n', '');
          const port = url.split(':')[1];
          if (!inited) {
            openBrowser(`http://${getIPAdress()}:${port}`);
            if (vueServerspinner) {
              vueServerspinner.stop();
            }
            inited = true;
          }
          try {
            const nowConfig = customRequire(path.join(__dirname, '../config/local.setting.js'));
            if (port != nowConfig.port) {
              Builder.updateSetting(port);
            }
          } catch (e) {
          }
          // console.log('vue is ready');
        }
        // console.log(str);
        process.stdout.write(chalk.cyan(data));
      }
    });
    dev.stderr.on('data', data => {
      if (prepared || options.cli) {
        process.stdout.write(data);
      }
    });
  }
};

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

function hasArg(what = '') {
  return args.find(data => {
    return data.indexOf(what) > -1;
  }) || false;
}

function customRequire(file = '') {
  const raw = fs.readFileSync(file).toString();
  const confs = raw.split(' = ');
  return JSON.parse(confs[1].replace(';', ''));
}

function openBrowser(url = '') {
  switch (process.platform) {
    case 'darwin':
      exec(`open ${url}`);
      break;
    case 'win32':
      exec(`start ${url}`);
      break;
    default:
      exec(`open ${url}`);
  }
}

Builder.init();
