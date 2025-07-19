<template>
  <div class="movements-page">
    <!-- Main Navigation Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="page-title">Gestion des Mouvements</h1>
          <p class="page-subtitle">Centre de contrôle des stocks</p>
        </div>
        <div class="header-right">
          <div class="quick-stats">
            <div class="stat-item">
              <span class="stat-value">{{ totalMovements }}</span>
              <span class="stat-label">Total mouvements</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ todayMovements }}</span>
              <span class="stat-label">Aujourd'hui</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Selection Grid -->
    <div v-if="currentView === 'selection'" class="action-selection">
      <div class="actions-grid">
        <!-- Entrée Action -->
        <div class="action-card entree" @click="setView('entree')">
          <div class="action-icon">
            <ArrowDownIcon class="icon" />
          </div>
          <div class="action-content">
            <h3 class="action-title">Entrée de Stock</h3>
            <p class="action-description">Enregistrer l'arrivée de nouveaux produits</p>
            <div class="action-features">
              <span class="feature">• Lot unique</span>
              <span class="feature">• Import CSV</span>
              <span class="feature">• Suivi fournisseur</span>
            </div>
          </div>
          <div class="action-arrow">
            <ArrowRightIcon class="arrow-icon" />
          </div>
        </div>

        <!-- Sortie Action -->
        <div class="action-card sortie" @click="setView('sortie')">
          <div class="action-icon">
            <ArrowUpIcon class="icon" />
          </div>
          <div class="action-content">
            <h3 class="action-title">Sortie de Stock</h3>
            <p class="action-description">Enregistrer la vente ou consommation</p>
            <div class="action-features">
              <span class="feature">• Gestion automatique</span>
              <span class="feature">• FEFO/FIFO intégré</span>
              <span class="feature">• Traçabilité complète</span>
            </div>
          </div>
          <div class="action-arrow">
            <ArrowRightIcon class="arrow-icon" />
          </div>
        </div>

        <!-- Ajustement Action -->
        <div class="action-card ajustement" @click="setView('ajustement')">
          <div class="action-icon">
            <PencilIcon class="icon" />
          </div>
          <div class="action-content">
            <h3 class="action-title">Ajustement</h3>
            <p class="action-description">Corriger les quantités en stock</p>
            <div class="action-features">
              <span class="feature">• Correction d'inventaire</span>
              <span class="feature">• Justification obligatoire</span>
              <span class="feature">• Historique complet</span>
            </div>
          </div>
          <div class="action-arrow">
            <ArrowRightIcon class="arrow-icon" />
          </div>
        </div>

        <!-- Historique Action -->
        <div class="action-card historique" @click="setView('historique')">
          <div class="action-icon">
            <ClockIcon class="icon" />
          </div>
          <div class="action-content">
            <h3 class="action-title">Historique</h3>
            <p class="action-description">Consulter tous les mouvements</p>
            <div class="action-features">
              <span class="feature">• Filtres avancés</span>
              <span class="feature">• Export données</span>
              <span class="feature">• Analyses détaillées</span>
            </div>
          </div>
          <div class="action-arrow">
            <ArrowRightIcon class="arrow-icon" />
          </div>
        </div>
      </div>
    </div>

    <!-- Entrée View -->
    <div v-if="currentView === 'entree'" class="action-view">
      <div class="view-header">
        <button @click="setView('selection')" class="back-btn">
          <ArrowLeftIcon class="w-5 h-5" />
          Retour
        </button>
        <div class="view-title">
          <div class="title-icon entree">
            <ArrowDownIcon class="icon" />
          </div>
          <div class="title-content">
            <h2>Entrée de Stock</h2>
            <p>Enregistrement de nouveaux produits</p>
          </div>
        </div>
      </div>

      <div class="view-content">
        <div class="entry-methods">
          <div
            class="method-card"
            :class="{ active: entreeMethod === 'single' }"
            @click="entreeMethod = 'single'"
          >
            <div class="method-icon">
              <PlusIcon class="icon" />
            </div>
            <h3>Entrée Simple</h3>
            <p>Un produit à la fois</p>
          </div>

          <div
            class="method-card"
            :class="{ active: entreeMethod === 'csv' }"
            @click="entreeMethod = 'csv'"
          >
            <div class="method-icon">
              <DocumentArrowUpIcon class="icon" />
            </div>
            <h3>Import CSV</h3>
            <p>Plusieurs produits en lot</p>
          </div>
        </div>

        <!-- Single Entry Form -->
        <div v-if="entreeMethod === 'single'" class="form-container">
          <form @submit.prevent="submitEntree" class="elegant-form">
            <div class="form-section">
              <h4 class="section-title">Informations Produit</h4>
              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">Boisson</label>
                  <select v-model="singleMovement.boissonId" class="form-input">
                    <option value="">Sélectionner une boisson</option>
                    <option v-for="beverage in boissons" :key="beverage.id" :value="beverage.id">
                      {{ beverage.nom }} - {{ beverage.prix }} FCFA
                    </option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Quantité</label>
                  <input
                    v-model.number="singleMovement.quantite"
                    type="number"
                    min="1"
                    class="form-input"
                    placeholder="Ex: 100"
                  />
                </div>
              </div>
            </div>

            <div class="form-section">
              <h4 class="section-title">Détails du Lot</h4>
              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">Numéro de Lot</label>
                  <input
                    v-model="singleMovement.numeroLot"
                    type="text"
                    class="form-input"
                    placeholder="Ex: LOT-2025-001"
                  />
                </div>
                <div class="form-group">
                  <label class="form-label">Fournisseur</label>
                  <input
                    v-model="singleMovement.fournisseur"
                    type="text"
                    class="form-input"
                    placeholder="Ex: Coca-Cola Company"
                  />
                </div>
                <div class="form-group">
                  <label class="form-label">Date de Péremption</label>
                  <input
                    v-model="singleMovement.datePeremption"
                    type="date"
                    class="form-input"
                  />
                </div>
              </div>
            </div>

            <div class="form-actions">
              <button type="button" @click="resetEntreeForm" class="btn btn-secondary">
                Réinitialiser
              </button>
              <button type="submit" :disabled="isSubmitting" class="btn btn-primary">
                <span v-if="!isSubmitting">Enregistrer l'Entrée</span>
                <span v-else>Enregistrement...</span>
              </button>
            </div>
          </form>
        </div>

        <!-- CSV Import -->
        <div v-if="entreeMethod === 'csv'" class="csv-container">
          <div class="csv-upload-zone" @click="triggerCsvUpload" @drop="handleCsvDrop" @dragover.prevent>
            <div class="upload-content">
              <DocumentArrowUpIcon class="upload-icon" />
              <h3>Importer un fichier CSV</h3>
              <p>Glissez-déposez votre fichier ici ou cliquez pour le sélectionner</p>
              <div class="upload-info">
                <span>Format: .csv | Taille max: 5MB</span>
              </div>
            </div>
            <input ref="csvFileInput" type="file" accept=".csv" @change="handleCsvUpload" style="display: none" />
          </div>

          <div v-if="csvData.length > 0" class="csv-preview-container">
            <div class="csv-preview-header">
              <h4>Aperçu des données ({{ csvData.length }} entrées)</h4>
              <button @click="clearCsvData" class="btn btn-outline">Effacer</button>
            </div>
            <div class="csv-table-container">
              <table class="csv-table">
                <thead>
                  <tr>
                    <th>Boisson</th>
                    <th>Lot</th>
                    <th>Quantité</th>
                    <th>Péremption</th>
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
                      <span :class="validateCsvRow(row) ? 'status-valid' : 'status-invalid'">
                        {{ validateCsvRow(row) ? '✓ Valide' : '✗ Invalide' }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="csv-actions">
              <button @click="processCsvImport" :disabled="!hasValidCsvRows || isProcessing" class="btn btn-success">
                {{ isProcessing ? 'Traitement...' : 'Importer toutes les entrées' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sortie View -->
    <div v-if="currentView === 'sortie'" class="action-view">
      <div class="view-header">
        <button @click="setView('selection')" class="back-btn">
          <ArrowLeftIcon class="w-5 h-5" />
          Retour
        </button>
        <div class="view-title">
          <div class="title-icon sortie">
            <ArrowUpIcon class="icon" />
          </div>
          <div class="title-content">
            <h2>Sortie de Stock</h2>
            <p>Enregistrement de ventes ou consommations</p>
          </div>
        </div>
      </div>

      <div class="view-content">
        <form @submit.prevent="submitSortie" class="elegant-form">
          <div class="form-section">
            <h4 class="section-title">Détails de la Sortie</h4>
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Boisson</label>
                <select v-model="singleMovement.boissonId" class="form-input">
                  <option value="">Sélectionner une boisson</option>
                  <option v-for="beverage in boissons" :key="beverage.id" :value="beverage.id">
                    {{ beverage.nom }} - Stock disponible: {{ getAvailableStock(beverage.id) }}
                  </option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Quantité</label>
                <input
                  v-model.number="singleMovement.quantite"
                  type="number"
                  min="1"
                  class="form-input"
                  placeholder="Quantité à sortir"
                />
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" @click="resetSortieForm" class="btn btn-secondary">
              Réinitialiser
            </button>
            <button type="submit" :disabled="isSubmitting || isSortieProcessing" class="btn btn-danger">
              <span v-if="!isSubmitting && !isSortieProcessing">Enregistrer la Sortie</span>
              <span v-else>Traitement...</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Ajustement View -->
    <div v-if="currentView === 'ajustement'" class="action-view">
      <div class="view-header">
        <button @click="setView('selection')" class="back-btn">
          <ArrowLeftIcon class="w-5 h-5" />
          Retour
        </button>
        <div class="view-title">
          <div class="title-icon ajustement">
            <PencilIcon class="icon" />
          </div>
          <div class="title-content">
            <h2>Ajustement de Stock</h2>
            <p>Correction des quantités en inventaire</p>
          </div>
        </div>
      </div>

      <div class="view-content">
        <form @submit.prevent="submitAjustement" class="elegant-form">
          <div class="form-section">
            <h4 class="section-title">Sélection du Lot</h4>
            <div class="form-group">
              <label class="form-label">Lot à ajuster</label>
              <select v-model="singleMovement.lotId" class="form-input">
                <option value="">Sélectionner un lot</option>
                <option v-for="lot in lots" :key="lot.id" :value="lot.id">
                  {{ lot.numeroLot }} - {{ lot.boisson.nom }} ({{ lot.quantiteActuelle }} disponible)
                </option>
              </select>
            </div>
          </div>

          <div class="form-section">
            <h4 class="section-title">Type d'Ajustement</h4>
            <div class="adjustment-types">
              <div
                class="adjustment-type"
                :class="{ active: singleMovement.typeAjustement === 'POSITIF' }"
                @click="singleMovement.typeAjustement = 'POSITIF'"
              >
                <div class="adjustment-icon positive">+</div>
                <div class="adjustment-content">
                  <h5>Ajustement Positif</h5>
                  <p>Augmenter la quantité</p>
                </div>
              </div>
              <div
                class="adjustment-type"
                :class="{ active: singleMovement.typeAjustement === 'NEGATIF' }"
                @click="singleMovement.typeAjustement = 'NEGATIF'"
              >
                <div class="adjustment-icon negative">-</div>
                <div class="adjustment-content">
                  <h5>Ajustement Négatif</h5>
                  <p>Diminuer la quantité</p>
                </div>
              </div>
            </div>
          </div>

          <div class="form-section">
            <h4 class="section-title">Détails de l'Ajustement</h4>
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Quantité</label>
                <input
                  v-model.number="singleMovement.quantite"
                  type="number"
                  min="1"
                  class="form-input"
                  placeholder="Quantité à ajuster"
                />
              </div>
              <div class="form-group full-width">
                <label class="form-label">Raison de l'ajustement</label>
                <textarea
                  v-model="singleMovement.raison"
                  class="form-textarea"
                  rows="4"
                  placeholder="Expliquez la raison de cet ajustement..."
                ></textarea>
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" @click="resetAjustementForm" class="btn btn-secondary">
              Réinitialiser
            </button>
            <button type="submit" :disabled="isSubmitting" class="btn btn-warning">
              <span v-if="!isSubmitting">Enregistrer l'Ajustement</span>
              <span v-else>Enregistrement...</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Historique View -->
    <div v-if="currentView === 'historique'" class="action-view">
      <div class="view-header">
        <button @click="setView('selection')" class="back-btn">
          <ArrowLeftIcon class="w-5 h-5" />
          Retour
        </button>
        <div class="view-title">
          <div class="title-icon historique">
            <ClockIcon class="icon" />
          </div>
          <div class="title-content">
            <h2>Historique des Mouvements</h2>
            <p>Consultation et analyse des opérations</p>
          </div>
        </div>
      </div>

      <div class="view-content">
        <!-- Filters -->
        <div class="filters-container">
          <div class="filters-grid">
            <div class="filter-group">
              <label class="filter-label">Type</label>
              <select v-model="historyFilter.type" class="filter-input">
                <option value="">Tous les types</option>
                <option value="ENTREE">Entrées</option>
                <option value="SORTIE">Sorties</option>
                <option value="AJUSTEMENT">Ajustements</option>
              </select>
            </div>
            <div class="filter-group">
              <label class="filter-label">Boisson</label>
              <select v-model="historyFilter.beverage" class="filter-input">
                <option value="">Toutes les boissons</option>
                <option v-for="beverage in boissons" :key="beverage.id" :value="beverage.id">
                  {{ beverage.nom }}
                </option>
              </select>
            </div>
            <div class="filter-group">
              <label class="filter-label">Du</label>
              <input v-model="historyFilter.dateFrom" type="date" class="filter-input" />
            </div>
            <div class="filter-group">
              <label class="filter-label">Au</label>
              <input v-model="historyFilter.dateTo" type="date" class="filter-input" />
            </div>
            <div class="filter-actions">
              <button @click="clearHistoryFilters" class="btn btn-outline">Effacer</button>
              <button @click="loadLigneOperations" class="btn btn-primary">Filtrer</button>
            </div>
          </div>
        </div>

        <!-- Results Table -->
        <div class="table-container">
          <div class="table-header">
            <h4>Résultats ({{ paginatedLigneOperations.total }} mouvements)</h4>
            <button class="btn btn-outline">
              <DocumentArrowDownIcon class="w-4 h-4" />
              Exporter
            </button>
          </div>

          <div class="table-wrapper">
            <table class="data-table">
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
                <tr v-for="operation in paginatedLigneOperations.data" :key="operation.id">
                  <td>{{ formatDate(operation.mouvement?.dateMouvement) }}</td>
                  <td>
                    <span class="movement-badge" :class="operation.mouvement?.type?.toLowerCase()">
                      {{ getMovementTypeLabel(operation.mouvement?.type || '') }}
                    </span>
                  </td>
                  <td>{{ operation.lot?.boisson?.nom || '-' }}</td>
                  <td>{{ operation.lot?.numeroLot || '-' }}</td>
                  <td class="quantity-cell">{{ operation.quantite }}</td>
                  <td>{{ operation.mouvement?.utilisateur.email }}</td>
                  <td>
                    <span class="status-badge success">CONFIRMÉ</span>
                  </td>
                </tr>
                <tr v-if="paginatedLigneOperations.data.length === 0">
                  <td colspan="7" class="empty-state">
                    <div class="empty-content">
                      <ClockIcon class="empty-icon" />
                      <p>Aucun mouvement trouvé</p>
                      <span>Essayez de modifier vos filtres</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="pagination" v-if="paginatedLigneOperations.total > 0">
            <div class="pagination-info">
              Affichage de {{ (paginatedLigneOperations.page - 1) * paginatedLigneOperations.size + 1 }} à
              {{ Math.min(paginatedLigneOperations.page * paginatedLigneOperations.size, paginatedLigneOperations.total) }}
              sur {{ paginatedLigneOperations.total }} éléments
            </div>
            <div class="pagination-controls">
              <button
                @click="changePage(paginatedLigneOperations.page - 1)"
                :disabled="paginatedLigneOperations.page === 1"
                class="pagination-btn"
              >
                Précédent
              </button>
              <div class="pagination-numbers">
                <button
                  v-for="pageNum in visiblePages"
                  :key="pageNum"
                  @click="changePage(pageNum)"
                  :class="{ active: pageNum === paginatedLigneOperations.page }"
                  class="pagination-btn"
                >
                  {{ pageNum }}
                </button>
              </div>
              <button
                @click="changePage(paginatedLigneOperations.page + 1)"
                :disabled="paginatedLigneOperations.page === totalPages"
                class="pagination-btn"
              >
                Suivant
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading Animations -->
    <SortieLoadingAnimation v-if="isSortieProcessing" />
    <ProcessingAnimation v-if="isSubmitting && !isSortieProcessing" />

    <!-- Toast Messages -->
    <div v-if="message" class="toast" :class="messageType">
      {{ message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from 'vue'
import {
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  ClockIcon,
  DocumentArrowDownIcon,
  DocumentArrowUpIcon,
  PencilIcon,
  PlusIcon,
} from '@heroicons/vue/24/outline'
import {showToast} from './../utils/toast'

import {InventaireService} from '../api/features/inventaire/services/inventaireService'
import {BoissonService} from '../api/features/boisson/services/boissonService'
import {UtilisateurService} from '../api/features/utilisateurs/services/utilisateurService'

import SortieLoadingAnimation from '../components/common/SortieLoadingAnimation.vue'
import ProcessingAnimation from '../components/common/ProcessingAnimation.vue'

import type {Boisson} from '../api/features/boisson/models/boisson'
import type {Lot} from '../api/features/inventaire/models/lotModel'
import type {Mouvement} from '../api/features/inventaire/models/movementModel'
import type {LigneOperation} from '../api/features/inventaire/models/ligneOperation'
import type {Utilisateur} from '../api/features/utilisateurs/models/utilisateurModel'

import type {
  CreateMouvementAjustementRequest
} from '../api/features/inventaire/requests/createMouvementAjustementRequest'
import type {CreateMouvementSortieRequest} from '../api/features/inventaire/requests/createMouvementSortieRequest'
import type {CreateLotRequest} from '../api/features/inventaire/requests/createLotRequest'
import type {CreateLotBatchRequest} from '../api/features/inventaire/requests/createLotBatchRequest'
import {useMouvementsStore} from "../stores/inventaire/mouvements.ts";

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
  fournisseur: string // Added supplier field
}

interface MovementCSVRow {
  beverageName: string
  lotNumber: string
  quantity: number
  expiryDate: string
}

const isSubmitting = ref(false)
const isSortieProcessing = ref(false)
const message = ref('')
const messageType = ref<'success' | 'error'>('success')

const boissons = ref<Boisson[]>([])
const lots = ref<Lot[]>([])
const utilisateurs = ref<Utilisateur[]>([])
const mouvements = ref<Mouvement[]>([])
const mouvementStore = useMouvementsStore()
const singleMovement = ref<SingleMovementForm>({
  typeMouvement: '',
  boissonId: '',
  lotId: '',
  quantite: '',
  typeAjustement: '',
  raison: '',
  numeroLot: '',
  datePeremption: '',
  fournisseur: '', // Add supplier field initialization
})

const csvData = ref<MovementCSVRow[]>([])
const csvFileInput = ref<HTMLInputElement>()
const isProcessing = ref(false)

const historyFilter = ref({
  type: '',
  beverage: '',
  dateFrom: '',
  dateTo: '',
})

const paginatedLigneOperations = ref({
  data: [] as LigneOperation[],
  page: 1,
  size: 10,
  total: 0,
})

const pageSize = ref(10)
const currentPage = ref(1)

const loadData = async () => {
  try {
    const [beveragesData, lotsData, usersData] = await Promise.all([
      BoissonService.getAllBeverages(),
      InventaireService.getAllLots(),
      UtilisateurService.getAllUsers(),
    ])

    boissons.value = beveragesData
    lots.value = lotsData
    utilisateurs.value = usersData

    await loadLigneOperations()

    const currentUserId = getCurrentUserId()
    if (currentUserId) {
      mouvements.value = await InventaireService.getMovementsByUser(currentUserId)
    }
  } catch (error) {
    console.error('Error loading data:', error)
    showMessage('Erreur lors du chargement des données', 'error')
  }
}

const loadLigneOperations = async () => {
  try {
    paginatedLigneOperations.value = await mouvementStore.loadLigneOperations(currentPage.value, pageSize.value)
  } catch (error) {
    console.error('Error loading ligne operations:', error)
    showMessage("Erreur lors du chargement de l'historique", 'error')
  }
}

const totalMovements = computed(() => paginatedLigneOperations.value.total)
const todayMovements = computed(() => {
  const today = new Date().toDateString()
  return paginatedLigneOperations.value.data.filter(op =>
    new Date(op.mouvement?.dateMouvement || '').toDateString() === today
  ).length
})

const totalPages = computed(() => {
  return Math.ceil(paginatedLigneOperations.value.total / paginatedLigneOperations.value.size)
})

const visiblePages = computed(() => {
  const total = totalPages.value
  const current = paginatedLigneOperations.value.page
  const maxVisible = 5

  if (total <= maxVisible) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const half = Math.floor(maxVisible / 2)
  let start = Math.max(1, current - half)
  let end = Math.min(total, start + maxVisible - 1)

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})

// Navigation methods
const setView = (view: typeof currentView.value) => {
  currentView.value = view
  if (view === 'historique') {
    loadLigneOperations()
  }
}

const resetEntreeForm = () => {
  singleMovement.value = {
    typeMouvement: 'ENTREE',
    boissonId: '',
    lotId: '',
    quantite: '',
    typeAjustement: '',
    raison: '',
    numeroLot: '',
    datePeremption: '',
    fournisseur: '',
  }
}

const resetSortieForm = () => {
  singleMovement.value = {
    typeMouvement: 'SORTIE',
    boissonId: '',
    lotId: '',
    quantite: '',
    typeAjustement: '',
    raison: '',
    numeroLot: '',
    datePeremption: '',
    fournisseur: '',
  }
}

const resetAjustementForm = () => {
  singleMovement.value = {
    typeMouvement: 'AJUSTEMENT',
    boissonId: '',
    lotId: '',
    quantite: '',
    typeAjustement: '',
    raison: '',
    numeroLot: '',
    datePeremption: '',
    fournisseur: '',
  }
}

const submitEntree = async () => {
  singleMovement.value.typeMouvement = 'ENTREE'
  await submitSingleMovement()
}

const submitSortie = async () => {
  singleMovement.value.typeMouvement = 'SORTIE'
  await submitSingleMovement()
}

const submitAjustement = async () => {
  singleMovement.value.typeMouvement = 'AJUSTEMENT'
  await submitSingleMovement()
}

const ensureSortieAnimationDuration = async (callback: () => Promise<void>) => {
  const startTime = Date.now()

  try {
    await callback()
  } finally {
    const elapsedTime = Date.now() - startTime
    const remainingTime = Math.max(0, 3000 - elapsedTime)

    if (remainingTime > 0) {
      await new Promise((resolve) => setTimeout(resolve, remainingTime))
    }

    isSortieProcessing.value = false
  }
}

const submitSingleMovement = async () => {
  if (!validateSingleMovement()) return

  isSubmitting.value = true

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
        utilisateur: currentUser,
      }

      await InventaireService.recordMouvementSortie(sortieRequest)
      await loadData()
      resetSingleForm()
    })

    // Show success message and toast only after animation completes
    showMessage('Sortie enregistrée avec succès', 'success')
    handleSubmissionSuccess()
  } else {
    try {
      const currentUser = getCurrentUser()
      if (!currentUser) {
        showMessage('Utilisateur non trouvé', 'error')
        return
      }

      if (singleMovement.value.typeMouvement === 'ENTREE') {
        const selectedBoisson = boissons.value.find((b) => b.id === singleMovement.value.boissonId)
        if (!selectedBoisson) {
          showMessage('Boisson non trouvée', 'error')
          return
        }

        const lotRequest: CreateLotRequest = {
          lot: {
            numeroLot: singleMovement.value.numeroLot,
            quantiteInitiale: Number(singleMovement.value.quantite),
            datePeremption: singleMovement.value.datePeremption,
            fournisseur: singleMovement.value.fournisseur,
            boisson: selectedBoisson,
          },
          utilisateur: { id: currentUser.id },
        }

        await InventaireService.recordMouvementEntree(lotRequest)
        await loadData()
        resetSingleForm()

        setTimeout(() => {
          showMessage('Entrée enregistrée avec succès', 'success')
          handleSubmissionSuccess()
        }, 2000)
      } else if (singleMovement.value.typeMouvement === 'AJUSTEMENT') {
        const delta =
          singleMovement.value.typeAjustement === 'POSITIF'
            ? Math.abs(Number(singleMovement.value.quantite))
            : -Math.abs(Number(singleMovement.value.quantite))

        const ajustementRequest: CreateMouvementAjustementRequest = {
          lotId: Number(singleMovement.value.lotId),
          delta,
          typeAjustement: singleMovement.value.typeAjustement as 'POSITIF' | 'NEGATIF',
          raison: singleMovement.value.raison,
          utilisateur: currentUser,
        }

        await InventaireService.recordMouvementAjustement(ajustementRequest)
        await loadData()
        resetSingleForm()

        setTimeout(() => {
          showMessage('Ajustement enregistré avec succès', 'success')
          handleSubmissionSuccess()
        }, 2000)
      }

      await loadData()
      resetSingleForm()
    } catch (error) {
      console.error('Error submitting movement:', error)
      showMessage("Erreur lors de l'enregistrement du mouvement", 'error')
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
    if (!singleMovement.value.fournisseur.trim()) {
      showMessage('Veuillez saisir le nom du fournisseur', 'error')
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
      showMessage("Veuillez s��lectionner un type d'ajustement", 'error')
      return false
    }
    if (!singleMovement.value.raison.trim()) {
      showMessage("Veuillez saisir une raison pour l'ajustement", 'error')
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
    datePeremption: '',
    fournisseur: '',
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
      const rows = csvContent.split('\n').filter((row) => row.trim())
      const csvRows: MovementCSVRow[] = []

      for (let i = 1; i < rows.length; i++) {
        const columns = rows[i].split(',').map((col) => col.trim())
        if (columns.length >= 4) {
          csvRows.push({
            beverageName: columns[0],
            lotNumber: columns[1],
            quantity: Number(columns[2]),
            expiryDate: columns[3],
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

    const beverageMap = new Map<string, Boisson>()
    boissons.value.forEach((b) => beverageMap.set(b.nom.toLowerCase(), b))

    const validLots: Lot[] = []
    for (const row of csvData.value) {
      const boisson = beverageMap.get(row.beverageName.toLowerCase())
      if (boisson && row.quantity > 0 && validateCsvRow(row)) {
        validLots.push({
          numeroLot: row.lotNumber,
          quantiteInitiale: row.quantity,
          quantiteActuelle: row.quantity,
          datePeremption: row.expiryDate,
          boisson: boisson,
        })
      }
    }

    if (validLots.length === 0) {
      showMessage('Aucune donnée valide trouvée dans le CSV', 'error')
      return
    }

    const batchRequest: CreateLotBatchRequest = {
      lots: validLots,
      utilisateur: currentUser,
    }

    await InventaireService.recordMouvementEntreeBatch(batchRequest)

    await loadData()
    clearCsvData()
    showMessage(`${validLots.length} lots créés avec succès en une seule opération`, 'success')
  } catch (error) {
    console.error('Error processing CSV import:', error)
    showMessage("Erreur lors de l'import CSV", 'error')
  } finally {
    const elapsedTime = Date.now() - startTime
    const remainingTime = Math.max(0, 5000 - elapsedTime)

    if (remainingTime > 0) {
      await new Promise((resolve) => setTimeout(resolve, remainingTime))
    }

    isProcessing.value = false
    isSubmitting.value = false
  }
}

const validateCsvRow = (row: MovementCSVRow): boolean => {
  const beverage = boissons.value.find(
    (b) => b.nom.toLowerCase() === row.beverageName.toLowerCase()
  )
  return !!(
    beverage &&
    row.lotNumber &&
    row.quantity > 0 &&
    row.expiryDate &&
    new Date(row.expiryDate) > new Date()
  )
}

const hasValidCsvRows = computed(() => {
  return csvData.value.length > 0 && csvData.value.some((row) => validateCsvRow(row))
})

const triggerCsvUpload = () => {
  csvFileInput.value?.click()
}



const showMessage = (text: string, type: 'success' | 'error') => {
  message.value = text
  messageType.value = type
  setTimeout(() => {
    message.value = ''
  }, 5000)
}

const handleSubmissionSuccess = () => {
  showToast('Submission successful!', 'success')
}

const formatDate = (dateStr: string | undefined) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const getMovementTypeLabel = (type: string) => {
  switch (type) {
    case 'ENTREE':
      return 'Entrée'
    case 'SORTIE':
      return 'Sortie'
    case 'AJUSTEMENT':
      return 'Ajustement'
    default:
      return type
  }
}


const clearHistoryFilters = async () => {
  historyFilter.value = {
    type: '',
    beverage: '',
    dateFrom: '',
    dateTo: '',
  }
  await loadLigneOperations()
}


const currentView = ref<'selection' | 'entree' | 'sortie' | 'ajustement' | 'historique'>('selection')
const entreeMethod = ref<'single' | 'csv'>('single')

const changePage = async (page: number) => {
  if (page < 1 || page > totalPages.value) return

  currentPage.value = page
  await loadLigneOperations()
}



const getCurrentUserId = (): number => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  return user.id || 1
}

const getCurrentUser = (): Utilisateur | undefined => {
  return utilisateurs.value.find((u) => u.id === getCurrentUserId())
}

// Helper method to get available stock
const getAvailableStock = (boissonId: number | string): number => {
  return lots.value
    .filter(lot => lot.boisson.id === Number(boissonId))
    .reduce((total, lot) => total + (lot.quantiteActuelle || 0), 0)
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.movements-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 2rem;
}

/* Page Header */
.page-header {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(226, 232, 240, 0.8);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #1e293b, #475569);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
}

.page-subtitle {
  color: #64748b;
  font-size: 1.1rem;
  font-weight: 500;
}

.quick-stats {
  display: flex;
  gap: 2rem;
}

.stat-item {
  text-align: center;
  padding: 1rem;
  background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
  border-radius: 16px;
  min-width: 120px;
}

.stat-value {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
}

.stat-label {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
}

/* Action Selection Grid */
.action-selection {
  max-width: 1200px;
  margin: 0 auto;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.action-card {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.action-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  transition: all 0.3s ease;
}

.action-card.entree::before { background: linear-gradient(90deg, #10b981, #34d399); }
.action-card.sortie::before { background: linear-gradient(90deg, #ef4444, #f87171); }
.action-card.ajustement::before { background: linear-gradient(90deg, #f59e0b, #fbbf24); }
.action-card.historique::before { background: linear-gradient(90deg, #6366f1, #8b5cf6); }

.action-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.action-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
}

.action-card.entree .action-icon { background: linear-gradient(135deg, #10b981, #34d399); }
.action-card.sortie .action-icon { background: linear-gradient(135deg, #ef4444, #f87171); }
.action-card.ajustement .action-icon { background: linear-gradient(135deg, #f59e0b, #fbbf24); }
.action-card.historique .action-icon { background: linear-gradient(135deg, #6366f1, #8b5cf6); }

.action-icon .icon {
  width: 32px;
  height: 32px;
  color: white;
}

.action-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.action-description {
  color: #64748b;
  font-size: 1rem;
  margin-bottom: 1rem;
  line-height: 1.6;
}

.action-features {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.feature {
  color: #475569;
  font-size: 0.875rem;
  font-weight: 500;
}

.action-arrow {
  position: absolute;
  top: 2rem;
  right: 2rem;
  opacity: 0;
  transition: all 0.3s ease;
}

.action-card:hover .action-arrow {
  opacity: 1;
  transform: translateX(8px);
}

.arrow-icon {
  width: 24px;
  height: 24px;
  color: #64748b;
}

/* Action Views */
.action-view {
  max-width: 1000px;
  margin: 0 auto;
}

.view-header {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  color: #64748b;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
  color: #475569;
}

.view-title {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.title-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.title-icon.entree { background: linear-gradient(135deg, #10b981, #34d399); }
.title-icon.sortie { background: linear-gradient(135deg, #ef4444, #f87171); }
.title-icon.ajustement { background: linear-gradient(135deg, #f59e0b, #fbbf24); }
.title-icon.historique { background: linear-gradient(135deg, #6366f1, #8b5cf6); }

.title-icon .icon {
  width: 24px;
  height: 24px;
  color: white;
}

.title-content h2 {
  font-size: 1.875rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.title-content p {
  color: #64748b;
  margin: 0;
  font-weight: 500;
}

.view-content {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

/* Entry Methods */
.entry-methods {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 2rem;
}

.method-card {
  padding: 1.5rem;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.method-card:hover,
.method-card.active {
  border-color: #10b981;
  background: linear-gradient(135deg, #f0fdf4, #dcfce7);
}

.method-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #10b981, #34d399);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
}

.method-icon .icon {
  width: 24px;
  height: 24px;
  color: white;
}

.method-card h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.method-card p {
  color: #64748b;
  font-size: 0.875rem;
}

/* Forms */
.form-container,
.csv-container {
  margin-top: 2rem;
}

.elegant-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-section {
  background: #f8fafc;
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid #e2e8f0;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e2e8f0;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-label {
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.form-input,
.form-textarea {
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

/* Adjustment Types */
.adjustment-types {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.adjustment-type {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.adjustment-type:hover,
.adjustment-type.active {
  border-color: #10b981;
  background: linear-gradient(135deg, #f0fdf4, #dcfce7);
}

.adjustment-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
}

.adjustment-icon.positive {
  background: linear-gradient(135deg, #10b981, #34d399);
}

.adjustment-icon.negative {
  background: linear-gradient(135deg, #ef4444, #f87171);
}

.adjustment-content h5 {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.25rem 0;
}

.adjustment-content p {
  color: #64748b;
  font-size: 0.875rem;
  margin: 0;
}

/* CSV Upload */
.csv-upload-zone {
  border: 3px dashed #cbd5e1;
  border-radius: 20px;
  padding: 3rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
}

.csv-upload-zone:hover {
  border-color: #10b981;
  background: linear-gradient(135deg, #f0fdf4, #dcfce7);
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.upload-icon {
  width: 64px;
  height: 64px;
  color: #64748b;
}

.upload-content h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.upload-content p {
  color: #64748b;
  font-size: 1rem;
  margin: 0;
}

.upload-info {
  color: #94a3b8;
  font-size: 0.875rem;
}

/* CSV Preview */
.csv-preview-container {
  margin-top: 2rem;
  background: #f8fafc;
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid #e2e8f0;
}

.csv-preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.csv-preview-header h4 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.csv-table-container {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  margin-bottom: 1.5rem;
}

.csv-table {
  width: 100%;
  border-collapse: collapse;
}

.csv-table th,
.csv-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

.csv-table th {
  background: #f8fafc;
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.status-valid {
  color: #10b981;
  font-weight: 600;
}

.status-invalid {
  color: #ef4444;
  font-weight: 600;
}

.csv-actions {
  display: flex;
  justify-content: flex-end;
}

/* Filters */
.filters-container {
  background: #f8fafc;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  border: 1px solid #e2e8f0;
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  align-items: end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-label {
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.filter-input {
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  background: white;
}

.filter-input:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.filter-actions {
  display: flex;
  gap: 0.5rem;
}

/* Data Table */
.table-container {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.table-header h4 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.table-wrapper {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 1rem 1.5rem;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

.data-table th {
  background: #f8fafc;
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  position: sticky;
  top: 0;
}

.data-table tbody tr:hover {
  background: #f8fafc;
}

.quantity-cell {
  font-weight: 600;
  color: #1e293b;
}

.movement-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.375rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.movement-badge.entree {
  background: #dcfce7;
  color: #166534;
}

.movement-badge.sortie {
  background: #fecaca;
  color: #991b1b;
}

.movement-badge.ajustement {
  background: #fef3c7;
  color: #92400e;
}

.status-badge {
  display: inline-block;
  padding: 0.375rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.status-badge.success {
  background: #dcfce7;
  color: #166534;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 3rem;
}

.empty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.empty-icon {
  width: 48px;
  height: 48px;
  color: #94a3b8;
}

.empty-content p {
  font-weight: 600;
  color: #64748b;
  margin: 0;
}

.empty-content span {
  color: #94a3b8;
  font-size: 0.875rem;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
}

.pagination-info {
  color: #64748b;
  font-size: 0.875rem;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pagination-numbers {
  display: flex;
  gap: 0.25rem;
}

.pagination-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: white;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pagination-btn:hover:not(:disabled) {
  background: #f9fafb;
  border-color: #9ca3af;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-btn.active {
  background: #10b981;
  border-color: #10b981;
  color: white;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: linear-gradient(135deg, #10b981, #34d399);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
}

.btn-secondary {
  background: #f1f5f9;
  color: #64748b;
  border: 2px solid #e2e8f0;
}

.btn-secondary:hover:not(:disabled) {
  background: #e2e8f0;
  color: #475569;
}

.btn-success {
  background: linear-gradient(135deg, #10b981, #34d399);
  color: white;
}

.btn-success:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
}

.btn-danger {
  background: linear-gradient(135deg, #ef4444, #f87171);
  color: white;
}

.btn-danger:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(239, 68, 68, 0.3);
}

.btn-warning {
  background: linear-gradient(135deg, #f59e0b, #fbbf24);
  color: white;
}

.btn-warning:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(245, 158, 11, 0.3);
}

.btn-outline {
  background: transparent;
  color: #64748b;
  border: 2px solid #e2e8f0;
}

.btn-outline:hover:not(:disabled) {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 2rem;
  border-top: 1px solid #e2e8f0;
}

/* Toast Messages */
.toast {
  position: fixed;
  top: 2rem;
  right: 2rem;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  color: white;
  font-weight: 600;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  animation: slideInToast 0.3s ease-out;
}

.toast.success {
  background: linear-gradient(135deg, #10b981, #34d399);
}

.toast.error {
  background: linear-gradient(135deg, #ef4444, #f87171);
}

@keyframes slideInToast {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .movements-page {
    padding: 1rem;
  }

  .actions-grid {
    grid-template-columns: 1fr;
  }

  .header-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .quick-stats {
    flex-direction: row;
    gap: 1rem;
  }

  .view-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .form-grid,
  .filters-grid {
    grid-template-columns: 1fr;
  }

  .entry-methods {
    grid-template-columns: 1fr;
  }

  .adjustment-types {
    grid-template-columns: 1fr;
  }

  .pagination {
    flex-direction: column;
    gap: 1rem;
  }

  .table-wrapper {
    font-size: 0.875rem;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 2rem;
  }

  .action-card {
    padding: 1.5rem;
  }

  .view-content {
    padding: 1rem;
  }

  .form-section {
    padding: 1rem;
  }
}
</style>
