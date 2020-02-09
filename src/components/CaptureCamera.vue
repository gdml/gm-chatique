<template>
  <div v-if="shouldRender" class="gm-chat-capture-camera" @click="handleClick">
    <div class="gm-chat-capture-camera__icon-holder">
      <GmChatIcon class="gm-chat-capture-camera__icon" name="gm-chat-camera" />
    </div>
    <div class="gm-chat-capture-camera__heading">Камера</div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  props: {
    platform: { type: Object, required: true },
  },
  computed: {
    shouldRender() {
      return this.platform.is.cordova;
    },
  },
  methods: {
    ...mapMutations('gmChat/notifications', ['PUSH_NOTIFICATION']),
    async onSuccess(data) {
      const img = document.createElement('img');

      img.src = `data:image/jpeg;base64,${data}`;

      const res = await fetch(img.src);
      const blob = await res.blob();

      blob.lastModifiedDate = new Date();
      blob.name = 'image.jpg';

      this.$emit('change', blob);
    },
    onError(message) {
      this.PUSH_NOTIFICATION({ message, type: 'error' });
    },
    handleClick() {
      navigator.camera.getPicture(this.onSuccess, this.onFail, {
        destinationType: navigator.camera.DestinationType.DATA_URL,
        quality: 60,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.gm-chat-capture-camera {
  --icon-width: 22px;
  --icon-height: auto;
  --icon-max-width: 25px;

  display: flex;
  align-items: center;
  padding: 15px 20px;
  height: 68px;
  cursor: pointer;

  &__icon-holder {
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--icon-max-width);
    margin-right: 15px;
  }

  &__icon {
    width: var(--icon-width);
    height: var(--icon-height);
    max-width: var(--icon-max-width);
  }

  &__heading {
    font-size: 17px;
    line-height: 20px;
  }

  &__input {
    display: none;
  }
}
</style>
