'use strict';

class Bridge {
  constructor(app = {}, frame = {}) {
    this.app = app;
    this.frame = frame;
    this.listen();
  }

  listen() {
    window.addEventListener('ews-bridge-message', event => {
      const message = event.detail;
      const uuid = message.uuid;
      const cmd = message.cmd || '';
      const args = message.args || message.params || {};
      const paths = cmd.split('.');
      const m = paths[0];
      paths.splice(0, 1);
      const a = paths.join('.');
    });
  }

  resolve(uuid, data) {
    this.app.Page.trigger(this.frame, 'ews-bridge-callback', {
      uuid,
      success: 1,
      data
    });
  }

  reject(uuid, data) {
    this.app.Page.trigger(this.frame, 'ews-bridge-callback', {
      uuid,
      success: 0,
      data
    });
  }
}

module.exports = Bridge;
