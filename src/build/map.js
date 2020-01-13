'use strict'
const is = require('is-type-of');
const fs = require('fs');
const path = require('path');
const debug = require('debug')('map:builder');
const globby = require('globby');
const args = process.argv.splice(2);

const rootPath = path.dirname(__dirname);
const srcPath = path.join(rootPath, 'src');
const pageDir = path.resolve(srcPath, 'pages');
const routerDir = path.resolve(srcPath, 'router');
const defaultsOptions = {
  directory: null,
  target: null,
  match: undefined,
  ignore: undefined,
  lowercaseFirst: false,
  caseStyle: 'upper',
  initializer: null,
  call: true,
  override: false,
  inject: undefined,
  filter: null,
};
let first = false;

function parse(dir) {
    const files = ['**/*.vue'];
    const ignore = [];

    let directories = [dir];

    const filter = null;
    const items = [];
    for (const directory of directories) {
      const filepaths = globby.sync(files, {
        cwd: directory
      });
      for (const filepath of filepaths) {
        const fullpath = path.join(directory, filepath);
        if (!fs.statSync(fullpath).isFile()) continue;
        // get properties
        // app/service/foo/bar.js => [ 'foo', 'bar' ]
        const properties = getProperties(filepath, defaultsOptions);
        // app/service/foo/bar.js => service.foo.bar
        const pathName = directory.split(/\/|\\/).slice(-1) + '.' + properties.join('.');
        // get exports from the file
        const exports = getExports(fullpath, defaultsOptions, pathName);

        // ignore exports when it's null or false returned by filter function
        if (exports == null || (filter && filter(exports) === false)) continue;

        // set properties of class
        if (is.class(exports)) {
          exports.prototype.pathName = pathName;
          exports.prototype.fullPath = fullpath;
        }

        items.push({
          fullpath,
          properties
        });
        debug('parse %s, properties %j, export %j', fullpath, properties, exports);
      }
    }

    return items;
}

function build(){
  const test = parse(pageDir);
  const codes = {
    maps: null,
    pages: null,
  };

  const maps = [];
  const pages = {
    head: [],
    body: [],
    output: []
  };

  // maps.push(`import pages from '@/pages';`);
  maps.push(`import loader from '@/components/loader';`);
  maps.push(`const routes = [];`);
  pages.body.push(`const pages = {};`);

  // pages
  // import HelloWorld from '@/components/HelloWorld';
  // export default {
  //   HelloWorld
  // };

  const groups = {};

  test.forEach(node => {
    const routes = node.properties;
    const m = routes[0].toLowerCase();
    const route = routes.join('/').toLowerCase();
    const pageName = node.properties.join('') + 'Page';
    const filePath = route + '.vue';
    pages.head.push(`import ${pageName} from '@/pages/${filePath}';`);
    pages.body.push(`pages.${pageName} = ${pageName};`);
    groups[m] = 1;
  });

  for (const k in groups) {
    const controllers = test.filter(node => {
      const routes = node.properties;
      const m = routes[0].toLowerCase();
      return k === m;
    })
    const childs = [];
    if (controllers) {
      controllers.forEach(node => {
        const routes = node.properties;
        const m = routes[0].toLowerCase();
        const c = routes[1].toLowerCase();
        const a = routes[2].toLowerCase();
        const route = routes.join('/').toLowerCase();
        const pageName = node.properties.join('') + 'Page';
        childs.push(`{
    path: '${c}/${a}',
    component: resolve => {
      require.ensure([], () => resolve(require('@/pages/${m}/${c}/${a}')), '${m}/${c}');
    }
  }`);
      });
    }
    const children = childs.join(', ');
    maps.push(`
routes.push({
  path: '/${k}/:controller*',
  component: loader,
  children: [${children}]
});`);
  }

  maps.push(`export default routes;`);
  maps.push('');
  pages.output.push(`export default pages;`);
  pages.output.push('');

  Object.assign(codes, {
    maps: maps.join("\n"),
    pages: [pages.head.join("\n"), pages.body.join("\n"), pages.output.join("\n")].join("\n"),
  });

  // fs.writeFileSync(path.join(pageDir, 'index.js'), codes.pages);
  fs.writeFileSync(path.join(routerDir, 'pages.js'), codes.maps);
  if (!first) {
    console.log('ews-map-success');
    first = true;
  }
  console.log(`write Map ${pageDir}`);
}
build();
if (hasArg('--watch')) {
  fs.watch(pageDir, {
    recursive: true
  }, (eventType, filename) => {
    const ext = path.extname(filename);
    if (ext === '.vue' && eventType == 'rename') {
      console.log(`${filename} has change eventType:${eventType}, rebuild maps`);
      build();
    }
  });
  console.log(`watch dir ${pageDir}`);
}
function hasArg(what = '') {
  return args.find(data => {
    return data.indexOf(what) > -1;
  }) || false;
}


// convert file path to an array of properties
// a/b/c.js => ['a', 'b', 'c']
function getProperties(filepath, {
  caseStyle
}) {
  // if caseStyle is function, return the result of function
  if (is.function(caseStyle)) {
    const result = caseStyle(filepath);
    assert(is.array(result), `caseStyle expect an array, but got ${result}`);
    return result;
  }
  // use default camelize
  return defaultCamelize(filepath, caseStyle);
}

// Get exports from filepath
// If exports is null/undefined, it will be ignored
function getExports(fullpath, {
  initializer,
  call,
  inject
}, pathName) {
  let exports = loadFile(fullpath);
  // process exports as you like
  if (initializer) {
    exports = initializer(exports, {
      path: fullpath,
      pathName
    });
  }

  // return exports when it's a class or generator
  //
  // module.exports = class Service {};
  // or
  // module.exports = function*() {}
  if (is.class(exports) || is.generatorFunction(exports) || is.asyncFunction(exports)) {
    return exports;
  }

  // return exports after call when it's a function
  //
  // module.exports = function(app) {
  //   return {};
  // }
  if (call && is.function(exports)) {
    exports = exports(inject);
    if (exports != null) {
      return exports;
    }
  }

  // return exports what is
  return exports;
}

function defaultCamelize(filepath, caseStyle) {
  const properties = filepath.substring(0, filepath.lastIndexOf('.')).split('/');
  return properties.map(property => {
    // if (!/^[a-z][a-z0-9_-]*$/i.test(property)) {
    //   return false;
    //   // throw new Error(`${property} is not match 'a-z0-9_-' in ${filepath}`);
    // }

    // use default camelize, will capitalize the first letter
    // foo_bar.js > FooBar
    // fooBar.js  > FooBar
    // FooBar.js  > FooBar
    // FooBar.js  > FooBar
    // FooBar.js  > fooBar (if lowercaseFirst is true)
    // property = property.replace(/[_-]/ig, '/');
    // property = property.replace(/[_-][a-z]/ig, s => s.substring(1).toUpperCase());
    let first = property[0];
    switch (caseStyle) {
      case 'lower':
        first = first.toLowerCase();
        break;
      case 'upper':
        first = first.toUpperCase();
        break;
      case 'camel':
      default:
    }
    return first + property.substring(1);
  });
}

function loadFile(filepath) {
  try {
    // if not js module, just return content buffer
    const extname = path.extname(filepath);
    if (extname && !require.extensions[extname]) {
      return fs.readFileSync(filepath);
    }
    // require js module
    const obj = require(filepath);
    if (!obj) return obj;
    // it's es module
    if (obj.__esModule) return 'default' in obj ? obj.default : obj;
    return obj;
  } catch (err) {
    err.message = ` load file: ${filepath}, error: ${err.message}`;
    throw err;
  }
}
