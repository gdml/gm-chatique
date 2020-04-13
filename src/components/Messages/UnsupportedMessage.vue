<template>
  <div>
    <div class="gm-chat-message__text">Обновите приложение&nbsp;&mdash; текущая версия не&nbsp;поддерживает новый формат сообщений</div>
  </div>
</template>

<script>
export default {
  props: {
    message: { type: Object, required: true },
  },
};
</script>

<style src="./styles.scss" lang="scss" scoped></style>
