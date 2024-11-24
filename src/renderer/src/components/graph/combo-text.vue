<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

const props = defineProps<{
  value: number
}>()

const opacityClass = computed(() => {
  switch (state.value) {
    case ComboState.Quiet:
      return 'opacity-70'
    case ComboState.Maximum:
      return 'opacity-100'
    default:
      return 'opacity-0'
  }
})

const text = computed(() => {
  switch (state.value) {
    case ComboState.Quiet:
      return 'quiet~'
    case ComboState.Maximum:
      return 'MAXIMUM!!!'
    default:
      return 'normal'
  }
})

enum ComboState {
  Quiet,
  Normal,
  Maximum
}
const state = ref<ComboState>(ComboState.Normal)
const updateState = () => {
  const value = props.value
  if (value > 85) {
    state.value = ComboState.Maximum
  } else if (value < 15) {
    state.value = ComboState.Quiet
  } else {
    state.value = ComboState.Normal
  }
}

onMounted(() => {
  const interval = setInterval(() => {
    updateState()
  }, 1000)

  return () => {
    clearInterval(interval)
  }
})
</script>

<template>
  <div :class="opacityClass" class="combo">{{ text }}</div>
</template>

<style lang="scss" scoped>
.combo {
  @apply bg-clip-text transition-all duration-150 text-transparent bg-gradient-to-br from-purple-500 to-cyan-200 font-semibold text-[20px];
  animation:
    breathing 3s ease-in-out infinite,
    rotating 5s ease-in-out infinite;
}
@keyframes breathing {
  0%,
  100% {
    scale: 0.9;
  }
  50% {
    scale: 1.1;
  }
}

@keyframes rotating {
  0% {
    rotate: -5deg;
  }
  50% {
    rotate: 5deg;
  }
  100% {
    rotate: -5deg;
  }
}
</style>
