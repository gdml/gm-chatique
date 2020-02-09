import uuid from 'uuid';

export default {
  namespaced: true,
  state() {
    return {
      container: [],
    };
  },
  getters: {
    notifications: (state) => state.container || [],
  },
  mutations: {
    PUSH_NOTIFICATION(state, params) {
      const {
        duration,
        message,
        title,
        url,
        type,
      } = params;

      const notification = {
        id: uuid(),
        message,
        title,
        url,
        type,
        duration,
      };

      state.container = [...state.container, notification];
    },
    DELETE_NOTIFICATION(state, { id }) {
      state.container = state.container.filter((i) => i.id !== id);
    },
  },
};
