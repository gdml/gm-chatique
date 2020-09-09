<template>
  <div class="gm-chat">
    <div class="gm-chat__wrapper">
      <ChatNotifications class="gm-chat__notifications" :last-message-date="lastMessageDate" />
      <div ref="messages" class="gm-chat__messages"
           :class="{ 'gm-chat__messages--connecting': connecting }"
      >
        <MessageGroup v-for="(group, i) in groupByDateCurrentChannelMessages" :key="`gm-chat__message-group-${i}`"
                      class="gm-chat__message-group" :user="user" :messages="group"
        />
      </div>
      <ChatForm class="gm-chat__form" />
      <UploadFilePopup />
    </div>
  </div>
</template>

<script>
import get from 'lodash.get';

import { mapState, mapGetters, mapActions } from 'vuex';

import ChatNotifications from './ChatNotifications/ChatNotifications.vue';
import MessageGroup from './MessageGroup.vue';
import ChatForm from './Form/ChatForm.vue';

import UploadFilePopup from './Form/UploadFilePopup.vue';

export default {
  components: {
    ChatNotifications,
    MessageGroup,
    ChatForm,
    UploadFilePopup,
  },
  props: {
    channelId: { type: [String, Number], required: true },
  },
  computed: {
    ...mapState('gmChat', ['connecting', 'messages']),
    ...mapGetters('gmChat', [
      'groupByDateCurrentChannelMessages',
      'currentChannelLastMessage',
      'user',
    ]),
    lastMessageIsMine() {
      return get(this.currentChannelLastMessage, 'author') === String(this.user.id);
    },
    lastMessageDate() {
      return get(this.currentChannelLastMessage, 'date');
    },
  },
  watch: {
    async channelId() {
      await this.init();
    },
    groupByDateCurrentChannelMessages() {
      if (!this.lastMessageIsMine) return;

      this.toBottom();
    },
  },
  async mounted() {
    await this.init();
    await this.toBottom();
  },
  destroyed() {
    this.RESET_CURRENT_CHANNEL();
  },
  methods: {
    ...mapActions('gmChat', [
      'CONNECT',
      'GET_CURRENT_CHANNEL_ALL_MESSAGES',
      'SET_CURRENT_CHANNEL_MESSAGES_CONSUMED',
      'RESET_CURRENT_CHANNEL',
    ]),
    async init() {
      const channelUniqueName = await this.CONNECT(this.channelId);
      if (channelUniqueName) {
        this.SET_CURRENT_CHANNEL_MESSAGES_CONSUMED();
        await this.toBottom();
      }
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
