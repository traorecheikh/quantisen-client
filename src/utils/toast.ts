import {POSITION, useToast} from 'vue-toastification'

const toast = useToast()

export function showApiError(message: string) {
  toast.error(message, {
    timeout: 2000,
    position: POSITION.BOTTOM_RIGHT,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  })
}

