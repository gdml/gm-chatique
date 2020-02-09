<template>
  <button class="gm-chat-send-button">
    <GmChatIcon name="gm-chat-arrow-right" />
  </button>
</template>

<style lang="scss" scoped>
.gm-chat-send-button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 42px;
  height: 42px;
  padding: 0;
  margin: 0;
  outline: none;
  border: none;
  background-color: hsl(0, 0%, 13%);
  transition: background-color 0.1s ease-in-out;
  border-radius: 100%;
  color: hsl(0, 0%, 100%);
  cursor: pointer;

  &:active {
    background-color: hsl(0, 0%, 0%);
  }

  &:disabled {
    background-color: hsl(0, 0%, 81%);
  }
}
</style>
