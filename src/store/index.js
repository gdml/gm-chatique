import notifications from './notifications';
import TwilioClient from '../helpers/twilio';

import MessageLibrary from '../helpers/messageLibrary';

let twilioClient = null;

export default {
  namespaced: true,
  modules: {
    notifications,
  },
  state: {
    config: null,
    messages: {},
    connected: false,
    connecting: false,
    currentChannelName: null,

    isUploadPopupVisible: false,
    isInputFocused: false,
    messageText: '',
  },
  getters: {
    groupByDate: (state, getters) => MessageLibrary.group(getters.currentChannelMessages),
    currentChannelMessages: (state) => state.messages[state.currentChannelName] || [],
    lastMessageOfCurrentChannel: (state, getters) => {
      const messages = MessageLibrary.sortByDate(getters.currentChannelMessages);

      return messages[messages.length - 1];
    },
    user: (state) => state.config.user,
  },
  actions: {
    async INIT({ commit }, config) {
      commit('SET_CONFIG', config);
    },
    async CONNECT(ctx, channelID) {
      let channelUniqueName = null;
      try {
        ctx.commit('SET_CONNECTING', true);

        if (!twilioClient) twilioClient = new TwilioClient(ctx.state.config.backofficeURL, ctx.state.config.token, ctx);

        channelUniqueName = await twilioClient.getOrCreateChannel(channelID);
        ctx.commit('SET_CURRENT_CHANNEL', channelUniqueName);

        ctx.commit('SET_CONNECTED', true);
      } catch (e) {
        ctx.commit('SET_CONNECTED', false);
      } finally {
        ctx.commit('SET_CONNECTING', false);
      }

      return channelUniqueName;
    },
    async GET_ALL_MESSAGES({ state, dispatch }) {
      const twilioMessages = await twilioClient.getAllMessages();
      twilioMessages.forEach((message) => dispatch(
        'RECEIVE_MESSAGE',
        {
          channelName: state.currentChannelName,
          message,
        },
      ));
    },
    async RECEIVE_MESSAGE({ commit }, { channelName, message }) {
      const item = message.state;
      if (item.media && !item.media.url) {
        const url = await item.media.getContentUrl();
        item.media = {
          url,
          ...item.media.state,
        };
      }
      commit('RECEIVE_MESSAGE', { channelName, message: item });
    },
    async SEND_MESSAGE(ctx, message) {
      const index = await twilioClient.sendMessage(message);
      return index;
    },
    CHANGE_CONNECTION_STATUS({ state, commit }, status) {
      if (state.currentChannelName && status === 'connected') {
        commit('SET_CONNECTED', true);
        commit('SET_CONNECTING', false);
      }
      if (status === 'connecting') {
        commit('SET_CONNECTED', false);
        commit('SET_CONNECTING', true);
      }
    },
  },
  mutations: {
    SET_CONFIG(state, is) {
      state.config = is;
    },
    SET_CONNECTED(state, is) {
      state.connected = is;
    },
    SET_CONNECTING(state, is) {
      state.connecting = is;
    },
    SET_CURRENT_CHANNEL(state, is) {
      state.currentChannelName = is;
      state.messages = { ...state.messages, [is]: [] };
    },
    RECEIVE_MESSAGE(state, { channelName, message }) {
      const index = state.messages[channelName].findIndex((existing) => existing.sid === message.sid);

      if (index === -1) {
        state.messages[channelName].push({ ...message });
      } else {
        state.messages[channelName].splice(index, 1, message);
      }
    },

    SET_UPLOAD_POPUP_VISIBILITY(state, is) {
      state.isUploadPopupVisible = is;
    },
    SET_MESSAGE_TEXT(state, message) {
      state.messageText = message;
    },
    TOGGLE_INPUT_FOCUS(state, is) {
      state.isInputFocused = is;
    },
  },
};
