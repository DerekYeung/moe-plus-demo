const webpack = require('webpack');
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const isProduction = process.env.NODE_ENV == 'production';
const isRelease = process.env.MOE_ENV == 'release';

function file(target = '') {
  return path.join(__dirname, target);
}

const config = {
  entry: {
    error: file('error.js'),
    index: file('index.js'),
    home: file('home.js'),
    plus: file('plus.js'),
    vendor: ['moe-plus']
  },
  output: {
    path: path.resolve(path.dirname(path.dirname(__dirname)), 'js/build'),
    chunkFilename: '[chunkhash:8].chunk.js',
    filename: '[name].js'
  },
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader',
      options: {
        presets: [
          ['env', {
            'targets': {
              'browsers': [
                '> 1%',
                'last 2 versions',
                'Android >= 4.0',
                'not ie <= 8'
              ]
            }
          }],
          'stage-2'
        ],
        plugins: ['transform-runtime'],
        comments: false,
        env: {
          test: {
            'presets': ['env', 'stage-2'],
            'plugins': ['transform-es2015-modules-commonjs', 'dynamic-import-node']
          }
        }
      },
      exclude(filename) {
        const include = (filename.indexOf(path.join('node_modules', 'debug', '/')) > 0);
        const exclude = (filename.indexOf(path.join('node_modules', '/')) > 0);
        if (include) {
          return false;
        }
        if (exclude) {
          return true;
        }
      }
    }]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor.bundle.js'
    })
  ]
};
if (isProduction) {
  const uglifyConfig = {
    uglifyOptions: {
      compress: {
        warnings: false
      },
      mangle: {
        safari10: true
      }
    },
    sourceMap: false,
    parallel: true
  };
  if (isRelease) {
    uglifyConfig.uglifyOptions.compress.drop_console = true;
    uglifyConfig.uglifyOptions.compress.pure_funcs = ['console.log'];
  }
  config.plugins.push(new UglifyJsPlugin(uglifyConfig));
}

module.exports = config;
