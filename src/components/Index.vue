<template>
  <div class="gm-chat">
    <div class="gm-chat__wrapper">
      <ChatNotifications class="gm-chat__notifications" :is-online="isOnline" :last-message-date="lastMessageDate" />
      <div ref="messages" class="gm-chat__messages" :class="{ 'gm-chat__messages--connecting': isOnline && connecting }">
        <MessageGroup v-for="(group, i) in groupByDate" :key="`gm-chat__message-group-${i}`" class="gm-chat__message-group" :user="user" :messages="group" :platform="platform" />
      </div>
      <ChatForm class="gm-chat__form" :is-online="isOnline" />
      <UploadFilePopup :platform="platform" />
    </div>
  </div>
</template>

<script>
import get from 'lodash.get';

import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';

import ChatNotifications from './ChatNotifications/ChatNotifications.vue';
import MessageGroup from './MessageGroup.vue';
import ChatForm from './Form/ChatForm.vue';

import UploadFilePopup from './Form/UploadFilePopup.vue';

import CONNECTION_STATUSES from '../constants/connectionStatuses';

export default {
  components: {
    ChatNotifications,
    MessageGroup,
    ChatForm,
    UploadFilePopup,
  },
  props: {
    roomId: { type: [String, Number], required: true },
    connectionStatus: { type: String, default: CONNECTION_STATUSES.ONLINE },
  },
  computed: {
    ...mapState('gmChat', ['connecting']),
    ...mapState('gmChat/auth', ['user']),
    ...mapGetters('gmChat', [
      'platform',
      'groupByDate',
      'lastMessageOfCurrentRoom',
    ]),
    isOnline() {
      return this.connectionStatus === CONNECTION_STATUSES.ONLINE;
    },
    lastMessageIsMine() {
      return get(this.lastMessageOfCurrentRoom, 'author') === String(this.user.id);
    },
    lastMessageDate() {
      return get(this.lastMessageOfCurrentRoom, 'date');
    },
  },
  watch: {
    async roomId() {
      await this.init();
    },
    async isOnline(val) {
      if (!val) return;

      await this.init();
    },
    groupByDate() {
      if (!this.lastMessageIsMine) return;

      this.toBottom();
    },
  },
  async mounted() {
    await this.init();

    this.toBottom();
  },
  methods: {
    ...mapActions('gmChat', [
      'CONNECT',
      'JOIN_ROOM',
      'GET_ROOM',
    ]),
    ...mapMutations('gmChat', ['SET_CONNECTING']),
    async init() {
      this.SET_CONNECTING(true);

      await this.GET_ROOM(this.roomId);
      await this.CONNECT();
      await this.JOIN_ROOM(this.roomId);

      this.SET_CONNECTING(false);
    },
    async toBottom() {
      await this.$nextTick();

      this.$refs.messages.scrollTop = this.$refs.messages.scrollHeight;
    },
  },
};
</script>

<style lang="scss">
.gm-chat {
  --gm-chat-z-index: 1;
  --gm-chat-z-index--sticky: 10;
  --gm-chat-z-index--modal: 100;

  font-family: 'SF Pro Display', sans-serif;
  font-size: 16px;
  line-height: 20px;
  letter-spacing: -0.02em;
  color: hsl(0, 0%, 13%);
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  *, *::before, *::after {
    box-sizing: border-box;
  }

  &-button {
    position: relative;
    padding: 11px;
    text-align: center;
    width: 100%;
    font-size: 17px;
    line-height: 20px;
    color: hsl(0, 0%, 100%);
    background-color: hsl(0, 0%, 13%);
    transition: all 0.1s ease-in-out;
    outline: none;
    cursor: pointer;
    border: 1px solid transparent;
    border-radius: 2px;

    &--block {
      display: block;
    }

    &--size_md {
      padding: 15px;
      border-radius: 4px;
      font-weight: 500;
    }

    &:hover {
      color: hsl(0, 0%, 100%);
    }

    &:disabled,
    &--disabled {
      background-color: hsl(0, 0%, 81%);
    }

    &--secondary {
      background-color: hsl(0, 0%, 95%);
      color: hsl(0, 0%, 13%);

      &:hover {
        color: hsl(0, 0%, 13%);
      }
    }
  }
}
</style>

<style lang="scss" scoped>
.gm-chat {
  position: relative;
  background-color: hsl(0, 0%, 100%);

  &__wrapper {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
  }

  &__notifications {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    z-index: var(--gm-chat-z-index--sticky);
  }

  &__messages {
    flex-grow: 1;
    position: relative;
    padding: 30px 15px;
    overflow-y: auto;

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: hsl(0, 0%, 100%);
      z-index: var(--gm-chat-z-index);
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.2s ease-in-out;
    }

    &--connecting {
      &::after {
        opacity: 0.8;
      }
    }
  }

  &__form {
    flex-shrink: 0;
  }
}
</style>
