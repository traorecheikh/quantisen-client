<template>
  <div class="movements-page">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-text">
          <h1 class="page-title">Mouvements de Stock</h1>
          <p class="page-subtitle">Gérer toutes les entrées et sorties de stock</p>
        </div>
        <div class="header-actions">
          <button
            class="add-btn success"
            @click="openAddModal('ENTREE')"
          >
            <ArrowDownIcon class="w-4 h-4" />
            Entrée de Stock
          </button>
          <button
            class="add-btn error"
            @click="openAddModal('SORTIE')"
          >
            <ArrowUpIcon class="w-4 h-4" />
            Sortie de Stock
          </button>
          <button
            class="add-btn warning"
            @click="openAddModal('AJUSTEMENT')"
          >
            <PencilIcon class="w-4 h-4" />
            Ajustement
          </button>
        </div>
      </div>
    </div>

    <!-- Movement Type Tabs -->
    <div class="tabs-section">
      <div class="tabs-container">
        <button
          class="tab-button"
          :class="{ active: activeTab === 'single' }"
          @click="activeTab = 'single'"
        >
          <div class="tab-content">
            <PlusIcon class="tab-icon" />
            <span>Mouvement Simple</span>
          </div>
        </button>
        <button
          class="tab-button"
          :class="{ active: activeTab === 'batch' }"
          @click="activeTab = 'batch'"
        >
          <div class="tab-content">
            <DocumentIcon class="tab-icon" />
            <span>Mouvement en Lot</span>
          </div>
        </button>
        <button
          class="tab-button"
          :class="{ active: activeTab === 'csv' }"
          @click="activeTab = 'csv'"
        >
          <div class="tab-content">
            <ArrowUpOnSquareIcon class="tab-icon" />
            <span>Import CSV</span>
          </div>
        </button>
        <button
          class="tab-button"
          :class="{ active: activeTab === 'history' }"
          @click="activeTab = 'history'"
        >
          <div class="tab-content">
            <ClockIcon class="tab-icon" />
            <span>Historique</span>
          </div>
        </button>
      </div>
    </div>

    <!-- Single Movement Form -->
    <div v-if="activeTab === 'single'" class="form-section">
      <div class="form-container">
        <h3>Enregistrer un Mouvement</h3>
        <form @submit.prevent="submitSingleMovement" class="movement-form">
          <div class="form-grid">
            <div class="form-group">
              <label>Type de Mouvement *</label>
              <select v-model="singleMovement.typeMouvement" required class="form-select">
                <option value="">Sélectionner le type</option>
                <option value="ENTREE">Entrée</option>
                <option value="SORTIE">Sortie</option>
                <option value="AJUSTEMENT">Ajustement</option>
              </select>
            </div>

            <div class="form-group">
              <label>Boisson *</label>
              <select v-model="singleMovement.boissonId" required class="form-select">
                <option value="">Sélectionner une boisson</option>
                <option v-for="beverage in beverages" :key="beverage.id" :value="beverage.id">
                  {{ beverage.nom }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label>Lot *</label>
              <select v-model="singleMovement.lotId" required class="form-select">
                <option value="">Sélectionner un lot</option>
                <option v-for="lot in availableLots" :key="lot.id" :value="lot.id">
                  {{ lot.numeroLot }} ({{ lot.quantiteActuelle }} disponible)
                </option>
              </select>
            </div>

            <div class="form-group">
              <label>Quantité *</label>
              <input
                v-model.number="singleMovement.quantite"
                type="number"
                min="1"
                required
                class="form-input"
                placeholder="Quantité"
              />
            </div>

            <!-- Adjustment Type (only for AJUSTEMENT) -->
            <div v-if="singleMovement.typeMouvement === 'AJUSTEMENT'" class="form-group">
              <label>Type d'Ajustement *</label>
              <select v-model="singleMovement.typeAjustement" required class="form-select">
                <option value="">Sélectionner le type</option>
                <option value="CASSE">Casse</option>
                <option value="VOL">Vol</option>
                <option value="PERTE">Perte</option>
                <option value="RETOUR_CLIENT">Retour Client</option>
              </select>
            </div>

            <!-- Reason (for AJUSTEMENT and returns) -->
            <div v-if="singleMovement.typeMouvement === 'AJUSTEMENT' || isReturn" class="form-group full-width">
              <label>Raison {{ singleMovement.typeMouvement === 'AJUSTEMENT' ? '*' : '' }}</label>
              <textarea
                v-model="singleMovement.raison"
                :required="singleMovement.typeMouvement === 'AJUSTEMENT'"
                class="form-textarea"
                placeholder="Expliquez la raison du mouvement..."
                rows="3"
              ></textarea>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn btn-secondary" @click="resetSingleForm">
              Réinitialiser
            </button>
            <button type="submit" class="btn btn-success" :disabled="isSubmitting">
              {{ isSubmitting ? 'Enregistrement...' : 'Enregistrer le Mouvement' }}
            </button>
          </div>
        </form>

        <!-- Quick Actions -->
        <div class="quick-actions">
          <h4>Actions Rapides</h4>
          <div class="quick-buttons">
            <button class="btn btn-outline-warning" @click="setupReturnMovement">
              <ReturnIcon class="w-4 h-4" />
              Enregistrer un Retour
            </button>
            <button class="btn btn-outline-danger" @click="setupAdjustmentMovement">
              <AdjustmentIcon class="w-4 h-4" />
              Enregistrer un Ajustement
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Batch Movement Form -->
    <div v-if="activeTab === 'batch'" class="form-section">
      <div class="form-container">
        <h3>Mouvements en Lot</h3>
        <div class="batch-header">
          <button class="btn btn-primary" @click="addBatchMovement">
            <PlusIcon class="w-4 h-4" />
            Ajouter un Mouvement
          </button>
          <button
            class="btn btn-success"
            @click="submitBatchMovements"
            :disabled="batchMovements.length === 0 || isSubmitting"
          >
            Enregistrer Tous ({{ batchMovements.length }})
          </button>
        </div>

        <div class="batch-movements">
          <div
            v-for="(movement, index) in batchMovements"
            :key="index"
            class="batch-movement-item"
          >
            <div class="movement-header">
              <span class="movement-number">Mouvement #{{ index + 1 }}</span>
              <button
                class="btn btn-sm btn-danger"
                @click="removeBatchMovement(index)"
              >
                <TrashIcon class="w-4 h-4" />
              </button>
            </div>

            <div class="movement-form-grid">
              <select v-model="movement.typeMouvement" class="form-select">
                <option value="">Type</option>
                <option value="ENTREE">Entrée</option>
                <option value="SORTIE">Sortie</option>
                <option value="AJUSTEMENT">Ajustement</option>
              </select>

              <select v-model="movement.boissonId" class="form-select">
                <option value="">Boisson</option>
                <option v-for="beverage in beverages" :key="beverage.id" :value="beverage.id">
                  {{ beverage.nom }}
                </option>
              </select>

              <select v-model="movement.lotId" class="form-select">
                <option value="">Lot</option>
                <option v-for="lot in lots" :key="lot.id" :value="lot.id">
                  {{ lot.numeroLot }}
                </option>
              </select>

              <input
                v-model.number="movement.quantite"
                type="number"
                placeholder="Quantité"
                class="form-input"
              />

              <select
                v-if="movement.typeMouvement === 'AJUSTEMENT'"
                v-model="movement.typeAjustement"
                class="form-select"
              >
                <option value="">Type d'ajustement</option>
                <option value="CASSE">Casse</option>
                <option value="VOL">Vol</option>
                <option value="PERTE">Perte</option>
                <option value="RETOUR_CLIENT">Retour Client</option>
              </select>
            </div>

            <input
              v-if="movement.typeMouvement === 'AJUSTEMENT'"
              v-model="movement.raison"
              type="text"
              placeholder="Raison de l'ajustement"
              class="form-input full-width"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- CSV Import -->
    <div v-if="activeTab === 'csv'" class="form-section">
      <div class="form-container">
        <h3>Import CSV</h3>
        <div class="csv-upload">
          <div class="upload-area" @dragover.prevent @drop="handleCsvDrop">
            <input
              ref="csvFileInput"
              type="file"
              accept=".csv"
              @change="handleCsvUpload"
              style="display: none"
            />
            <div class="upload-content">
              <DocumentIcon class="upload-icon" />
              <p>Glissez-déposez votre fichier CSV ou <button @click="$refs.csvFileInput.click()" class="upload-link">cliquez ici</button></p>
              <p class="upload-help">Format: nom_boisson, numero_lot, quantite, type_mouvement, type_ajustement, raison</p>
            </div>
          </div>

          <div v-if="csvData.length > 0" class="csv-preview">
            <h4>Aperçu des données ({{ csvData.length }} mouvements)</h4>
            <div class="csv-table">
              <table>
                <thead>
                  <tr>
                    <th>Boisson</th>
                    <th>Lot</th>
                    <th>Quantité</th>
                    <th>Type</th>
                    <th>Ajustement</th>
                    <th>Raison</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, index) in csvData.slice(0, 5)" :key="index">
                    <td>{{ row.beverageName }}</td>
                    <td>{{ row.lotNumber }}</td>
                    <td>{{ row.quantity }}</td>
                    <td>{{ row.movementType }}</td>
                    <td>{{ row.adjustmentType || '-' }}</td>
                    <td>{{ row.reason || '-' }}</td>
                  </tr>
                </tbody>
              </table>
              <p v-if="csvData.length > 5" class="preview-note">
                Et {{ csvData.length - 5 }} autres mouvements...
              </p>
            </div>

            <div class="csv-actions">
              <button class="btn btn-secondary" @click="clearCsvData">
                Annuler
              </button>
              <button class="btn btn-primary" @click="processCsvImport" :disabled="isSubmitting">
                {{ isSubmitting ? 'Import en cours...' : 'Importer les Mouvements' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Movement History -->
    <div v-if="activeTab === 'history'" class="table-section">
      <div class="filters-section">
        <div class="filters">
          <select v-model="historyFilter.type" class="form-select">
            <option value="">Tous les types</option>
            <option value="ENTREE">Entrées</option>
            <option value="SORTIE">Sorties</option>
            <option value="AJUSTEMENT">Ajustements</option>
          </select>

          <select v-model="historyFilter.beverage" class="form-select">
            <option value="">Toutes les boissons</option>
            <option v-for="beverage in beverages" :key="beverage.id" :value="beverage.id">
              {{ beverage.nom }}
            </option>
          </select>

          <input
            v-model="historyFilter.dateFrom"
            type="date"
            class="form-input"
            placeholder="Date de début"
          />

          <input
            v-model="historyFilter.dateTo"
            type="date"
            class="form-input"
            placeholder="Date de fin"
          />
        </div>
      </div>

      <div class="table-container">
        <table class="movements-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Boisson</th>
              <th>Lot</th>
              <th>Quantité</th>
              <th>Utilisateur</th>
              <th>Raison</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="movement in filteredMovements" :key="movement.id">
              <td>{{ formatDate(movement.dateCreation) }}</td>
              <td>
                <span class="movement-badge" :class="movement.typeMouvement.toLowerCase()">
                  {{ getMovementTypeLabel(movement.typeMouvement) }}
                </span>
              </td>
              <td>{{ getBeverageName(movement.boissonId) }}</td>
              <td>{{ getLotNumber(movement.lotId) }}</td>
              <td>{{ movement.quantite }}</td>
              <td>{{ getUserName(movement.utilisateurId) }}</td>
              <td>{{ movement.raison || '-' }}</td>
              <td>
                <button class="btn btn-sm btn-outline-primary">
                  <EyeIcon class="w-4 h-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Success/Error Messages -->
    <div v-if="message" class="message" :class="messageType">
      {{ message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  ArrowDownIcon,
  ArrowUpIcon,
  PencilIcon,
  XMarkIcon,
  PlusIcon,
  DocumentIcon,
  EyeIcon,
  TrashIcon,
  ArrowUpOnSquareIcon,
  ClockIcon
} from '@heroicons/vue/24/outline'
import { MovementService } from '../api/features/movement/services/movementService'
import { BeverageService } from '../api/features/beverage/services/beverageService'
import { LotService } from '../api/features/lot/services/lotService'
import { UserService } from '../api/features/users/services/userService'
import type {
  CreateMovementRequest,
  Movement,
  MovementType,
  AdjustmentType,
  MovementCSVRow
} from '../api/features/movement/models/movementModel'
import type { Beverage } from '../api/features/beverage/models/beverageModel'
import type { Lot } from '../api/features/lot/models/lotModel'
import type { User } from '../api/features/users/models/userModel'

// Reactive state
const activeTab = ref<'single' | 'batch' | 'csv' | 'history'>('single')
const isSubmitting = ref(false)
const message = ref('')
const messageType = ref<'success' | 'error'>('success')

// Data
const beverages = ref<Beverage[]>([])
const lots = ref<Lot[]>([])
const users = ref<User[]>([])
const movements = ref<Movement[]>([])

// Single movement form
const singleMovement = ref<CreateMovementRequest>({
  boissonId: 0,
  lotId: 0,
  quantite: 0,
  typeMouvement: '' as MovementType,
  typeAjustement: undefined,
  raison: '',
  utilisateurId: 0
})

const isReturn = ref(false)

// Batch movements
const batchMovements = ref<CreateMovementRequest[]>([])

// CSV import
const csvData = ref<MovementCSVRow[]>([])
const csvFileInput = ref<HTMLInputElement>()

// History filters
const historyFilter = ref({
  type: '',
  beverage: '',
  dateFrom: '',
  dateTo: ''
})

// Computed properties
const availableLots = computed(() => {
  if (!singleMovement.value.boissonId) return []
  return lots.value.filter(lot =>
    lot.boissonId === singleMovement.value.boissonId &&
    lot.quantiteActuelle > 0
  )
})

const filteredMovements = computed(() => {
  let filtered = movements.value

  if (historyFilter.value.type) {
    filtered = filtered.filter(m => m.typeMouvement === historyFilter.value.type)
  }

  if (historyFilter.value.beverage) {
    filtered = filtered.filter(m => m.boissonId.toString() === historyFilter.value.beverage)
  }

  if (historyFilter.value.dateFrom) {
    filtered = filtered.filter(m =>
      new Date(m.dateCreation) >= new Date(historyFilter.value.dateFrom)
    )
  }

  if (historyFilter.value.dateTo) {
    filtered = filtered.filter(m =>
      new Date(m.dateCreation) <= new Date(historyFilter.value.dateTo)
    )
  }

  return filtered.sort((a, b) =>
    new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime()
  )
})

// Methods

// Load initial data
const loadData = async () => {
  try {
    const [beveragesData, lotsData, usersData] = await Promise.all([
      BeverageService.getAllBeverages(),
      LotService.getAllLots(),
      UserService.getAllUsers()
    ])

    beverages.value = beveragesData
    lots.value = lotsData
    users.value = usersData

    // Load current user's movements
    const currentUserId = getCurrentUserId()
    if (currentUserId) {
      movements.value = await MovementService.getMovementsByUser(currentUserId)
    }
  } catch (error) {
    showMessage('Erreur lors du chargement des données', 'error')
  }
}

const getCurrentUserId = (): number => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  return user.id || 1 // Default to 1 if no user found
}

// Single movement methods
const submitSingleMovement = async () => {
  if (!validateSingleMovement()) return

  isSubmitting.value = true
  try {
    singleMovement.value.utilisateurId = getCurrentUserId()

    let result: Movement

    if (isReturn.value) {
      // Use the return endpoint
      result = await MovementService.recordReturn(
        singleMovement.value,
        singleMovement.value.raison || 'Retour produit'
      )
    } else if (singleMovement.value.typeMouvement === 'AJUSTEMENT') {
      // Use the adjustment endpoint
      result = await MovementService.recordAdjustment(
        singleMovement.value,
        singleMovement.value.raison || 'Ajustement de stock'
      )
    } else {
      // Use the regular movement endpoint
      result = await MovementService.recordMovement(singleMovement.value)
    }

    movements.value.unshift(result)
    resetSingleForm()
    showMessage('Mouvement enregistré avec succès', 'success')
  } catch (error) {
    showMessage('Erreur lors de l\'enregistrement du mouvement', 'error')
  } finally {
    isSubmitting.value = false
  }
}

const validateSingleMovement = (): boolean => {
  if (!singleMovement.value.typeMouvement) {
    showMessage('Veuillez sélectionner un type de mouvement', 'error')
    return false
  }
  if (!singleMovement.value.boissonId) {
    showMessage('Veuillez sélectionner une boisson', 'error')
    return false
  }
  if (!singleMovement.value.lotId) {
    showMessage('Veuillez sélectionner un lot', 'error')
    return false
  }
  if (!singleMovement.value.quantite || singleMovement.value.quantite <= 0) {
    showMessage('Veuillez saisir une quantité valide', 'error')
    return false
  }
  if (singleMovement.value.typeMouvement === 'AJUSTEMENT' && !singleMovement.value.typeAjustement) {
    showMessage('Veuillez sélectionner un type d\'ajustement', 'error')
    return false
  }
  return true
}

const resetSingleForm = () => {
  singleMovement.value = {
    boissonId: 0,
    lotId: 0,
    quantite: 0,
    typeMouvement: '' as MovementType,
    typeAjustement: undefined,
    raison: '',
    utilisateurId: 0
  }
  isReturn.value = false
}

const setupReturnMovement = () => {
  resetSingleForm()
  isReturn.value = true
  singleMovement.value.typeMouvement = 'SORTIE' as MovementType
}

const setupAdjustmentMovement = () => {
  resetSingleForm()
  singleMovement.value.typeMouvement = 'AJUSTEMENT' as MovementType
}

// Batch movement methods
const addBatchMovement = () => {
  batchMovements.value.push({
    boissonId: 0,
    lotId: 0,
    quantite: 0,
    typeMouvement: '' as MovementType,
    typeAjustement: undefined,
    raison: '',
    utilisateurId: getCurrentUserId()
  })
}

const removeBatchMovement = (index: number) => {
  batchMovements.value.splice(index, 1)
}

const submitBatchMovements = async () => {
  if (!validateBatchMovements()) return

  isSubmitting.value = true
  try {
    const validMovements = batchMovements.value.filter(movement =>
      movement.boissonId && movement.lotId && movement.quantite > 0 && movement.typeMouvement
    )

    const results = await MovementService.recordBatchMovements(validMovements)
    movements.value.unshift(...results)
    batchMovements.value = []
    showMessage(`${results.length} mouvements enregistrés avec succès`, 'success')
  } catch (error) {
    showMessage('Erreur lors de l\'enregistrement des mouvements', 'error')
  } finally {
    isSubmitting.value = false
  }
}

const validateBatchMovements = (): boolean => {
  if (batchMovements.value.length === 0) {
    showMessage('Aucun mouvement à enregistrer', 'error')
    return false
  }

  const validMovements = batchMovements.value.filter(movement =>
    movement.boissonId && movement.lotId && movement.quantite > 0 && movement.typeMouvement
  )

  if (validMovements.length === 0) {
    showMessage('Aucun mouvement valide trouvé', 'error')
    return false
  }

  return true
}

// CSV import methods
const handleCsvUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    processCsvFile(file)
  }
}

