<template>
  <ChatNotificationsMessage v-if="init" heading="Подключение к сети…" subheading="Загрузка сообщений и проверка соединения" spinner />
  <Chat v-else :channel-id="channelId" />
</template>

<script>

import { mapState } from 'vuex';

import Chat from './Chat.vue';
import ChatNotificationsMessage from './ChatNotifications/ChatNotificationsMessage.vue';

export default {
  components: {
    Chat,
    ChatNotificationsMessage,
  },
  props: {
    channelId: { type: [String, Number], required: true },
  },
  computed: {
    ...mapState('gmChat', ['init']),
  },
};
</script>
