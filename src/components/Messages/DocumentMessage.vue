<template>
  <a :href="message.media.url" class="gm-chat-message--document" download>
    <div class="gm-chat-message__text" v-text="message.media.filename" />
    <div class="gm-chat-message__subtext" v-text="size" />
    <div class="gm-chat-message__readmore-holder">
      <GmChatIcon class="gm-chat-message__readmore-icon" name="gm-chat-chevron-next" />
    </div>
  </a>
</template>

<script>
import filesize from 'filesize';

export default {
  props: {
    message: { type: Object, required: true },
  },
  computed: {
    size() {
      return filesize(this.message.media.size, { locale: 'ru' });
    },
  },
};
</script>

<style src="./styles.scss" lang="scss" scoped></style>
