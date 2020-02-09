import axios from 'axios';

import GmChat from './components/GmChat.vue';

import store from './store';
import loadPlugins from './helpers/loadPlugins';

const configAxios = (options) => {
  axios.defaults.baseURL = options.url;

  axios.defaults.headers.common['X-GM-Client'] = 'chat-app';

  axios.interceptors.request.use((request) => {
    if (!options.token) throw new Error('GM-CHAT: Authorization token is not defined');

    // eslint-disable-next-line no-param-reassign
    request.headers.common.Authorization = `JWT ${options.token}`; // append auth token to each request to the server

    return request;
  });

  axios.interceptors.response.use((response) => response, (error) => {
    // eslint-disable-next-line no-param-reassign
    error.isAxiosError = true;

    return Promise.reject(error);
  });
};

export default (Vue, options) => {
  options.store.registerModule('gmChat', store);

  loadPlugins({ Vue });
  configAxios(options);

  Vue.component('GmChat', GmChat);
};
