<template>
  <label class="gm-chat-file-uploader">
    <div class="gm-chat-file-uploader__icon-holder">
      <GmChatIcon class="gm-chat-file-uploader__icon" :name="icon" />
    </div>
    <div class="gm-chat-file-uploader__heading" v-text="heading" />
    <input class="gm-chat-file-uploader__input" type="file" :accept="accept" @change="handleChange">
  </label>
</template>

<script>
export default {
  props: {
    icon: { type: String, required: true },
    heading: { type: String, required: true },
    accept: { type: String, required: true },
  },
  methods: {
    handleChange(e) {
      this.$emit('change', e.target.files[0]);
    },
  },
};
</script>

<style lang="scss" scoped>
.gm-chat-file-uploader {
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
