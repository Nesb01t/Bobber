<script setup lang="ts">
import DeviceSelect from './components/device-select.vue'
import PeakGraph from './components/peak-graph.vue'
import Titlebar from './components/titlebar.vue'
</script>

<template>
  <div class="w-full h-full">
    <Titlebar></Titlebar>
    <main class="px-5 py-4 flex h-full flex-col gap-4 items-start max-h-[450px]">
      <div class="flex w-full gap-3">
        <DeviceSelect></DeviceSelect>
      </div>
      <PeakGraph class="flex-1"></PeakGraph>
    </main>
  </div>
</template>

<style lang="scss"></style>
