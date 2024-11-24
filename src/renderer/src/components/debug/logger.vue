<script setup lang="ts">
import { useLogger } from '@renderer/composables/logger'

const { log } = useLogger()
</script>

<template>
  <div
    class="flex items-center px-2 text-sm opacity-80 border border-neutral-700 border-opacity-75 text-neutral-500 bg-neutral-900 bg-opacity-75 rounded-md"
  >
    {{ log }}
  </div>
</template>

<style lang="scss" scoped></style>
