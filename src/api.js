export default {
  async init({ store }, payload) {
    await store.dispatch('gmChat/INIT', payload);
  },
};
