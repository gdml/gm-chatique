<template>
  <component :is="getComponent" v-if="getComponent" :class="classes" :message="message" :platform="platform" />
</template>

<script>
import get from 'lodash.get';

import TextMessage from './Messages/TextMessage.vue';
import ImageMessage from './Messages/ImageMessage.vue';
import DocumentMessage from './Messages/DocumentMessage.vue';
import UnsupportedMessage from './Messages/UnsupportedMessage.vue';


export default {
  props: {
    user: { type: Object, required: true },
    message: { type: Object, required: true },
    platform: { type: Object, required: true },
  },
  data() {
    return {
      componentsMap: {
        '^text/plain$': TextMessage,
        '^image/*': ImageMessage,
        '^application/*': DocumentMessage,
      },
    };
  },
  computed: {
    classes() {
      const base = 'gm-chat-message';

      return [
        base,
        this.isOutgoing ? `${base}--outgoing` : '',
      ];
    },
    getComponent() {
      const component = Object
        .keys(this.componentsMap)
        .filter((regexp) => get(this.message, 'data.type', '').match(regexp))[0];

      return this.componentsMap[component] || UnsupportedMessage;
    },
    isOutgoing() {
      return this.message.author === String(this.user.id);
    },
  },
};
</script>
