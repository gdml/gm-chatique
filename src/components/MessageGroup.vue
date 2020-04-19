<template>
  <div v-if="messages.length" class="gm-chat-message-group">
    <div class="gm-chat-message-group__messages">
      <MessageObserver v-for="message in messages" :key="message.id" class="gm-chat-message-group__message" :user="user" :message="message" />
    </div>
    <div class="gm-chat-message-group__time" :class="{ 'gm-chat-message-group__time--outgoing': isOutgoing }" v-text="time" />
  </div>
</template>

<script>
import dayjs from 'dayjs';

import MessageObserver from './MessageObserver.vue';

export default {
  components: {
    MessageObserver,
  },
  props: {
    user: { type: Object, required: true },
    messages: { type: Array, required: true },
  },
  computed: {
    time() {
      return dayjs(this.messages[0].timestamp).format('HH:mm');
    },
    isOutgoing() {
      return this.messages.some((msg) => msg.author === String(this.user.id));
    },
  },
};
</script>

<style lang="scss" scoped>
.gm-chat-message-group {
  display: flex;
  flex-direction: column;

  &__messages {
    width: 100%;
  }

  &__message  + &__message {
    margin-top: 10px;
  }

  &__time {
    color: hsl(0, 0%, 65%);
    font-size: 12px;
    line-height: 24px;

    &--outgoing {
      text-align: right;
    }
  }
}
</style>
