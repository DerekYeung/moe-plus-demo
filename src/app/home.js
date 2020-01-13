const Plus = require('moe-plus');
const Moe = new Plus();
const Main = require('./main').default;

Moe.on('ready', () => {
  Main(Moe.Runtime);
  const M = Moe.Runtime;
  const engine = M.engine;
  const home = M.Page.current;
  const pages = [
    {
      id: 'index',
      path: '/module/index/index',
      main: true
    },
    {
      id: 'profile',
      path: '/user/page/index'
    },
    // {
    //   id: 'message',
    //   path: '/chat/message/index',
    //   // preload: true
    // },
    {
      id: 'contact',
      path: '/chat/contact/index'
    }
  ];
  const loading = document.querySelector('.ui-loading-view');
  const showLoading = () => {
    if (loading) {
      loading.classList.remove('hide');
    }
  };
  const hideLoading = () => {
    if (loading) {
      loading.classList.add('hide');
    }
  };

  pages.forEach((node, index) => {
    const id = 'app/home/' + node.id;
    const exists = engine.webview.getWebviewById(id);
    if (!exists && (index == 0 || node.preload)) {
      const view = M.Page.create(node.path, id, {
        top: 0,
        bottom: 51,
        plusrequire: 'ahead'
      });

      home.append(view);

      if (!node.main) {
        view.hide('none');
      }
    }
  });
  let active = pages[0].id;
  hideLoading();
  const nodes = document.querySelectorAll('.mui-tab-item');
  const callback = function(e) {
    const now = document.querySelector('.mui-active');
    if (now) {
      now.classList.remove('mui-active');
    }
    this.classList.add('mui-active');
    const target = this.getAttribute('controller');

    if (target == active) {
      return false;
    }
    hideLoading();
    const id = 'app/home/' + active;
    const view = engine.webview.getWebviewById('app/home/' + target);
    engine.webview.hide(id);
    active = target;
    if (view) {
      view.show('fade-in', 100);
    } else {
      const page = pages.find(data => {
        return data.id == target;
      });
      const subview = M.Page.create(page.path, 'app/home/' + target, {
        top: 0,
        bottom: 51,
        plusrequire: 'ahead'
      });
      home.append(subview);
    }
    setTimeout(() => {
      showLoading();
    }, 3000);
    setTimeout(() => {
      hideLoading();
    }, 10000);
  };
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    node.addEventListener('touchstart', callback, false);
  }
});

document.oncontextmenu = function(e) {
  e.preventDefault();
};