const handleCsvDrop = (event: DragEvent) => {
  event.preventDefault()
  const file = event.dataTransfer?.files[0]
  if (file && file.type === 'text/csv') {
    processCsvFile(file)
  }
}

const processCsvFile = (file: File) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    const csvContent = e.target?.result as string
    try {
      csvData.value = MovementService.parseCSV(csvContent)
      showMessage(`${csvData.value.length} mouvements détectés dans le fichier CSV`, 'success')
    } catch (error) {
      showMessage('Erreur lors de la lecture du fichier CSV', 'error')
    }
  }
  reader.readAsText(file)
}

const clearCsvData = () => {
  csvData.value = []
  if (csvFileInput.value) {
    csvFileInput.value.value = ''
  }
}

const processCsvImport = async () => {
  if (csvData.value.length === 0) {
    showMessage('Aucune donnée CSV à traiter', 'error')
    return
  }

  isSubmitting.value = true
  try {
    // Create maps for beverage and lot lookups
    const beverageMap = new Map<string, number>()
    beverages.value.forEach(b => beverageMap.set(b.nom, b.id))

    const lotMap = new Map<string, number>()
    lots.value.forEach(l => lotMap.set(l.numeroLot, l.id))

    // Convert CSV data to movement requests
    const movementRequests = MovementService.convertCSVToMovements(
      csvData.value,
      beverageMap,
      lotMap,
      getCurrentUserId()
    )

    // Filter out invalid movements
    const validMovements = movementRequests.filter(m => m.boissonId && m.lotId)

    if (validMovements.length === 0) {
      showMessage('Aucun mouvement valide trouvé dans les données CSV', 'error')
      return
    }

    // Submit batch movements
    const results = await MovementService.recordBatchMovements(validMovements)
    movements.value.unshift(...results)

    clearCsvData()
    showMessage(`${results.length} mouvements importés avec succès`, 'success')
  } catch (error) {
    showMessage('Erreur lors de l\'import CSV', 'error')
  } finally {
    isSubmitting.value = false
  }
}

