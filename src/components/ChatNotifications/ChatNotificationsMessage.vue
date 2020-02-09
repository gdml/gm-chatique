<template>
  <div :class="classes" @click="handleClick">
    <div v-if="icon || spinner" class="gm-chat-notifications-message__icon-holder">
      <GmChatIcon v-if="icon" class="gm-chat-notifications-message__icon" :name="icon" />
      <GmChatIcon v-else-if="spinner" class="gm-chat-notifications-message__icon gm-chat-notifications-message__icon--loader" name="gm-chat-loader" />
    </div>
    <div class="gm-chat-notifications-message__body">
      <p v-if="heading" class="gm-chat-notifications-message__heading" v-text="heading" />
      <p v-if="subheading" class="gm-chat-notifications-message__subheading" v-text="subheading" />
    </div>
    <div v-if="url" class="gm-chat-notifications-message__arrow-holder">
      <GmChatIcon class="gm-chat-notifications-message__arrow" name="gm-chat-chevron-next" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    icon: { type: String, default: null },
    heading: { type: String, default: null },
    subheading: { type: String, default: null },
    spinner: { type: Boolean, default: false },
    url: { type: String, default: null },
    type: { type: String, default: 'info', validator: (type) => ['info', 'success', 'error'].includes(type) },
  },
  computed: {
    classes() {
      return [
        'gm-chat-notifications-message',
        `gm-chat-notifications-message--${this.type}`,
      ];
    },
  },
  methods: {
    handleClick() {
      if (!this.url) return;

      this.$router.push({ path: this.url });

      this.$emit('hide');
    },
  },
};
</script>


<style lang="scss" scoped>
.gm-chat-notifications-message {
  --color: hsl(0, 0%, 100%);
  --background-color: hsl(0, 0%, 13%);
  --second-color: hsl(0, 0%, 65%);

  position: relative;
  display: flex;
  padding: 10px 15px;
  color: var(--color);
  background-color: var(--background-color);
  height: 60px;
  flex-shrink: 0;
  z-index: var(--gm-chat-z-index--sticky);

  &__icon-holder {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 14px;
    flex-shrink: 0;
  }

  &__icon {
    display: block;
    width: 20px;
    height: 20px;

    &--loader {
      animation: fa-spin 1s 0s infinite linear;
    }
  }

  &__body {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
  }

  &__heading {
    margin: 0;
    font-size: 17px;
    line-height: 20px;
  }

  &__subheading {
    margin: 0;
    font-size: 13px;
    line-height: 16px;
    color: var(--second-color);
  }

  &__arrow-holder {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    flex-shrink: 0;
    color: var(--second-color);
  }

  &__arrow {
    width: 7px;
    height: auto;
  }

  &--error {
    --background-color: hsl(0, 99%, 65%);
    --second-color: hsla(0, 0%, 100%, 0.5);
  }
}
</style>
