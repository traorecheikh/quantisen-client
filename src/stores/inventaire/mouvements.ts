import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { InventaireService } from '../../api/features/inventaire/services/inventaireService'
import { BoissonService } from '../../api/features/boisson/services/boissonService'
import type { Lot } from '../../api/features/inventaire/models/lotModel'
import type { Boisson } from '../../api/features/boisson/models/boisson'
import type { LigneOperation } from '../../api/features/inventaire/models/ligneOperation'
import type { PaginatedResponse } from '../../api/models/paginatedResponse'

export const useMouvementsStore = defineStore('mouvements', () => {
  // State
  const boissons = ref<Boisson[]>([])
  const lots = ref<Lot[]>([])
  const mouvements = ref<LigneOperation[]>([])
  const paginatedLigneOperations = ref<PaginatedResponse<LigneOperation>>({
    data: [],
    page: 1,
    size: 20,
    total: 0
  })
  const loading = ref(false)
  const error = ref('')
  const filters = ref({
    type: '',
    beverage: '',
    dateFrom: '',
    dateTo: ''
  })

  const totalMovements = computed(() => paginatedLigneOperations.value.total)
  const todayMovements = computed(() =>
    paginatedLigneOperations.value.data.filter(op => {
      const today = new Date().toISOString().slice(0, 10)
      return op.mouvement?.dateMouvement?.slice(0, 10) === today
    }).length
  )

  async function fetchBoissons() {
    try {
      boissons.value = await BoissonService.getAllBeverages()
    } catch (e: any) {
      error.value = e.message || 'Erreur lors du chargement des boissons.'
    }
  }

  async function fetchLots() {
    try {
      lots.value = await InventaireService.getAllLots()
    } catch (e: any) {
      error.value = e.message || 'Erreur lors du chargement des lots.'
    }
  }

  async function loadLigneOperations(page = 1, size = 20, forceRefresh = false) {
    loading.value = true
    error.value = ''
    // Only fetch if cache is empty or forceRefresh is true
    if (!forceRefresh && paginatedLigneOperations.value.data.length > 0 && paginatedLigneOperations.value.page === page && paginatedLigneOperations.value.size === size) {
      loading.value = false
      return paginatedLigneOperations.value
    }
    try {
      paginatedLigneOperations.value = await InventaireService.getAllLigneOperationsPaginated(page, size)
    } catch (e: any) {
      error.value = e.message || "Erreur lors du chargement de l'historique"
    } finally {
      loading.value = false
    }
    return paginatedLigneOperations.value
  }

  function clearError() {
    error.value = ''
  }

  function clearCache() {
    paginatedLigneOperations.value = { data: [], page: 1, size: 20, total: 0 }
    mouvements.value = []
    lots.value = []
    boissons.value = []
  }

  return {
    boissons,
    lots,
    mouvements,
    paginatedLigneOperations,
    loading,
    error,
    filters,
    totalMovements,
    todayMovements,
    fetchBoissons,
    fetchLots,
    loadLigneOperations,
    clearError,
    clearCache
  }
})
