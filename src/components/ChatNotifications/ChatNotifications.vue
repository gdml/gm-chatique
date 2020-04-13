<template>
  <div class="gm-chat-notifications">
    <transition name="gm-chat-notifications__messages-fade">
      <ChatNotificationsMessage v-if="show" heading="Нет подключения к интернету" :subheading="subheading" icon="gm-chat-no-internet" />
      <ChatNotificationsMessage v-if="connecting" heading="Подключение к сети…" subheading="Загрузка сообщений и проверка соединения" spinner />
    </transition>
    <transition-group class="gm-chat-notifications__container" tag="ul" name="gm-chat-notifications__container-fade" :duration="{ enter: 250, leave: 0 }">
      <ChatNotificationsItem v-for="notification in notifications" :key="notification.id" class="gm-chat-notifications__notification" v-bind="notification" />
    </transition-group>
  </div>
</template>

<script>
import dayjs from 'dayjs';

import 'dayjs/locale/ru';

import { mapState, mapGetters } from 'vuex';

import ChatNotificationsMessage from './ChatNotificationsMessage.vue';
import ChatNotificationsItem from './ChatNotificationsItem.vue';

export default {
  components: {
    ChatNotificationsMessage,
    ChatNotificationsItem,
  },
  props: {
    lastMessageDate: { type: String, default: null },
  },
  computed: {
    ...mapState('gmChat', [
      'connected',
      'connecting',
    ]),
    ...mapGetters('gmChat/notifications', ['notifications']),
    show() {
      return !this.connected && !this.connecting;
    },
    date() {
      if (!this.lastMessageDate) return null;

      return dayjs(this.lastMessageDate)
        .locale('ru')
        .format('D MMMM в HH:mm');
    },
    subheading() {
      return this.date ? `Последний раз чат обновлялся ${this.date}` : null;
    },
  },
};
</script>

<style lang="scss" scoped>
.gm-chat-notifications {
  &__messages {
    &-fade {
      &-enter-active,
      &-leave-active {
        transition: opacity 0.2s;
      }
      &-enter,
      &-leave-to {
        opacity: 0;
      }
    }
  }

  &__container {
    padding: 0;
    margin: 0;
    pointer-events: none;

    &-fade {
      &-enter-active,
      &-leave-active {
        transition-duration: 0.3s;
        transition-property: height, opacity;
        transition-timing-function: ease;
        overflow: hidden;
      }

      &-enter,
      &-leave-to {
        opacity: 0
      }
    }
  }

  &__notification {
    border-bottom: 1px solid hsl(0, 0%, 87%);
    pointer-events: all;

    &:last-child {
      border-bottom: none;
    }
  }
}
</style>]
