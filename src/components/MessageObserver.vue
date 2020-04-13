<template>
  <component :is="getComponent" v-if="getComponent" :class="classes" :message="message" />
</template>

<script>
import TextMessage from './Messages/TextMessage.vue';
import ImageMessage from './Messages/ImageMessage.vue';
import DocumentMessage from './Messages/DocumentMessage.vue';
import UnsupportedMessage from './Messages/UnsupportedMessage.vue';


export default {
  props: {
    user: { type: Object, required: true },
    message: { type: Object, required: true },
  },
  computed: {
    classes() {
      const base = 'gm-chat-message';

      return [
        base,
        this.isOutgoing ? `${base}--outgoing` : '',
      ];
    },
    getComponent() {
      if (this.message.type === 'text') return TextMessage;
      if (this.message.type === 'media') {
        const { contentType } = this.message.media;

        if (contentType.match('^image/*')) return ImageMessage;

        return DocumentMessage;
      }
      return UnsupportedMessage;
    },
    isOutgoing() {
      return this.message.author === String(this.user.id);
    },
  },
};
</script>
