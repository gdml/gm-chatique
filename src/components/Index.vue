<template>
  <div v-if="init">
    Loading...
  </div>
  <Chat v-else :channel-id="channelId" />
</template>

<script>

import { mapState } from 'vuex';

import Chat from './Chat.vue';

export default {
  components: {
    Chat,
  },
  props: {
    channelId: { type: [String, Number], required: true },
  },
  computed: {
    ...mapState('gmChat', ['init']),
  },
};
</script>
