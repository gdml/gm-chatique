import axios from 'axios';
import get from 'lodash.get';

import notifications from './notifications';

import chatkit from '../helpers/chatkit';
import MessageLibrary from '../helpers/message_library';

async function getFromChatAPI(url, options, state) {
  return axios({
    url,
    ...options,
    baseURL: state.options.url,
    headers: {
      Authorization: `JWT ${state.options.token}`,
    },
  });
}

export default {
  namespaced: true,
  modules: {
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
    options: {},
  },
  getters: {
    groupByDate: (state, getters) => MessageLibrary.group(getters.currentRoomMessages),
    currentRoomMessages: (state) => state.messages[get(state.room, 'id')] || [],
    lastMessageOfCurrentRoom: (state, getters) => {
      const messages = MessageLibrary.sortByDate(getters.currentRoomMessages);

      return messages[messages.length - 1];
    },
  },
  actions: {
    async INIT({ dispatch, commit }, options) {
      commit('SET_OPTIONS', options);

      await dispatch('GET_ROOMS');
    },
    async GET_ROOM({ state, commit }, id) {
      const response = await getFromChatAPI(`/api/v1/rooms/${id}/`, {}, state);

      commit('SET_ROOM', response.data);
    },

    async GET_ROOMS({ state, commit }) {
      const response = await getFromChatAPI('/api/v1/rooms/', {}, state);

      commit('SET_ROOMS', response.data);
    },
    async CREATE_ROOM({ state, commit }, customerId) {
      const response = await getFromChatAPI('/api/v1/rooms/', { method: 'post', data: { customer: customerId } }, state);

      commit('SET_ROOM', response.data);
    },
    async CONNECT({ commit }, userId) {
      try {
        commit('SET_CONNECTING', true);
        chatkit.currentUser = await chatkit.connect(userId);
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
  },
  mutations: {
    SET_OPTIONS(state, options) {
      state.options = { ...state.options, ...options };
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
  },
};
