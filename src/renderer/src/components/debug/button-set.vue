<script setup lang="ts">
const onClick = () => {
  window.electron.ipcRenderer.invoke('press-key', 0x31)
}
</script>

<template>
  <div class="button-set">
    <button @click="onClick">按下 1 键</button>
  </div>
</template>

<style lang="scss" scoped>
.button-set {
  @apply flex gap-3;
  button {
    @apply px-6 py-2 shadow-md bg-neutral-800 transition-all duration-300 hover:scale-[103%] text-white rounded-md;

    &:hover {
      @apply bg-neutral-700;
    }
    &:active {
      @apply bg-neutral-800 scale-[100%];
    }
  }
}
</style>
