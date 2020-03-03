<template>
  <div class="gm-chat-input">
    <div ref="chatInput" class="gm-chat-input__field" contenteditable role="textbox" aria-multiline @keydown.shift.enter.prevent="$emit('submit')" v-on="listeners" />
    <div v-show="showPlaceholder" class="gm-chat-input__placeholder" v-text="placeholder" />
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';

export default {
  props: {
    value: { type: String, default: '' },
    placeholder: { type: String, default: '' },
  },
  computed: {
    ...mapState('gmChat', ['isInputFocused']),
    showPlaceholder() {
      return this.value === '';
    },
    listeners() {
      return {
        ...this.$listeners,
        input: this.onInput,
        blur: this.onBlur,
      };
    },
  },
  watch: {
    value(val) {
      if (val) return;

      this.setValue('');
    },
    isInputFocused(val) {
      if (val) {
        this.focus();
      } else {
        this.blur();
      }
    },
  },
  async mounted() {
    await this.$nextTick();

    this.setValue(this.value);
    this.focus();
    this.setSelectionRange(this.value.length, this.value.length);

    this.TOGGLE_INPUT_FOCUS(true);
  },
  methods: {
    ...mapMutations('gmChat', ['TOGGLE_INPUT_FOCUS']),
    normalizeValue(val) {
      // return val ? val.trim() : '';
      return val || '';
    },
    setValue(val) {
      this.$refs.chatInput.textContent = val;
    },
    setSelectionRange(positionStart, positionEnd) {
      const el = this.$refs.chatInput;

      if (!document || !el) return;

      const range = document.createRange();
      const selection = document.getSelection();

      const textNode = el.childNodes.item('text');

      if (!textNode) return;

      range.selectNode(el);
      range.setStart(textNode, positionStart || 0);
      range.setEnd(textNode, positionEnd || 0);

      selection.removeAllRanges();
      selection.addRange(range);
    },
    focus() {
      const el = this.$refs.chatInput;

      if (!el) return;

      el.focus();
    },
    blur() {
      const el = this.$refs.chatInput;

      if (!el) return;

      el.blur();
    },
    onBlur() {
      this.TOGGLE_INPUT_FOCUS(false);
    },
    onInput(e) {
      this.$emit('input', this.normalizeValue(e.target.textContent));
    },
  },
};
</script>

<style lang="scss" scoped>
.gm-chat-input {
  position: relative;
  width: 100%;
  background-color: transparent;
  font-size: 18px;
  line-height: 21px;
  overflow: hidden;
  border-radius: 20px;
  border: 1px solid hsl(0, 0%, 81%);

  &__field {
    padding: 10px 15px;
    outline: none;
    color: hsl(0, 0%, 13%);
    max-height: 200px;
    overflow-y: auto;
  }

  &__placeholder {
    padding: 10px 15px;
    display: block;
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    color: hsl(0, 0%, 65%);
    pointer-events: none;
  }
}
</style>
