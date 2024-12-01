<script setup lang="ts">
import { onMounted, ref } from 'vue'
import PixelarticonsAnchor from './icons/anchor.vue'
import Close from './icons/close.vue'
import Minus from './icons/minus.vue'
import Downasaur from './icons/downasaur.vue'

const close = () => {
  window.electron.ipcRenderer.send('close')
}

const min = () => {
  window.electron.ipcRenderer.send('minimize')
}

const coreState = ref<boolean>(false)
const coreLoading = ref<boolean>(false)
const reloadCore = async () => {
  coreState.value = false
  coreLoading.value = true
  await new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * 500 + 100)))
  coreState.value = await window.electron.ipcRenderer.invoke('launch-core')
  coreLoading.value = false
}

onMounted(reloadCore)
</script>

<template>
  <div class="titlebar">
    <PixelarticonsAnchor class="b-icon mb-[2px]"></PixelarticonsAnchor>
    <h2 class="title">Bobber</h2>
    <div class="core-state ml-auto mr-4 inline-flex items-center gap-2">
      <span v-if="coreLoading" class="suffix"> 正在启动核心 </span>
      <span v-else class="suffix">
        {{ coreState ? '核心正常' : '核心出错' }}
      </span>
      <Downasaur
        class="hover:text-lg hover:brightness-[1.4] text-sm transition-all duration-150"
        :class="coreState ? 'text-[rgb(73,233,149)]' : 'text-purple-600'"
        @click="reloadCore"
      ></Downasaur>
    </div>

    <div class="flex items-center gap-2">
      <Minus class="b-icon__plain cursor-pointer" @click="min"></Minus>
      <Close class="b-icon__plain cursor-pointer" @click="close"></Close>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.titlebar {
  @apply bg-black w-full gap-2 bg-opacity-25 inline-flex items-end px-[18px] py-[10px] text-neutral-300;

  -webkit-app-region: drag;

  * {
    -webkit-app-region: no-drag;
  }

  .core-state {
    -webkit-app-region: drag;
  }

  .title {
    @apply text-lg select-none text-[17px];
    -webkit-app-region: drag;
  }

  .suffix {
    @apply text-neutral-600 select-none text-[15px] mb-[1px];
    -webkit-app-region: drag;
  }

  .b-icon__plain {
    @apply hover:scale-125 transition-all duration-300 hover:text-purple-500 active:scale-[0.9];
  }
}
</style>
