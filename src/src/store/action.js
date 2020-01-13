export default {
  setImmersedHeight({commit}, heightNum) {
    commit('IMMERSED_HEIGHT_STATE', heightNum);
  },
  closePopup({ commit }) {
    commit('POPUP_STATE', false);
  }
};
