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
            @click="activeTab = 'single'">
          <div class="tab-content">
            <PlusIcon class="tab-icon" />
            <span>Mouvement Simple</span>
          </div>
        </button>
        <button
            class="tab-button"
            :class="{ active: activeTab === 'csv' }"
            @click="activeTab = 'csv'"
        >
          <div class="tab-content">
            <ArrowUpOnSquareIcon class="tab-icon" />
            <span>Import CSV (Entrées)</span>
          </div>
        </button>
        <button
            class="tab-button"
            :class="{ active: activeTab === 'history' }"
            @click="activeTab = 'history'">
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
        <div class="form-header">
          <h3>Enregistrer un Mouvement</h3>
          <div class="form-type-indicator" v-if="singleMovement.typeMouvement">
            <span class="type-badge" :class="singleMovement.typeMouvement.toLowerCase()">
              <ArrowDownIcon v-if="singleMovement.typeMouvement === 'ENTREE'" class="w-4 h-4" />
              <ArrowUpIcon v-if="singleMovement.typeMouvement === 'SORTIE'" class="w-4 h-4" />
              <PencilIcon v-if="singleMovement.typeMouvement === 'AJUSTEMENT'" class="w-4 h-4" />
              {{ getMovementTypeLabel(singleMovement.typeMouvement) }}
            </span>
          </div>
        </div>

        <form @submit.prevent="submitSingleMovement" class="movement-form">
          <div class="form-steps">
            <!-- Step 1: Movement Type Selection -->
            <div class="form-step">
              <div class="step-header">
                <div class="step-number">1</div>
                <div class="step-title">Type de Mouvement</div>
              </div>
              <div class="form-card">
                <div class="movement-type-selector">
                  <div
                    class="movement-type-option"
                    :class="{ active: singleMovement.typeMouvement === 'ENTREE' }"
                    @click="singleMovement.typeMouvement = 'ENTREE'"
                  >
                    <div class="option-icon success">
                      <ArrowDownIcon class="w-6 h-6" />
                    </div>
                    <div class="option-content">
                      <div class="option-title">Entrée</div>
                      <div class="option-description">Ajouter de nouveaux produits en stock</div>
                    </div>
                  </div>

                  <div
                    class="movement-type-option"
                    :class="{ active: singleMovement.typeMouvement === 'SORTIE' }"
                    @click="singleMovement.typeMouvement = 'SORTIE'"
                  >
                    <div class="option-icon error">
                      <ArrowUpIcon class="w-6 h-6" />
                    </div>
                    <div class="option-content">
                      <div class="option-title">Sortie</div>
                      <div class="option-description">Retirer des produits du stock</div>
                    </div>
                  </div>

                  <div
                    class="movement-type-option"
                    :class="{ active: singleMovement.typeMouvement === 'AJUSTEMENT' }"
                    @click="singleMovement.typeMouvement = 'AJUSTEMENT'"
                  >
                    <div class="option-icon warning">
                      <PencilIcon class="w-6 h-6" />
                    </div>
                    <div class="option-content">
                      <div class="option-title">Ajustement</div>
                      <div class="option-description">Corriger les quantités en stock</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Step 2: Product Selection -->
            <div class="form-step" v-if="singleMovement.typeMouvement">
              <div class="step-header">
                <div class="step-number">2</div>
                <div class="step-title">
                  {{ singleMovement.typeMouvement === 'AJUSTEMENT' ? 'Sélection du Lot' : 'Sélection du Produit' }}
                </div>
              </div>
              <div class="form-card">
                <div class="form-grid-enhanced">
                  <div class="form-group-enhanced" v-if="singleMovement.typeMouvement !== 'AJUSTEMENT'">
                    <label class="form-label-enhanced">
                      <div class="label-content">
                        <span class="label-text">Boisson</span>
                        <span class="label-required">*</span>
                      </div>
                    </label>
                    <div class="select-wrapper">
                      <select v-model="singleMovement.boissonId" required class="form-select-enhanced">
                        <option value="">Sélectionner une boisson</option>
                        <option v-for="beverage in boissons" :key="beverage.id" :value="beverage.id">
                          {{ beverage.nom }} - {{ beverage.prix }} FCFA
                        </option>
                      </select>
                    </div>
                  </div>

                  <div class="form-group-enhanced" v-if="singleMovement.typeMouvement === 'AJUSTEMENT'">
                    <label class="form-label-enhanced">
                      <div class="label-content">
                        <span class="label-text">Lot</span>
                        <span class="label-required">*</span>
                      </div>
                    </label>
                    <div class="select-wrapper">
                      <select v-model="singleMovement.lotId" required class="form-select-enhanced">
                        <option value="">Sélectionner un lot</option>
                        <option v-for="lot in lots" :key="lot.id" :value="lot.id">
                          {{ lot.numeroLot }} - {{ lot.boisson.nom }} ({{ lot.quantiteActuelle }} disponible)
                        </option>
                      </select>
                    </div>
                  </div>

                  <div class="form-group-enhanced">
                    <label class="form-label-enhanced">
                      <div class="label-content">
                        <span class="label-text">Quantité</span>
                        <span class="label-required">*</span>
                      </div>
                    </label>
                    <div class="input-wrapper">
                      <input
                        v-model.number="singleMovement.quantite"
                        type="number"
                        min="1"
                        required
                        class="form-input-enhanced"
                        placeholder="Entrez la quantité"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Step 3: Additional Details -->
            <div class="form-step" v-if="singleMovement.typeMouvement">
              <div class="step-header">
                <div class="step-number">3</div>
                <div class="step-title">Détails Complémentaires</div>
              </div>
              <div class="form-card">
                <!-- ENTREE specific fields -->
                <div v-if="singleMovement.typeMouvement === 'ENTREE'" class="form-grid-enhanced">
                  <div class="form-group-enhanced">
                    <label class="form-label-enhanced">
                      <div class="label-content">
                        <span class="label-text">Numéro de Lot</span>
                        <span class="label-required">*</span>
                      </div>
                    </label>
                    <div class="input-wrapper">
                      <input
                        v-model="singleMovement.numeroLot"
                        type="text"
                        required
                        class="form-input-enhanced"
                        placeholder="Ex: LOT-2024-001"
                      />
                    </div>
                  </div>

                  <div class="form-group-enhanced">
                    <label class="form-label-enhanced">
                      <div class="label-content">
                        <span class="label-text">Date de Péremption</span>
                        <span class="label-required">*</span>
                      </div>
                    </label>
                    <div class="input-wrapper">
                      <input
                        v-model="singleMovement.datePeremption"
                        type="date"
                        required
                        class="form-input-enhanced"
                      />
                    </div>
                  </div>
                </div>

                <!-- AJUSTEMENT specific fields -->
                <div v-if="singleMovement.typeMouvement === 'AJUSTEMENT'" class="adjustment-section">
                  <div class="form-group-enhanced">
                    <label class="form-label-enhanced">
                      <div class="label-content">
                        <span class="label-text">Type d'Ajustement</span>
                        <span class="label-required">*</span>
                      </div>
                    </label>
                    <div class="adjustment-type-selector">
                      <div
                        class="adjustment-option"
                        :class="{ active: singleMovement.typeAjustement === 'POSITIF' }"
                        @click="singleMovement.typeAjustement = 'POSITIF'"
                      >
                        <div class="adjustment-icon positive">+</div>
                        <span>Positif</span>
                      </div>
                      <div
                        class="adjustment-option"
                        :class="{ active: singleMovement.typeAjustement === 'NEGATIF' }"
                        @click="singleMovement.typeAjustement = 'NEGATIF'"
                      >
                        <div class="adjustment-icon negative">-</div>
                        <span>Négatif</span>
                      </div>
                    </div>
                  </div>

                  <div class="form-group-enhanced full-width">
                    <label class="form-label-enhanced">
                      <div class="label-content">
                        <span class="label-text">Raison de l'Ajustement</span>
                        <span class="label-required">*</span>
                      </div>
                    </label>
                    <div class="textarea-wrapper">
                      <textarea
                        v-model="singleMovement.raison"
                        required
                        class="form-textarea-enhanced"
                        placeholder="Expliquez la raison de cet ajustement..."
                        rows="4"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="form-actions-enhanced">
            <button type="button" class="btn btn-secondary-enhanced" @click="resetSingleForm">
              <XMarkIcon class="w-4 h-4" />
              Annuler
            </button>
            <button type="submit" class="btn btn-primary-enhanced" :disabled="isSubmitting">
              <div v-if="isSubmitting" class="loading-spinner"></div>
              <span v-if="!isSubmitting">Enregistrer le Mouvement</span>
              <span v-else>Enregistrement...</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- CSV Import -->
    <div v-if="activeTab === 'csv'" class="form-section">
      <div class="csv-upload">
        <h3>Importer des Entrées par CSV</h3>
        <p class="csv-description">
          Importez plusieurs entrées de stock en une seule fois. Le CSV doit contenir les colonnes :
          <strong>Nom Boisson, Numéro Lot, Quantité, Date Péremption</strong>
        </p>

        <div class="upload-area" @click="triggerCsvUpload" @drop="handleCsvDrop" @dragover.prevent>
          <div class="upload-content">
            <ArrowUpOnSquareIcon class="upload-icon" />
            <p>Cliquez pour sélectionner un fichier CSV ou glissez-déposez ici</p>
            <input
              ref="csvFileInput"
              type="file"
              accept=".csv"
              @change="handleCsvUpload"
              style="display: none"
            />
          </div>
        </div>

        <div class="upload-help">
          <p><strong>Format accepté:</strong> .csv</p>
          <p><strong>Exemple de format:</strong></p>
          <code>Nom Boisson,Numéro Lot,Quantité,Date Péremption<br>
          Coca Cola,LOT-001,100,2024-12-31<br>
          Pepsi,LOT-002,50,2024-11-30</code>
        </div>

        <div v-if="csvData.length > 0" class="csv-preview">
          <h4>Aperçu des Données CSV ({{ csvData.length }} entrées détectées)</h4>
          <div class="csv-table">
            <table>
              <thead>
                <tr>
                  <th>Nom Boisson</th>
                  <th>Numéro de Lot</th>
                  <th>Quantité</th>
                  <th>Date de Péremption</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, index) in csvData" :key="index">
                  <td>{{ row.beverageName }}</td>
                  <td>{{ row.lotNumber }}</td>
                  <td>{{ row.quantity }}</td>
                  <td>{{ row.expiryDate }}</td>
                  <td>
                    <span
                      :class="validateCsvRow(row) ? 'text-green-600' : 'text-red-600'"
                      class="text-sm font-medium"
                    >
                      {{ validateCsvRow(row) ? '✓ Valide' : '✗ Invalide' }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="csv-actions">
            <button @click="clearCsvData" class="btn btn-secondary">
              <XMarkIcon class="w-4 h-4" />
              Effacer
            </button>
            <button
              @click="processCsvImport"
              :disabled="!hasValidCsvRows || isProcessing"
              class="btn btn-primary"
            >
              <ArrowDownIcon class="w-4 h-4" />
              {{ isProcessing ? 'Traitement...' : 'Importer les Entrées' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Movement History -->
    <div v-if="activeTab === 'history'" class="table-section">
      <div class="filters-section">
        <div class="filters-container">
          <select v-model="historyFilter.type" class="filter-select">
            <option value="">Tous les types</option>
            <option value="ENTREE">Entrées</option>
            <option value="SORTIE">Sorties</option>
            <option value="AJUSTEMENT">Ajustements</option>
          </select>
          <select v-model="historyFilter.beverage" class="filter-select">
            <option value="">Toutes les boissons</option>
            <option v-for="beverage in boissons" :key="beverage.id" :value="beverage.id">
              {{ beverage.nom }}
            </option>
          </select>
          <input v-model="historyFilter.dateFrom" type="date" class="filter-select" placeholder="Date de début" />
          <input v-model="historyFilter.dateTo" type="date" class="filter-select" placeholder="Date de fin" />
          <div class="filter-actions">
            <button @click="clearHistoryFilters" class="filter-btn secondary">
              Effacer
            </button>
          </div>
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
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="operation in filteredLigneOperations" :key="operation.id">
              <td>{{ formatDate(operation.mouvement?.dateMouvement) }}</td>
              <td>
                <span class="movement-badge" :class="operation.mouvement?.type?.toLowerCase()">
                  <ArrowDownIcon v-if="operation.mouvement?.type === 'ENTREE'" class="w-3 h-3 inline mr-1" />
                  <ArrowUpIcon v-if="operation.mouvement?.type === 'SORTIE'" class="w-3 h-3 inline mr-1" />
                  <PencilIcon v-if="operation.mouvement?.type === 'AJUSTEMENT'" class="w-3 h-3 inline mr-1" />
                  {{ getMovementTypeLabel(operation.mouvement?.type || '') }}
                </span>
              </td>
              <td>{{ operation.lot?.boisson?.nom || '-' }}</td>
              <td>{{ operation.lot?.numeroLot || '-' }}</td>
              <td>{{ operation.quantite }}</td>
              <td>{{ operation.mouvement?.utilisateur.email }}</td>
              <td>
                <span class="status-badge" :class="getStatusClass('CONFIRME')">
                  {{'CONFIRME' }}
                </span>
              </td>
            </tr>
            <tr v-if="filteredLigneOperations.length === 0">
              <td colspan="7" class="text-center text-gray-500 py-8">
                Aucune ligne d'opération trouvée
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

    <!-- Sortie Loading Animation -->
    <SortieLoadingAnimation v-if="isSortieProcessing" />
    <ProcessingAnimation v-if="isSubmitting" />
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
  ArrowUpOnSquareIcon,
  ClockIcon
} from '@heroicons/vue/24/outline'
import { showToast } from './../utils/toast'

// Import services and types
import { InventaireService } from '../api/features/inventaire/services/inventaireService'
import { BoissonService } from '../api/features/boisson/services/boissonService'
import { UtilisateurService } from '../api/features/utilisateurs/services/utilisateurService'

// Import components
import SortieLoadingAnimation from '../components/common/SortieLoadingAnimation.vue'
import ProcessingAnimation from '../components/common/ProcessingAnimation.vue'

import type { Boisson } from '../api/features/boisson/models/boisson'
import type { Lot } from '../api/features/inventaire/models/lotModel'
import type { Mouvement } from '../api/features/inventaire/models/movementModel'
import type { LigneOperation } from '../api/features/inventaire/models/ligneOperation'
import type { Utilisateur } from '../api/features/utilisateurs/models/utilisateurModel'

import type { CreateMouvementAjustementRequest } from '../api/features/inventaire/requests/createMouvementAjustementRequest'
import type { CreateMouvementSortieRequest } from '../api/features/inventaire/requests/createMouvementSortieRequest'
import type { CreateLotRequest } from '../api/features/inventaire/requests/createLotRequest'
import type { CreateLotBatchRequest } from '../api/features/inventaire/requests/createLotBatchRequest'

type MovementType = 'ENTREE' | 'SORTIE' | 'AJUSTEMENT'
type AjustementType = 'POSITIF' | 'NEGATIF'

interface SingleMovementForm {
  typeMouvement: MovementType | ''
  boissonId: number | ''
  lotId: number | ''
  quantite: number | ''
  typeAjustement: AjustementType | ''
  raison: string
  numeroLot: string
  datePeremption: string
}

interface MovementCSVRow {
  beverageName: string
  lotNumber: string
  quantity: number
  expiryDate: string
}

const activeTab = ref<'single' | 'batch' | 'csv' | 'history'>('single')
const isSubmitting = ref(false)
const isSortieProcessing = ref(false)
const message = ref('')
const messageType = ref<'success' | 'error'>('success')

const boissons = ref<Boisson[]>([])
const lots = ref<Lot[]>([])
const utilisateurs = ref<Utilisateur[]>([])
const mouvements = ref<Mouvement[]>([])
const ligneOperations = ref<LigneOperation[]>([])

const singleMovement = ref<SingleMovementForm>({
  typeMouvement: '',
  boissonId: '',
  lotId: '',
  quantite: '',
  typeAjustement: '',
  raison: '',
  numeroLot: '',
  datePeremption: ''
})


const csvData = ref<MovementCSVRow[]>([])
const csvFileInput = ref<HTMLInputElement>()
const isProcessing = ref(false)

const historyFilter = ref({
  type: '',
  beverage: '',
  dateFrom: '',
  dateTo: ''
})




const loadData = async () => {
  try {
    const [beveragesData, lotsData, usersData, ligneOperationsData] = await Promise.all([
      BoissonService.getAllBeverages(),
      InventaireService.getAllLots(),
      UtilisateurService.getAllUsers(),
      InventaireService.getAllLigneOperations(),

    ])
    console.log(ligneOperationsData);

    boissons.value = beveragesData
    lots.value = lotsData
    utilisateurs.value = usersData
    ligneOperations.value = ligneOperationsData

    const currentUserId = getCurrentUserId()
    if (currentUserId) {
      mouvements.value = await InventaireService.getMovementsByUser(currentUserId)
    }
  } catch (error) {
    console.error('Error loading data:', error)
    showMessage('Erreur lors du chargement des données', 'error')
  }
}

const getCurrentUserId = (): number => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  return user.id || 1
}

const getCurrentUser = (): Utilisateur | undefined => {
  return utilisateurs.value.find(u => u.id === getCurrentUserId())
}

const ensureSortieAnimationDuration = async (callback: () => Promise<void>) => {
  const startTime = Date.now()

  try {
    await callback()
  } finally {
    const elapsedTime = Date.now() - startTime
    const remainingTime = Math.max(0, 3000 - elapsedTime)

    if (remainingTime > 0) {
      await new Promise(resolve => setTimeout(resolve, remainingTime))
    }

    isSortieProcessing.value = false
  }
}

const submitSingleMovement = async () => {
  if (!validateSingleMovement()) return

  isSubmitting.value = true

  // Show sortie animation specifically for sortie operations
  if (singleMovement.value.typeMouvement === 'SORTIE') {
    isSortieProcessing.value = true

    await ensureSortieAnimationDuration(async () => {
      const currentUser = getCurrentUser()
      if (!currentUser) {
        showMessage('Utilisateur non trouvé', 'error')
        return
      }

      const sortieRequest: CreateMouvementSortieRequest = {
        boissonId: Number(singleMovement.value.boissonId),
        quantiteDemandee: Number(singleMovement.value.quantite),
        utilisateur: currentUser
      }

      await InventaireService.recordMouvementSortie(sortieRequest)
      showMessage('Sortie enregistrée avec succès', 'success')
      handleSubmissionSuccess()
      await loadData()
      resetSingleForm()
    })
  } else {
    try {
      const currentUser = getCurrentUser()
      if (!currentUser) {
        showMessage('Utilisateur non trouvé', 'error')
        return
      }

      if (singleMovement.value.typeMouvement === 'ENTREE') {
        const selectedBoisson = boissons.value.find(b => b.id === singleMovement.value.boissonId)
        if (!selectedBoisson) {
          showMessage('Boisson non trouvée', 'error')
          return
        }

        const lotRequest: CreateLotRequest = {
          lot: {
            numeroLot: singleMovement.value.numeroLot,
            quantiteInitiale: Number(singleMovement.value.quantite),
            datePeremption: singleMovement.value.datePeremption,
            boisson: selectedBoisson
          },
          utilisateur: { id: currentUser.id }
        }

        await InventaireService.recordMouvementEntree(lotRequest)
        showMessage('Entrée enregistrée avec succès', 'success')
        handleSubmissionSuccess()
      } else if (singleMovement.value.typeMouvement === 'AJUSTEMENT') {
        const delta = singleMovement.value.typeAjustement === 'POSITIF'
          ? Math.abs(Number(singleMovement.value.quantite))
          : -Math.abs(Number(singleMovement.value.quantite))

        const ajustementRequest: CreateMouvementAjustementRequest = {
          lotId: Number(singleMovement.value.lotId),
          delta,
          typeAjustement: singleMovement.value.typeAjustement as 'POSITIF' | 'NEGATIF',
          raison: singleMovement.value.raison,
          utilisateur: currentUser
        }

        await InventaireService.recordMouvementAjustement(ajustementRequest)
        showMessage('Ajustement enregistré avec succès', 'success')
        handleSubmissionSuccess()
      }

      await loadData()
      resetSingleForm()
    } catch (error) {
      console.error('Error submitting movement:', error)
      showMessage('Erreur lors de l\'enregistrement du mouvement', 'error')
    }
  }

  isSubmitting.value = false
}

const validateSingleMovement = (): boolean => {
  if (!singleMovement.value.typeMouvement) {
    showMessage('Veuillez sélectionner un type de mouvement', 'error')
    return false
  }

  if (singleMovement.value.typeMouvement !== 'AJUSTEMENT' && !singleMovement.value.boissonId) {
    showMessage('Veuillez sélectionner une boisson', 'error')
    return false
  }

  if (!singleMovement.value.quantite || Number(singleMovement.value.quantite) <= 0) {
    showMessage('Veuillez saisir une quantité valide', 'error')
    return false
  }

  if (singleMovement.value.typeMouvement === 'ENTREE') {
    if (!singleMovement.value.numeroLot) {
      showMessage('Veuillez saisir un numéro de lot', 'error')
      return false
    }
    if (!singleMovement.value.datePeremption) {
      showMessage('Veuillez saisir une date de péremption', 'error')
      return false
    }
  } else if (singleMovement.value.typeMouvement === 'AJUSTEMENT') {
    if (!singleMovement.value.lotId) {
      showMessage('Veuillez sélectionner un lot', 'error')
      return false
    }
    if (!singleMovement.value.typeAjustement) {
      showMessage('Veuillez sélectionner un type d\'ajustement', 'error')
      return false
    }
    if (!singleMovement.value.raison.trim()) {
      showMessage('Veuillez saisir une raison pour l\'ajustement', 'error')
      return false
    }
  }

  return true
}

const resetSingleForm = () => {
  singleMovement.value = {
    typeMouvement: '',
    boissonId: '',
    lotId: '',
    quantite: '',
    typeAjustement: '',
    raison: '',
    numeroLot: '',
    datePeremption: ''
  }
}


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
      const rows = csvContent.split('\n').filter(row => row.trim())
      const csvRows: MovementCSVRow[] = []

      for (let i = 1; i < rows.length; i++) {
        const columns = rows[i].split(',').map(col => col.trim())
        if (columns.length >= 4) {
          csvRows.push({
            beverageName: columns[0],
            lotNumber: columns[1],
            quantity: Number(columns[2]),
            expiryDate: columns[3]
          })
        }
      }

      csvData.value = csvRows
      showMessage(`${csvRows.length} entrées détectées dans le fichier CSV`, 'success')
    } catch (error) {
      console.error('Error parsing CSV:', error)
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

  isProcessing.value = true
  isSubmitting.value = true

  const startTime = Date.now()

  try {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      showMessage('Utilisateur non trouvé', 'error')
      return
    }

    // Create beverage name map
    const beverageMap = new Map<string, Boisson>()
    boissons.value.forEach(b => beverageMap.set(b.nom.toLowerCase(), b))

    // Process CSV data - create lots array for batch processing
    const validLots: Lot[] = []
    for (const row of csvData.value) {
      const boisson = beverageMap.get(row.beverageName.toLowerCase())
      if (boisson && row.quantity > 0 && validateCsvRow(row)) {
        validLots.push({
          numeroLot: row.lotNumber,
          quantiteInitiale: row.quantity,
          quantiteActuelle: row.quantity,
          datePeremption: row.expiryDate,
          boisson: boisson
        })
      }
    }

    if (validLots.length === 0) {
      showMessage('Aucune donnée valide trouvée dans le CSV', 'error')
      return
    }

    // Create batch request using the CreateLotBatchRequest interface
    const batchRequest: CreateLotBatchRequest = {
      lots: validLots,
      utilisateur: currentUser
    }

    await InventaireService.recordMouvementEntreeBatch(batchRequest)

    await loadData()
    clearCsvData()
    showMessage(`${validLots.length} lots créés avec succès en une seule opération`, 'success')
  } catch (error) {
    console.error('Error processing CSV import:', error)
    showMessage('Erreur lors de l\'import CSV', 'error')
  } finally {
    // Ensure the animation lasts at least 5 seconds
    const elapsedTime = Date.now() - startTime
    const remainingTime = Math.max(0, 5000 - elapsedTime)

    if (remainingTime > 0) {
      await new Promise(resolve => setTimeout(resolve, remainingTime))
    }

    isProcessing.value = false
    isSubmitting.value = false
  }
}