// Add the missing method for the header buttons
const openAddModal = (type: MovementType) => {
  activeTab.value = 'single'
  singleMovement.value.typeMouvement = type

  // If it's an adjustment, show the adjustment form
  if (type === 'AJUSTEMENT') {
    setupAdjustmentMovement()
  }
}

// Utility methods
const showMessage = (text: string, type: 'success' | 'error') => {
  message.value = text
  messageType.value = type
  setTimeout(() => {
    message.value = ''
  }, 5000)
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getMovementTypeLabel = (type: MovementType) => {
  switch (type) {
    case 'ENTREE': return 'Entrée'
    case 'SORTIE': return 'Sortie'
    case 'AJUSTEMENT': return 'Ajustement'
    default: return type
  }
}

const getBeverageName = (id: number) => {
  const beverage = beverages.value.find(b => b.id === id)
  return beverage ? beverage.nom : `Boisson #${id}`
}

const getLotNumber = (id: number) => {
  const lot = lots.value.find(l => l.id === id)
  return lot ? lot.numeroLot : `Lot #${id}`
}

const getUserName = (id: number) => {
  const user = users.value.find(u => u.id === id)
  return user ? user.email : `Utilisateur #${id}`
}

// Lifecycle
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.movements-page {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.page-header {
  background: var(--color-bg-primary);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  box-shadow: var(--shadow-sm);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-4);
}

.header-text {
  flex: 1;
}

.page-title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-2);
}

