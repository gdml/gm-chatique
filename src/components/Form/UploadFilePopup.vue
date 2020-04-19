<template>
  <transition name="gm-chat-upload-file-popup-fade">
    <div v-if="isUploadPopupVisible" class="gm-chat-upload-file-popup" @click.self="handleCloseUploadMenu">
      <div class="gm-chat-upload-file-popup__items">
        <FileUploader v-for="uploader in uploaders" :key="uploader.heading" :class="['gm-chat-upload-file-popup__item', `gm-chat-upload-file-popup__item--${uploader.icon}`]" v-bind="uploader" @change="sendFile" />
        <div class="gm-chat-upload-file-popup__cancel">
          <button class="gm-chat-button gm-chat-button--secondary" @click="handleCloseUploadMenu">Отмена</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';

import FileUploader from '../FileUploader.vue';

export default {
  components: {
    FileUploader,
  },
  data() {
    return {
      uploaders: [
        {
          icon: 'gm-chat-image',
          heading: 'Фото',
          accept: 'image/*',
        },
        {
          icon: 'gm-chat-document',
          heading: 'Документ',
          accept: 'application/*',
        },
      ],
    };
  },
  computed: {
    ...mapState('gmChat', ['isUploadPopupVisible']),
  },
  methods: {
    ...mapActions('gmChat', ['SEND_MESSAGE']),
    ...mapMutations('gmChat', ['SET_UPLOAD_POPUP_VISIBILITY']),
    ...mapMutations('gmChat/notifications', ['PUSH_NOTIFICATION']),
    handleCloseUploadMenu() {
      this.SET_UPLOAD_POPUP_VISIBILITY(false);
    },
    async sendFile(file) {
      this.SET_UPLOAD_POPUP_VISIBILITY(false);
      this.PUSH_NOTIFICATION({ type: 'info', message: 'Файл загружается…' });

      const formData = new FormData();
      formData.append('file', file);
      await this.SEND_MESSAGE(formData);

      this.PUSH_NOTIFICATION({ type: 'success', message: 'Файл успешно загружен' });
    },
  },
};
</script>


<style lang="scss" scoped>
.gm-chat-upload-file-popup {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: hsla(0, 0%, 0%, 0.5);
  z-index: var(--gm-chat-z-index--modal);
  opacity: 1;

  &__items {
    background-color: hsl(0, 0%, 100%);
    border-radius: 16px 16px 0px 0px;
    overflow: hidden;
    transition: transform 0.2s;
    transform: var(--items-transform);
  }

  &__item {
    border-bottom: 1px solid hsl(0, 0%, 95%);

    &--gm-chat-image {
      --icon-width: 21px;
    }

    &--gm-chat-document {
      --icon-width: 19px;
    }

    &--gm-chat-camera {
      --icon-width: 24px;
    }
  }

  &__cancel {
    padding: 25px 15px;
  }

  &-fade {
    &-enter-active,
    &-leave-active {
      transition: opacity 0.2s;
    }
    &-enter,
    &-leave-to {
      --items-transform: translate3d(0, 100%, 0);

      opacity: 0;
    }
  }
}
</style>