const validateCsvRow = (row: MovementCSVRow): boolean => {
  const beverage = boissons.value.find(b => b.nom.toLowerCase() === row.beverageName.toLowerCase())
  return !!(
    beverage &&
    row.lotNumber &&
    row.quantity > 0 &&
    row.expiryDate &&
    new Date(row.expiryDate) > new Date()
  )
}

const hasValidCsvRows = computed(() => {
  return csvData.value.length > 0 && csvData.value.some(row => validateCsvRow(row))
})

const triggerCsvUpload = () => {
  csvFileInput.value?.click()
}

const openAddModal = (type: MovementType) => {
  activeTab.value = 'single'
  singleMovement.value.typeMouvement = type
}

const showMessage = (text: string, type: 'success' | 'error') => {
  message.value = text
  messageType.value = type
  setTimeout(() => {
    message.value = ''
  }, 5000)
}

const handleSubmissionSuccess = () => {
  showToast('Submission successful!', 'success');
}

const formatDate = (dateStr: string | undefined) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getMovementTypeLabel = (type: string) => {
  switch (type) {
    case 'ENTREE': return 'Entrée'
    case 'SORTIE': return 'Sortie'
    case 'AJUSTEMENT': return 'Ajustement'
    default: return type
  }
}




const getUserName = (user: Utilisateur): string => {
  return `${user.firstName} ${user.lastName}`
}

