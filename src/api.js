export default {
  async init({ store }, payload) {
    await store.dispatch('gmChat/INIT', payload);
  },
  get({ store }, type) {
    if (type === 'room') return store.state.gmChat.room;

    if (type === 'rooms') return store.state.gmChat.rooms;

    throw new Error(`GM-CHATIQUE: "${type}" type is not supported by the get method`);
  },
  create({ store }, type) {
    if (type === 'room') return store.dispatch('gmChat/CREATE_ROOM');

    throw new Error(`GM-CHATIQUE: "${type}" type is not supported by the create method`);
  },
  async reset({ store }) {
    await store.dispatch('gmChat/RESET');
  },
};
