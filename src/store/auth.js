export default {
  namespaced: true,
  state: {
    token: null,
    user: null,
  },
  actions: {
    SET_AUTH_DATA({ commit }, { token, user }) {
      commit('SET_TOKEN', token);
      commit('SET_USER', user);
    },
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token;
    },
    SET_USER(state, user) {
      state.user = user;
    },
  },
};
