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
    init: true,
    config: null,
    channels: {},
    messages: {},
    connected: false,
    connecting: false,
    currentChannelName: '',

    isUploadPopupVisible: false,
    isInputFocused: false,
    messageText: '',
  },
  getters: {
    channelMessages: state => channelId => state.messages[channelId] || [],
    currentChannel: state => state.channels[state.currentChannelName],
    currentChannelMessages: state => state.messages[state.currentChannelName] || [],
    channelLastMessage: state => (channelId) => {
      const messages = MessageLibrary.sortByIndex(state.messages[channelId] || []);
      return messages[messages.length - 1];
    },
    channelsSortedByLastMessage: (state, getters) => Object.values(state.channels)
      .filter(channel => getters.channelLastMessage(channel.uniqueName))
      .sort((a, b) => {
        const aHasUnreadMessages = getters.channelHasUnreadMessages(a.uniqueName) ? 1 : -1;
        const bHasUnreadMessages = getters.channelHasUnreadMessages(b.uniqueName) ? 1 : -1;

        let diff = bHasUnreadMessages - aHasUnreadMessages;
        if (diff !== 0) return diff;

        const aLastMessage = getters.channelLastMessage(a.uniqueName);
        const bLastMessage = getters.channelLastMessage(b.uniqueName);

        diff = Date.parse(bLastMessage.timestamp) - Date.parse(aLastMessage.timestamp);
        return diff;
      }),
    currentChannelLastMessage: (state, getters) => getters.channelLastMessage(state.currentChannelName),
    channelHasUnreadMessages: (state, getters) => (channelId) => {
      if (!channelId) return false;
      const channelLastMessage = getters.channelLastMessage(channelId);
      const { lastConsumedMessageIndex } = state.channels[channelId];

      if (!channelLastMessage || !lastConsumedMessageIndex) return false;

      return channelLastMessage.index !== lastConsumedMessageIndex;
    },
    anyChannelHasUnreadMessages: (state, getters) => Object.values(state.channels).some(channel => getters.channelHasUnreadMessages(channel.uniqueName)),
    groupByDateChannelMessages: state => channelId => MessageLibrary.group(state.messages[channelId] || []),
    groupByDateCurrentChannelMessages: state => MessageLibrary.group(state.messages[state.currentChannelName] || []),
    user: state => state.config.user,
  },
  actions: {
    async INIT(ctx, config) {
      ctx.commit('SET_CONFIG', config);

      twilioClient = new TwilioClient(ctx.state.config.backofficeURL, ctx.state.config.token, ctx);
      await twilioClient.createClient();

      await twilioClient.getUserChannels();
      ctx.commit('SET_INIT', false);
    },
    async CONNECT(ctx, channelID) {
      try {
        ctx.commit('SET_CONNECTING', true);

        if (!twilioClient) twilioClient = new TwilioClient(ctx.state.config.backofficeURL, ctx.state.config.token, ctx);

        const channel = await twilioClient.getOrCreateChannel(channelID);

        const channels = {};
        channels[channelID] = {
          uniqueName: channel.state.uniqueName,
          messagesCount: channel.state.messagesCount,
          lastConsumedMessageIndex: channel.state.lastConsumedMessageIndex,
          friendlyName: channel.state.friendlyName,
        };
        ctx.commit('SET_CHANNELS', channels);

        ctx.commit('SET_CURRENT_CHANNEL', channel);

        ctx.commit('SET_CONNECTED', true);

        ctx.dispatch('GET_CURRENT_CHANNEL_ALL_MESSAGES');
      } catch (e) {
        ctx.commit('SET_CONNECTED', false);
      } finally {
        ctx.commit('SET_CONNECTING', false);
      }

      return channelID;
    },
    async GET_CURRENT_CHANNEL_ALL_MESSAGES({ state, dispatch }) {
      const twilioMessages = await twilioClient.getChannelMessages(state.currentChannelName);
      twilioMessages.forEach(message => dispatch(
        'RECEIVE_MESSAGE',
        {
          channelName: state.currentChannelName,
          message,
        },
      ));
    },
    async GET_CHANNEL_LAST_MESSAGE({ dispatch }, channelId) {
      const lastMessage = await twilioClient.getChannelLastMessage(channelId);

      if (!lastMessage) return;

      dispatch('RECEIVE_MESSAGE', {
        channelName: channelId,
        message: lastMessage,
      });
    },
    async RECEIVE_MESSAGE({ commit, dispatch, state }, { channelName, message }) {
      const item = message.state;
      if (item.media && !item.media.url) {
        const url = await item.media.getContentUrl();
        item.media = {
          url,
          ...item.media.state,
        };
      }
      commit('RECEIVE_MESSAGE', { channelName, message: item });

      if (channelName === state.currentChannelName) dispatch('SET_CURRENT_CHANNEL_MESSAGES_CONSUMED');
    },
    async SEND_MESSAGE(ctx, message) {
      const index = await twilioClient.sendMessage(ctx.state.currentChannelName, message);
      ctx.dispatch('SET_CURRENT_CHANNEL_MESSAGES_CONSUMED');
      return index;
    },
    async SET_CURRENT_CHANNEL_MESSAGES_CONSUMED(ctx) {
      await twilioClient.setAllChannelMessagesConsumed(ctx.state.currentChannelName);

      if (!ctx.getters.currentChannelLastMessage) return;

      const channels = {};
      channels[ctx.state.currentChannelName] = {
        ...ctx.getters.currentChannel,
        lastConsumedMessageIndex: ctx.getters.currentChannelLastMessage.index,
      };

      ctx.commit('SET_CHANNELS', channels);
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
    RESET_CURRENT_CHANNEL({ commit }) {
      commit('RESET_CURRENT_CHANNEL');
    },
  },
  mutations: {
    SET_INIT(state, is) {
      state.init = is;
    },
    SET_CONFIG(state, is) {
      state.config = is;
    },
    SET_CONNECTED(state, is) {
      state.connected = is;
    },
    SET_CONNECTING(state, is) {
      state.connecting = is;
    },
    SET_CHANNELS(state, is) {
      state.channels = { ...state.channels, ...is };

      const messages = {};
      Object.keys(is).forEach((key) => { messages[key] = []; });
      state.messages = { ...messages, ...state.messages };
    },
    SET_CURRENT_CHANNEL(state, is) {
      state.currentChannelName = is.uniqueName;
    },
    RESET_CURRENT_CHANNEL(state) {
      state.currentChannelName = '';
    },
    RECEIVE_MESSAGE(state, { channelName, message }) {
      if (!channelName) return;
      const index = state.messages[channelName].findIndex(existing => existing.sid === message.sid);

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