const filteredLigneOperations = computed(() => {
  let filtered = ligneOperations.value

  if (historyFilter.value.type) {
    filtered = filtered.filter(op => op.mouvement?.type === historyFilter.value.type)
  }

  // Filter by beverage
  if (historyFilter.value.beverage) {
    filtered = filtered.filter(op => op.lot?.boisson?.id === Number(historyFilter.value.beverage))
  }

  // Filter by date range
  if (historyFilter.value.dateFrom) {
    filtered = filtered.filter(op => {
      const opDate = new Date(op.mouvement?.dateMouvement || '')
      const fromDate = new Date(historyFilter.value.dateFrom)
      return opDate >= fromDate
    })
  }

  if (historyFilter.value.dateTo) {
    filtered = filtered.filter(op => {
      const opDate = new Date(op.mouvement?.dateMouvement || '')
      const toDate = new Date(historyFilter.value.dateTo)
      return opDate <= toDate
    })
  }

  return filtered.sort((a, b) => {
    const dateA = new Date(a.mouvement?.dateMouvement || '')
    const dateB = new Date(b.mouvement?.dateMouvement || '')
    return dateB.getTime() - dateA.getTime()
  })
})

const clearHistoryFilters = () => {
  historyFilter.value = {
    type: '',
    beverage: '',
    dateFrom: '',
    dateTo: ''
  }
}

