<template>
  <form class="gm-chat-form" @submit.prevent="sendTextMessage">
    <div class="gm-chat-form__upload" @click="openUploadMenu">
      <GmChatIcon name="gm-chat-add" class="gm-chat-form__upload-icon" />
    </div>
    <ChatInput v-model="text" placeholder="Отправьте сообщение…" @submit="sendTextMessage" />
    <SendButton :disabled="!text.length || offline" @click.native.prevent="sendTextMessage" />
  </form>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';

import ChatInput from './ChatInput.vue';
import SendButton from './SendButton.vue';

export default {
  components: {
    ChatInput,
    SendButton,
  },
  computed: {
    ...mapState('gmChat', ['connected', 'messageText']),
    offline() {
      return !this.connected;
    },
    text: {
      get() {
        return this.messageText;
      },
      set(message) {
        this.SET_MESSAGE_TEXT(message);
      },
    },
  },
  methods: {
    ...mapActions('gmChat', ['SEND_MESSAGE']),
    ...mapMutations('gmChat', [
      'SET_UPLOAD_POPUP_VISIBILITY',
      'TOGGLE_INPUT_FOCUS',
      'SET_MESSAGE_TEXT',
    ]),
    openUploadMenu() {
      this.SET_UPLOAD_POPUP_VISIBILITY(true);
    },
    sendTextMessage() {
      this.TOGGLE_INPUT_FOCUS(true);

      this.SEND_MESSAGE(this.text);

      this.$emit('submit');
      this.text = '';
    },
  },
};
</script>

<style lang="scss" scoped>
.gm-chat-form {
  display: grid;
  grid-gap: 8px;
  grid-template-columns: 24px 1fr 42px;
  padding: 8px 15px;
  background-color: hsl(0, 0%, 100%);
  z-index: var(--gm-chat-z-index--sticky);
  border-top: 1px solid hsl(0, 0%, 95%);

  &__upload {
    display: flex;
    align-items: center;
    height: 41px;

    &-icon {
      width: 28px;
      height: 28px;
    }
  }
}
</style>
