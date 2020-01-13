import Plus from 'moe-plus';
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Vant from 'vant';

import upperFirst from 'lodash/upperFirst';
import camelCase from 'lodash/camelCase';
import kebabCase from 'lodash/kebabCase';
import lodash from 'lodash';
import VueLazyload from 'vue-lazyload';
import VueClipBoard from 'vue-clipboard2';
import config from '../config/app';
import VueTouch from 'vue-touch';
import VueProgressBar from 'vue-progressbar';
import dayjs from 'dayjs';
import Viser from 'viser-vue';
import JsonViewer from 'vue-json-viewer';

import 'vant/lib/index.css';
import 'vant/lib/icon/local.css';

const Runtime = {
  Vue
};
const M = new Plus(null, Runtime);

Vue.prototype.$lodash = lodash;
Vue.prototype.$dayjs = dayjs;

Vue.use(Vant);
Vue.use(Viser);
Vue.use(VueTouch, {
  name: 'v-touch'
});
Vue.use(JsonViewer);

VueTouch.config.swipe = {
  threshold: 100,
  direction: 'horizontal'
};

Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAHklEQVQ4T2N8//79fwYKAOOoAQyjYcAwGgYMwyIMALE2PNHX9RhbAAAAAElFTkSuQmCC',
  loading: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAHklEQVQ4T2N8//79fwYKAOOoAQyjYcAwGgYMwyIMALE2PNHX9RhbAAAAAElFTkSuQmCC',
  attempt: 3,
  filter: {
    progressive(listener, options) {
      const src = listener.src || '';
      const isHttp = src.indexOf('http://') > -1 || src.indexOf('https://') > -1;
      const isDist = window.location.href.indexOf('dist') > -1;
      if (isHttp && isDist) {
        const localFileUrl = 'file://' + M.Runtime.Image.getLocalFileUrl(src);
        listener.el.setAttribute('form-local', 1);
        listener.el.setAttribute('remote-src', src);
        listener.el.setAttribute('real-error', listener.error);
        listener.error = src;
        console.log(`local: ${localFileUrl}`);
        listener.src = localFileUrl;
      }
    }
  },
  adapter: {
    loaded({
      bindType,
      el,
      naturalHeight,
      naturalWidth,
      $parent,
      src,
      loading,
      error,
      Init
    }) {
      // const remote = el.getAttribute('remote-src');
      // const isFormLocal = parseInt(el.getAttribute('form-local')) === 1;
      // if (remote && !isFormLocal) {
      //   // M.Runtime.Image.storage(el);
      //   el.setAttribute('remote-src', '');
      // }
    },
    error(listender, Init) {
      const el = listender.el;
      // const remote = el.getAttribute('remote-src');
      const localFileUrl = listender.src;
      const isFormLocal = parseInt(el.getAttribute('form-local')) === 1;
      const realError = el.getAttribute('real-error') || '';
      console.log('read photo error ' + listender.src);
      if (isFormLocal) {
        el.setAttribute('form-local', 0);
        if (realError) {
          listender.error = realError;
        }
        const task = M.Runtime.Image.storage(el);
        const parentNode = el.parentNode || null;
        let showLoading = false;
        let loadingNode = null;
        let masks = [];
        if (parentNode) {
          if (parentNode.classList.contains('ui-lazy-loading')) {
            loadingNode = parentNode;
            const childNodes = parentNode.childNodes || [];
            for (let i = 0; i < childNodes.length; i++) {
              const child = childNodes[i];
              if (child && child.classList && child.classList.contains('ui-loading-mask')) {
                masks = child.childNodes || [];
              }
            }
          }
        }
        setTimeout(() => {
          showLoading = true;
        }, 2000);
        task.on('percent', percent => {
          if (loadingNode) {
            if (percent >= 100) {
              loadingNode.classList.remove('downloading');
            } else {
              if (showLoading) {
                loadingNode.classList.add('downloading');
              }
            }
          }
          if (masks) {
            for (let n = 0; n < masks.length; n++) {
              const mask = masks[n];
              if (mask && mask.nodeType === 1) {
                mask.setAttribute('style', `width: ${percent}%`);
                mask.innerHTML = percent + '%';
              }
            }
          }
        });
        const next = localFileUrl + '?v=next';
        task.on('success', response => {
          listender.src = next;
          el.setAttribute('src', next);
        }).on('error', () => {
          listender.src = listender.error;
        });
        listender.src = listender.loading;
      }
    }
  }
});
Vue.use(VueClipBoard);

Vue.directive('title', {
  inserted(el, binding) {
    document.title = el.dataset.title + ' - MoePlus Demo';
  }
});
Vue.use(VueProgressBar, {
  color: '#269bff',
  failedColor: '#d01616',
  thickness: '5px',
  transition: {
    speed: '0.2s',
    opacity: '0.6s',
    termination: 300
  },
  autoRevert: false,
  location: 'bottom',
  inverse: false,
  autoFinish: false,
  position: 'absolute'
});
Vue.config.productionTip = false;

/* Component 自动注册 */
const requireComponent = require.context(
  './components', // 其组件目录的相对路径
  false, // 是否查询其子目录
  /[A-Z]\w+\.(vue|js)$/ // 匹配基础组件文件名的正则表达式
);
requireComponent.keys().forEach(fileName => {
  // 获取组件配置
  const componentConfig = requireComponent(fileName);
  // 获取组件的 PascalCase 命名
  const componentName = upperFirst(
    camelCase(
      // 剥去文件名开头的 `'./` 和结尾的扩展名
      fileName.replace(/^\.\/(.*)\.\w+$/, '$1')
    )
  );
  // 全局注册组件
  Vue.component(
    componentName,
    componentConfig.default || componentConfig
  );
});
const nextComponents = require.context(
  './components', // 其组件目录的相对路径
  true, // 是否查询其子目录
  /\.vue$/ // 匹配基础组件文件名的正则表达式
);
nextComponents.keys().forEach(fileName => {
  const componentConfig = nextComponents(fileName);
  const componentName = kebabCase(
    fileName.replace(/^\.\/(.*)\.\w+$/, '$1')
  );
  Vue.component(
    componentName,
    componentConfig.default || componentConfig
  );
});

Vue.prototype.conf = config;

M.on('ready', () => {
  // Fastclick.attach(document.body);
  Vue.use(M.MountPoint.Vue);

  /* eslint-disable no-new */
  /* assign vm prop to Runtime */
  const instance = Object.assign(Runtime, {
    vm: new Vue({
      el: '#app',
      store,
      router,
      components: {
        App
      },
      template: '<App/>'
    })
  });
  window.addEventListener('plus-webview-trigger', listener => {
    const detail = listener.detail;
    instance.vm.$emit(detail.event, detail.data);
  });
});
