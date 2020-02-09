<template>
  <div class="gm-chat-message">
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div class="gm-chat-message__text" v-html="withClickableLinks" />
  </div>
</template>

<script>
import MessageLibrary from '../../helpers/message_library';

export default {
  props: {
    message: { type: Object, required: true },
  },
  computed: {
    withClickableLinks() {
      return MessageLibrary.withLinks(this.message.data.content);
    },
  },
};
</script>

<style src="./styles.scss" lang="scss" scoped></style>

<style lang="scss">
.gm-chat-message-link {
  color: hsl(230, 78%, 51%);
}
</style>