.page-subtitle {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
}

.header-actions {
  display: flex;
  gap: var(--space-3);
}

.add-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-3) var(--space-4);
  border: none;
  border-radius: var(--radius-lg);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.add-btn.success {
  background: var(--color-success-500);
  color: var(--color-text-inverse);
}

.add-btn.success:hover {
  background: var(--color-success-600);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.add-btn.error {
  background: var(--color-error-500);
  color: var(--color-text-inverse);
}

.add-btn.error:hover {
  background: var(--color-error-600);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.add-btn.warning {
  background: var(--color-warning-500);
  color: var(--color-text-inverse);
}

.add-btn.warning:hover {
  background: var(--color-warning-600);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.filters-section {
  background: var(--color-bg-primary);
  border-radius: var(--radius-xl);
  padding: var(--space-4);
  box-shadow: var(--shadow-sm);
}

.filters-container {
  display: flex;
  gap: var(--space-4);
}

.filter-select {
  flex: 1;
  padding: var(--space-3);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  transition: all var(--transition-fast);
}

.filter-select:focus {
  outline: none;
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 3px var(--color-primary-100);
}

.filter-actions {
  display: flex;
  gap: var(--space-3);
}

.filter-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-3) var(--space-4);
  border: none;
  border-radius: var(--radius-lg);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.filter-btn.primary {
  background: var(--color-primary-500);
  color: var(--color-text-inverse);
}

.filter-btn.primary:hover {
  background: var(--color-primary-600);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.filter-btn.secondary {
  background: var(--color-secondary-500);
  color: var(--color-text-inverse);
}

.filter-btn.secondary:hover {
  background: var(--color-secondary-600);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.tabs-section {
  background: var(--color-bg-primary);
  border-radius: var(--radius-xl);
  margin-top: var(--space-4);
  overflow: hidden;
}

.tabs-container {
  display: flex;
  border-bottom: 1px solid var(--color-border-light);
}

.tab-button {
  flex: 1;
  padding: var(--space-4);
  border: none;
  background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
  border-bottom: 3px solid transparent;
}

.tab-button:hover {
  background: var(--color-bg-hover);
  color: var(--color-text-primary);
}

.tab-button.active {
  background: var(--color-bg-secondary);
  color: var(--color-primary-600);
  border-bottom-color: var(--color-primary-500);
}

.tab-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
}

.tab-icon {
  height: 1.25rem;
  width: 1.25rem;
}

.form-section {
  background: var(--color-bg-primary);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  padding: var(--space-6);
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.form-container h3 {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-4);
  padding-bottom: var(--space-3);
  border-bottom: 1px solid var(--color-border-light);
}

.movement-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: var(--space-4);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.form-group label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.form-select,
.form-input,
.form-textarea {
  padding: var(--space-3);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  transition: all var(--transition-fast);
}

.form-select:focus,
.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 3px var(--color-primary-100);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.full-width {
  grid-column: span 2;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-border-light);
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  border: none;
  border-radius: var(--radius-lg);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-fast);
  text-decoration: none;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

.btn-primary {
  background: var(--color-primary-500);
  color: var(--color-text-inverse);
}

.btn-primary:hover:not(:disabled) {
  background: var(--color-primary-600);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-secondary {
  background: var(--color-bg-secondary);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border-light);
}

.btn-secondary:hover:not(:disabled) {
  background: var(--color-bg-tertiary);
  color: var(--color-text-primary);
  border-color: var(--color-border-medium);
}

.btn-success {
  background: var(--color-success-500);
  color: var(--color-text-inverse);
}

.btn-success:hover:not(:disabled) {
  background: var(--color-success-600);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-danger {
  background: var(--color-error-500);
  color: var(--color-text-inverse);
}

.btn-danger:hover:not(:disabled) {
  background: var(--color-error-600);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-outline-warning {
  background: transparent;
  color: var(--color-warning-600);
  border: 1px solid var(--color-warning-500);
}

.btn-outline-warning:hover:not(:disabled) {
  background: var(--color-warning-50);
  color: var(--color-warning-700);
}

.btn-outline-danger {
  background: transparent;
  color: var(--color-error-600);
  border: 1px solid var(--color-error-500);
}

.btn-outline-danger:hover:not(:disabled) {
  background: var(--color-error-50);
  color: var(--color-error-700);
}

.btn-outline-primary {
  background: transparent;
  color: var(--color-primary-600);
  border: 1px solid var(--color-primary-500);
}

.btn-outline-primary:hover:not(:disabled) {
  background: var(--color-primary-50);
  color: var(--color-primary-700);
}

.btn-sm {
  padding: var(--space-2) var(--space-3);
  font-size: var(--font-size-xs);
}

.quick-actions {
  margin-top: var(--space-6);
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-border-light);
}

.quick-actions h4 {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-3);
}

.quick-buttons {
  display: flex;
  gap: var(--space-3);
  flex-wrap: wrap;
}

.batch-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-6);
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--color-border-light);
}

