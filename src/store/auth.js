export default {
  namespaced: true,
  state: {
    token: null,
    user: null,
    chatkitInstance: null,
  },
  actions: {
    SET_AUTH_DATA({ commit }, { token, user, chatkitInstance }) {
      commit('SET_TOKEN', token);
      commit('SET_USER', user);
      commit('SET_CHATKIT_INSTANCE', chatkitInstance);
    },
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token;
    },
    SET_USER(state, user) {
      state.user = user;
    },
    SET_CHATKIT_INSTANCE(state, chatkitInstance) {
      state.chatkitInstance = chatkitInstance;
    },
  },
};