const getStatusClass = (status: string | undefined): string => {
  switch (status) {
    case 'CONFIRME':
      return 'success'
    case 'EN_ATTENTE':
      return 'warning'
    case 'ANNULE':
      return 'error'
    default:
      return 'success'
  }
}
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
  background: var(--color-bg-secondary);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border-light);
}

.filter-btn.secondary:hover {
  background: var(--color-bg-tertiary);
  color: var(--color-text-primary);
  border-color: var(--color-border-medium);
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

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-4);
}

.form-type-indicator {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.type-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.type-badge.entree {
  background: var(--color-success-100);
  color: var(--color-success-800);
}

.type-badge.sortie {
  background: var(--color-error-100);
  color: var(--color-error-800);
}

.type-badge.ajustement {
  background: var(--color-warning-100);
  color: var(--color-warning-800);
}

.movement-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.form-steps {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.form-step {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.step-header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.step-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  background: var(--color-primary-500);
  color: var(--color-text-inverse);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  text-align: center;
}

.step-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.form-card {
  background: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  border: 1px solid var(--color-border-light);
}

.movement-type-selector {
  display: flex;
  gap: var(--space-4);
}

.movement-type-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
  border: 2px solid transparent;
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-fast);
  flex: 1;
}

.movement-type-option:hover {
  border-color: var(--color-primary-300);
  background: var(--color-primary-50);
}