.batch-movements {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.batch-movement-item {
  background: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  border: 1px solid var(--color-border-light);
}

.movement-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-3);
}

.movement-number {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary-600);
}

.movement-form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-3);
  margin-bottom: var(--space-3);
}

.csv-upload {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.upload-area {
  border: 2px dashed var(--color-border-light);
  border-radius: var(--radius-lg);
  padding: var(--space-8);
  text-align: center;
  cursor: pointer;
  transition: all var(--transition-fast);
  background: var(--color-bg-secondary);
}

.upload-area:hover {
  border-color: var(--color-primary-300);
  background: var(--color-primary-25);
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
}

.upload-icon {
  height: 3rem;
  width: 3rem;
  color: var(--color-text-secondary);
}

.upload-link {
  color: var(--color-primary-600);
  text-decoration: underline;
  background: none;
  border: none;
  cursor: pointer;
  font-size: inherit;
}

.upload-link:hover {
  color: var(--color-primary-700);
}

.upload-help {
  font-size: var(--font-size-sm);
  color: var(--color-text-tertiary);
  margin-top: var(--space-2);
}

.csv-preview {
  background: var(--color-bg-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  border: 1px solid var(--color-border-light);
}

.csv-preview h4 {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-3);
}

.csv-table table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: var(--space-4);
}

