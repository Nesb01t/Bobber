import { ref } from 'vue'
import { useLogger } from './logger'
import dayjs from 'dayjs'

export const CLASSIC_GEAR = 16
export const RETIAL_GEAR = 30

const isRunning = ref(false)
const lootThresold = ref(CLASSIC_GEAR)
const isReloadingTime = ref(false)
const lastReloadTime = ref(dayjs().subtract(1, 'minute'))

export const useHookMan = () => {
  const { log } = useLogger()

  const start = () => {
    isRunning.value = true
    isReloadingTime.value = false
    lastReloadTime.value = dayjs().subtract(1, 'minute')
  }
  const stop = () => {
    isRunning.value = false
    isReloadingTime.value = false
    lastReloadTime.value = dayjs().subtract(1, 'minute')
  }

  const hookManInvokeFn = async (volumeLevel: number) => {
    if (!isRunning.value) {
      log.value = 'HookMan is not running'
      return
    }

    if (isReloadingTime.value) {
      return
    }

    const idleSeconds = dayjs().diff(lastReloadTime.value, 'second')
    log.value = `Volume: ${volumeLevel} / Last Loot: ${idleSeconds}s`

    if (idleSeconds > 30) {
      await lootAndReload()
      return
    }
    if (volumeLevel > lootThresold.value) {
      await lootAndReload()
      return
    }
  }

  const lootAndReload = async () => {
    isReloadingTime.value = true

    // when fish is caught
    log.value = 'Interact to loot'
    pressKey(0xdc) // interact to loot
    await new Promise((resolve) => setTimeout(resolve, 1500)) // wait 1.8s

    // cancelling to ensure running
    log.value = 'Stopcasting if not looted'
    pressKey(0x30) // cancel if not looted
    await new Promise((resolve) => setTimeout(resolve, 1500)) // wait 1.8s

    // restart
    log.value = 'Reload and waiting sound disappear'
    lastReloadTime.value = dayjs() // update last reload time
    pressKey(0x39) // restart
    await new Promise((resolve) => setTimeout(resolve, 3600)) // wait 3.6s
    /**
     * why wait at above?
     * when you load the hook, it will make a sound, wait until the sound disappear
     * so that you can lower the threshold to 15~20 make more efficient
     */

    isReloadingTime.value = false
  }

  // 1 = 0x31
  // 0 = 0x30
  // 9 = 0x39
  // \ = 0xDC
  // esc = 0x1B
  const pressKey = (key) => {
    window.electron.ipcRenderer.invoke('press-key', key)
  }

  return {
    isRunning,
    lootThresold,
    start,
    stop,
    hookManInvokeFn
  }
}
