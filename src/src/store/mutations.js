const POPUP_STATE = 'POPUP_STATE';
const IMMERSED_HEIGHT_STATE = 'IMMERSED_HEIGHT_STATE';
export default {
  [IMMERSED_HEIGHT_STATE](state, status) {
    state.immersedHeight = status;
    console.log('Set immersedHeight ' + status);
  },
  [POPUP_STATE](state, status) {
    state.popupState = status;
    console.log('Set popup status ' + status);
  },
  /* 图片预览 */
  openLayer(state) {
    state.layerState = true;
  },
  closeLayer(state) {
    state.layerState = false;
  },
  updateImageUrl(state, url) {
    state.downloadImageUrl = url;
  },

  /* 聊天操作 */
  showChartInputFocus(state, e) { // 聊天界面，判断当用户点击输入框的时候，输入框获取焦点，同事软键盘是弹出的状态
    if (e.target.className == 'van-field__control') {
      state.isShowChartFocus = false;
    }
  },
  changeAudioFocus(state) {
    state.isShowChartFocus = false;
  },
  clickChartContainer(state) {
    state.isShowChartFocus = true;
  }
};