.csv-table th,
.csv-table td {
  padding: var(--space-3);
  text-align: left;
  border-bottom: 1px solid var(--color-border-light);
}

.csv-table th {
  background: var(--color-bg-secondary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.csv-table td {
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
}

.preview-note {
  font-size: var(--font-size-sm);
  color: var(--color-text-tertiary);
  font-style: italic;
  margin-bottom: var(--space-4);
}

.csv-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
}

.table-section {
  background: var(--color-bg-primary);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.table-section .filters-section {
  margin: 0;
  border-radius: 0;
  border-bottom: 1px solid var(--color-border-light);
}

.filters {
  display: flex;
  gap: var(--space-3);
  flex-wrap: wrap;
}

.table-container {
  overflow-x: auto;
}

.movements-table {
  width: 100%;
  border-collapse: collapse;
}

.movements-table th,
.movements-table td {
  padding: var(--space-4);
  text-align: left;
  border-bottom: 1px solid var(--color-border-light);
}

.movements-table th {
  background: var(--color-bg-secondary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  position: sticky;
  top: 0;
  z-index: 1;
}

.movements-table td {
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
}

.movements-table tbody tr:hover {
  background: var(--color-bg-hover);
}

.movement-badge {
  display: inline-block;
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.movement-badge.entree {
  background: var(--color-success-100);
  color: var(--color-success-800);
}

.movement-badge.sortie {
  background: var(--color-error-100);
  color: var(--color-error-800);
}

.movement-badge.ajustement {
  background: var(--color-warning-100);
  color: var(--color-warning-800);
}

.message {
  position: fixed;
  top: var(--space-4);
  right: var(--space-4);
  padding: var(--space-4) var(--space-6);
  border-radius: var(--radius-lg);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  box-shadow: var(--shadow-lg);
  z-index: 1000;
  animation: slideIn 0.3s ease-out;
}

.message.success {
  background: var(--color-success-100);
  color: var(--color-success-800);
  border: 1px solid var(--color-success-200);
}

.message.error {
  background: var(--color-error-100);
  color: var(--color-error-800);
  border: 1px solid var(--color-error-200);
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: stretch;
  }

  .header-actions {
    flex-direction: column;
  }

  .filters-container {
    flex-direction: column;
  }

  .filters {
    flex-direction: column;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .full-width {
    grid-column: span 1;
  }

  .batch-header {
    flex-direction: column;
    gap: var(--space-3);
    align-items: stretch;
  }

  .movement-form-grid {
    grid-template-columns: 1fr;
  }

  .quick-buttons {
    flex-direction: column;
  }

  .csv-actions {
    flex-direction: column;
  }

  .tabs-container {
    flex-direction: column;
  }

  .tab-button {
    flex: none;
  }
}
</style>
