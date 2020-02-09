<template>
  <ChatNotificationsMessage :heading="heading" :subheading="subheading" :icon="iconName" :url="url" :type="type" @hide="remove" />
</template>

<script>
import { mapMutations } from 'vuex';

import ChatNotificationsMessage from './ChatNotificationsMessage.vue';

export default {
  components: {
    ChatNotificationsMessage,
  },
  props: {
    id: { type: String, required: true },
    message: { type: String, required: true },
    title: { type: String, required: false, default: null },
    url: { type: String, required: false, default: null },
    duration: { type: Number, default: 4000 },
    type: {
      type: String,
      required: false,
      default: 'info',
      validator: (type) => ['info', 'success', 'error'].includes(type),
    },
  },
  computed: {
    iconName() {
      const icons = {
        info: 'gm-chat-notification',
        success: 'gm-chat-success',
        error: 'gm-chat-error',
      };

      return icons[this.type];
    },
    heading() {
      return this.title || this.message;
    },
    subheading() {
      if (!this.title) return null;

      return this.message;
    },
  },
  mounted() {
    let start;

    const step = (timestamp) => {
      if (!start) {
        start = timestamp;
      }

      if (timestamp - start >= this.duration) return this.remove();

      return window.requestAnimationFrame(step);
    };

    window.requestAnimationFrame(step);
  },
  methods: {
    ...mapMutations('gmChat/notifications', ['DELETE_NOTIFICATION']),
    remove() {
      this.DELETE_NOTIFICATION({ id: this.id });
    },
  },
};
</script>
