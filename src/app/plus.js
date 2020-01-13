const Plus = require('moe-plus');
const M = new Plus();
const Main = require('./main');
M.on('ready', () => {
  Main(M.Runtime);
});
window.Plus = Plus;
window.M = M;
