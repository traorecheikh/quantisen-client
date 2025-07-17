import { POSITION, useToast } from 'vue-toastification'

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

export function showToast(
  message: string,
  type: 'success' | 'error' | 'warning' | 'info' = 'info'
) {
  const options = {
    timeout: 3000,
    position: POSITION.BOTTOM_RIGHT,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  }

  switch (type) {
    case 'success':
      toast.success(message, options)
      break
    case 'error':
      toast.error(message, options)
      break
    case 'warning':
      toast.warning(message, options)
      break
    case 'info':
    default:
      toast.info(message, options)
      break
  }
}
