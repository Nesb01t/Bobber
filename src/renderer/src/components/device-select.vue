<script setup lang="ts">
import { onMounted, ref } from 'vue'

interface DeviceInfo {
  list: string[]
  selectedIdx: number
  count: number
}
const loading = ref(true)
const deviceInfo = ref<DeviceInfo>()
const getDeviceInfo = async () => {
  loading.value = true
  deviceInfo.value = await window.electron.ipcRenderer.invoke('get-device-info')
  loading.value = false
}

const onSelectChange = (event) => {
  const idx = event.target.value
  selectDevice(idx)
}

const selectDevice = async (idx: number) => {
  await window.electron.ipcRenderer.invoke('select-device', idx)
  getDeviceInfo()
}

onMounted(async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  getDeviceInfo()
})
</script>

<template>
  <section class="flex items-center gap-3">
    <span class="text-neutral-300 text-[15px]">音频通道</span>
    <select
      :class="loading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'"
      class="rounded-lg shadow-md w-[240px] bg-neutral-800 px-2 py-1 focus:outline-neutral-800 outline-none transition-all duration-300"
      @change="onSelectChange($event)"
    >
      <template v-if="deviceInfo">
        <option v-for="(d, idx) in deviceInfo.list" :key="idx" :value="idx">
          {{ d }}
        </option>
      </template>

      <template v-else>
        <option>Core Loading...</option>
      </template>
    </select>
  </section>
</template>

<style lang="scss" scoped></style>
