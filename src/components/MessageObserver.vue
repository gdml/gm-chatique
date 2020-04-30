<template>
  <div class="gm-chat-message-observer">
    <div v-if="authorIsShown" class="gm-chat-message-observer__author" v-text="author" />
    <component :is="getComponent" v-if="getComponent" :class="componentClasses" :message="message" />
  </div>
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
    prevMessage: { type: Object, default: null },
  },
  computed: {
    attributes() {
      return this.message.attributes || {};
    },
    prevMessageAttributes() {
      return this.prevMessage ? this.prevMessage.attributes : {};
    },
    author() {
      return this.attributes.senderName || '';
    },
    prevMessageAuthor() {
      return this.prevMessageAttributes.senderName || '';
    },
    authorIsShown() {
      const messageIsFirst = this.message.index === 0;
      const messageIsOwn = this.message.author === `${this.user.id}`;

      if (messageIsFirst || messageIsOwn) return false;

      return this.author !== this.prevMessageAuthor;
    },
    componentClasses() {
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

<style lang="scss" scoped>
.gm-chat-message-observer {
  &__author {
    margin-bottom: 6px;
    font-size: 14px;
  }
}
</style>
