<script setup lang="ts">
import Stopped from '../icons/stopped.vue'
import Running from '../icons/running.vue'
import { useHookMan } from '@renderer/composables/hook-man'

const { isRunning, start, stop } = useHookMan()
</script>

<template>
  <div v-if="isRunning" class="runtime border-green-300" @click="stop">
    <Running class="text-lg mt-[1px] text-green-400"></Running>
    <div>运行中</div>
  </div>
  <div v-else class="runtime border-orange-300" @click="start">
    <Stopped class="text-lg mt-[2px] text-yellow-400"></Stopped>
    <div>未开始</div>
  </div>
</template>

<style lang="scss" scoped>
.runtime {
  @apply flex transition-all border border-opacity-50 select-none hover:brightness-[1.1] duration-300 items-center gap-[6px] bg-neutral-800 rounded-md px-[19px] py-[10px] text-neutral-300 cursor-pointer hover:scale-[103%];

  &:active {
    @apply scale-[100%] bg-neutral-700;
  }
}
</style>
