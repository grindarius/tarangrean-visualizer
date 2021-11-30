import { Ref, ref } from 'vue'

interface UseError {
  errorMessage: Ref<string>
  createError: (message: string) => void
}

export const useError = (): UseError => {
  const errorMessage: Ref<string> = ref('')

  const createError = (message: string): void => {
    errorMessage.value = message
    setTimeout(() => {
      errorMessage.value = ''
    }, 1500)
  }

  return {
    errorMessage,
    createError
  }
}
