<template>
  <div class="gm-chat-image-message">
    <div class="gm-chat-message__text">
      <img class="gm-chat-image-message__image" :src="message.data.src">
    </div>
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

<style lang="scss" scoped>
.gm-chat-image-message {
  --padding: 0;
  --background-color: transparent;
  --outgoing-background-color: transparent;
  overflow: hidden;

  &__image {
    display: block;
    max-width: 100%;
    max-height: 400px;
    height: auto;
    object-fit: cover;
  }
}
</style>
