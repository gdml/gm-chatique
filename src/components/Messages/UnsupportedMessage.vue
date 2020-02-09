<template>
  <div>
    <div class="gm-chat-message__text">Обновите приложение&nbsp;&mdash; текущая версия не&nbsp;поддерживает новый формат сообщений</div>
    <a v-if="link" :href="link" class="gm-chat-button gm-chat-message__action">Обновить приложение</a>
  </div>
</template>

<script>
export default {
  props: {
    message: { type: Object, required: true },
    platform: { type: Object, required: true },
  },
  computed: {
    link() {
      if (this.platform.is.android) return 'https://play.google.com/';
      if (this.platform.is.ios) return 'https://www.apple.com/ios/app-store/';

      return null;
    },
  },
};
</script>

<style src="./styles.scss" lang="scss" scoped></style>
