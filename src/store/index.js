import axios from 'axios';
import get from 'lodash.get';

import auth from './auth';
import notifications from './notifications';

import chatkit from '../helpers/chatkit';
import MessageLibrary from '../helpers/message_library';

async function getFromChatAPI(url, options, { state, rootState }) {
  return axios({
    url,
    ...options,
    baseURL: state.config.url,
    headers: {
      Authorization: `JWT ${rootState.gmChat.auth.token}`,
    },
  });
}

export default {
  namespaced: true,
  modules: {
    auth,
    notifications,
  },
  state: {
    room: null,
    rooms: [],
    token: null,
    messages: {},
    connected: false,
    connecting: false,
    isUploadPopupVisible: false,
    isInputFocused: false,
    config: {},
    messageText: null,
  },
  getters: {
    groupByDate: (state, getters) => MessageLibrary.group(getters.currentRoomMessages),
    currentRoomMessages: (state) => state.messages[get(state.room, 'id')] || [],
    lastMessageOfCurrentRoom: (state, getters) => {
      const messages = MessageLibrary.sortByDate(getters.currentRoomMessages);

      return messages[messages.length - 1];
    },
    platform: (state) => {
      const platform = state.config.platform || {};

      return { ...platform, is: platform.is || {} };
    },
  },
  actions: {
    async INIT({ dispatch, commit }, config) {
      commit('SET_CONFIG', config);

      dispatch('gmChat/auth/SET_AUTH_DATA', {
        token: config.token,
        user: config.user,
        chatkitInstance: config.chatkitInstance,
      }, { root: true });

      await dispatch('GET_ROOMS');
    },
    async GET_ROOM(ctx, id) {
      const response = await getFromChatAPI(`/api/v1/rooms/${id}/`, {}, ctx);

      ctx.commit('SET_ROOM', response.data);
    },

    async GET_ROOMS(ctx) {
      const response = await getFromChatAPI('/api/v1/rooms/', {}, ctx);

      ctx.commit('SET_ROOMS', response.data);
    },
    async CREATE_ROOM(ctx) {
      const customerId = ctx.rootState.gmChat.auth.user.customer_id;

      const response = await getFromChatAPI('/api/v1/rooms/', { method: 'post', data: { customer: customerId } }, ctx);

      ctx.commit('SET_ROOM', response.data);
    },
    async CONNECT({ rootState, commit }) {
      const instance = rootState.gmChat.auth.chatkitInstance;
      const userId = rootState.gmChat.auth.user.id;

      try {
        commit('SET_CONNECTING', true);
        chatkit.currentUser = await chatkit.connect(instance, userId);
        commit('SET_CONNECTED', true);
      } catch (e) {
        commit('SET_CONNECTED', false);
      } finally {
        commit('SET_CONNECTING', false);
      }
    },
    JOIN_ROOM({ commit }, roomId) {
      return chatkit.currentUser.subscribeToRoomMultipart({
        roomId,
        hooks: {
          onMessage: async (msg) => {
            const { payload } = msg.parts[0];

            const message = {
              id: msg.id,
              author: msg.senderId,
              date: msg.createdAt,
              data: {
                type: payload.type,
                content: payload.content,
                src: payload.url ? await payload.url() : null,
                name: payload.name,
                size: payload.size,
              },
            };

            commit('RECEIVE_MESSAGE', { roomId, message });
          },
        },
      });
    },
    SEND_MESSAGE({ state }, message) {
      return chatkit.currentUser.sendMultipartMessage({
        roomId: state.room.id,
        ...message,
      });
    },
    RESET({ commit }) {
      commit('RESET_CHAT');
    },
  },
  mutations: {
    SET_CONFIG(state, config) {
      state.config = config;
    },
    SET_UPDATE(state, config) {
      state.config = { ...state.config, ...config };
    },
    SET_ROOM(state, room) {
      state.room = room;

      state.messages = { ...state.messages, [room.id]: [] };
    },
    SET_ROOMS(state, rooms) {
      state.rooms = rooms;
    },
    SET_TOKEN(state, token) {
      state.token = token;
    },
    SET_CONNECTED(state, is) {
      state.connected = is;
    },
    SET_CONNECTING(state, is) {
      state.connecting = is;
    },
    RECEIVE_MESSAGE(state, { roomId, message }) {
      const index = state.messages[roomId].findIndex((existing) => existing.id === message.id);

      if (index === -1) {
        state.messages[roomId].push({ ...message });
      } else {
        state.messages[roomId].splice(index, 1, message);
      }
    },
    RESET_CHAT(state) {
      state.room = null;
      state.rooms = [];
      state.connected = false;
    },
    SET_UPLOAD_POPUP_VISIBILITY(state, is) {
      state.isUploadPopupVisible = is;
    },
    TOGGLE_INPUT_FOCUS(state, is) {
      state.isInputFocused = is;
    },
    SET_MESSAGE_TEXT(state, message) {
      state.messageText = message;
    },
  },
};
