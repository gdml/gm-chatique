<template>
  <form class="gm-chat-form">
    <div class="gm-chat-form__upload" @click="openUploadMenu">
      <GmChatIcon name="gm-chat-add" class="gm-chat-form__upload-icon" />
    </div>
    <ChatInput v-model="text" placeholder="Отправьте сообщение…" @submit="sendTextMessage" />
    <SendButton :disabled="!text.length || offline" @click.native="sendTextMessage" />
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
  props: {
    isOnline: { type: Boolean, required: true },
  },
  data() {
    return {
      text: '',
    };
  },
  computed: {
    ...mapState('gmChat', ['connected']),
    offline() {
      return !this.isOnline || !this.connected;
    },
  },
  methods: {
    ...mapActions('gmChat', ['SEND_MESSAGE']),
    ...mapMutations('gmChat', [
      'SET_UPLOAD_POPUP_VISIBILITY',
      'TOGGLE_INPUT_FOCUS',
    ]),
    openUploadMenu() {
      this.SET_UPLOAD_POPUP_VISIBILITY(true);
    },
    sendTextMessage() {
      this.TOGGLE_INPUT_FOCUS(true);

      this.SEND_MESSAGE({ parts: [{ type: 'text/plain', content: this.text }] });

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
