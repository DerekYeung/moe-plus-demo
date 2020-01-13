import Vue from 'vue';
import Vuex from 'vuex';
import mutations from './mutations';
import actions from './action';
import getters from './getter';

Vue.use(Vuex);

const state = {
  immersedHeight: 20,
  popupState: true,
  /* 图片预览 layer 的显示 */
  layerState: true,
  downloadImageUrl: ''
};

export default new Vuex.Store({
  state,
  actions,
  getters,
  mutations
});
