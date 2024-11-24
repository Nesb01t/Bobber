import { ref } from 'vue'

const log = ref('')

export const useLogger = () => {
  return {
    log
  }
}
