import GmChat from './components/GmChat.vue';

import store from './store';
import loadPlugins from './helpers/loadPlugins';

export default (Vue, options) => {
  options.store.registerModule('gmChat', store);

  loadPlugins({ Vue });

  Vue.component('GmChat', GmChat);
};