.movement-type-option.active {
  border-color: var(--color-primary-500);
  background: var(--color-primary-100);
}

.option-icon {
  height: 2rem;
  width: 2rem;
}

.option-title {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-top: var(--space-2);
}

.option-description {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  text-align: center;
}

.form-grid-enhanced {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: var(--space-4);
}

.form-group-enhanced {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.form-label-enhanced {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.select-wrapper {
  position: relative;
}

.form-select-enhanced {
  padding: var(--space-3);
  padding-right: calc(var(--space-3) + 2rem);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  transition: all var(--transition-fast);
  appearance: none;
}

.form-select-enhanced:focus {
  outline: none;
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 3px var(--color-primary-100);
}

.input-wrapper {
  position: relative;
}

.form-input-enhanced {
  padding: var(--space-3);
  padding-right: calc(var(--space-3) + 2rem);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  transition: all var(--transition-fast);
}

.form-input-enhanced:focus {
  outline: none;
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 3px var(--color-primary-100);
}

.textarea-wrapper {
  position: relative;
}

.form-textarea-enhanced {
  padding: var(--space-3);
  resize: vertical;
  min-height: 80px;
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  transition: all var(--transition-fast);
}

.form-textarea-enhanced:focus {
  outline: none;
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 3px var(--color-primary-100);
}

.adjustment-type-selector {
  display: flex;
  gap: var(--space-4);
  margin-top: var(--space-2);
}

.adjustment-option {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3);
  border: 2px solid transparent;
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.adjustment-option:hover {
  border-color: var(--color-primary-300);
  background: var(--color-primary-50);
}

.adjustment-option.active {
  border-color: var(--color-primary-500);
  background: var(--color-primary-100);
}

.adjustment-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  font-size: var(--font-size-base);
  border-radius: var(--radius-full);
}

.adjustment-icon.positive {
  background: var(--color-success-500);
  color: var(--color-text-inverse);
}

.adjustment-icon.negative {
  background: var(--color-error-500);
  color: var(--color-text-inverse);
}

.form-actions-enhanced {
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

.status-badge {
  display: inline-block;
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.status-badge.success {
  background: var(--color-success-100);
  color: var(--color-success-800);
}

.status-badge.warning {
  background: var(--color-warning-100);
  color: var(--color-warning-800);
}

.status-badge.error {
  background: var(--color-error-100);
  color: var(--color-error-800);
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
