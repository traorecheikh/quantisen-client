import { ref } from 'vue'
import { defineStore } from 'pinia'
import { BoissonService } from '../api'
import type { Boisson } from '../api'

export const useBoissonStore = defineStore('boisson', () => {
  const boissons = ref<Boisson[] | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchBoissons(forceRefresh = false) {
    if (boissons.value && !forceRefresh) return boissons.value
    isLoading.value = true
    error.value = null
    try {
      const data = await BoissonService.getAllBeverages()
      boissons.value = data
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch beverages.'
      return null
    } finally {
      isLoading.value = false
    }
  }

  function clearCache() {
    boissons.value = null
  }

  return {
    boissons,
    isLoading,
    error,
    fetchBoissons,
    clearCache
  }
})

