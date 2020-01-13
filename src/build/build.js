'use strict';
const args = process.argv.splice(2) || [];
require('./check-versions')();
const env = args[0] || 'production';

process.env.NODE_ENV = 'production';

const ora = require('ora');
const rm = require('rimraf');
const path = require('path');
const chalk = require('chalk');
const webpack = require('webpack');
const config = require('../config');
const webpackConfig = require('./webpack.prod.conf');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const spinner = ora('building for production...');
spinner.start();
if (env != 'production') {
  const uglify = webpackConfig.plugins.find(node => {
    return node instanceof UglifyJsPlugin;
  });
  const index = webpackConfig.plugins.indexOf(uglify);
  if (index > 0) {
    webpackConfig.plugins.splice(index, 1);
  }
  // uglify.options.uglifyOptions.compress = {
  //   warnings: false
  // };
}

rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err;
  const start = new Date();
  webpack(webpackConfig, (err, stats) => {
    spinner.stop();
    if (err) throw err;
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
      chunks: false,
      chunkModules: false
    }) + '\n\n');

    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'));
      process.exit(1);
    }
    const end = new Date();
    const second = ((end - start) / 1000).toFixed();
    console.log(`  Build take up time ${second} seconds`);

    console.log(chalk.cyan('  Build complete.\n'));
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ));
  });
});
