<template>
  <div class="lots-page">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-text">
          <h1 class="page-title">Lots et Batches</h1>
          <p class="page-subtitle">
            Vue d'ensemble des lots avec numéros de série et dates d'expiration
          </p>
        </div>
        <div class="header-actions">
          <button
              @click="loadLots"
              class="add-btn secondary"
              :disabled="loading"
          >
            <ArrowPathIcon
                class="w-4 h-4"
                :class="{ 'animate-spin': loading }"
            />
            Actualiser
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Chargement des lots...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <div class="error-icon">⚠️</div>
      <h3>Erreur lors du chargement</h3>
      <p>{{ error }}</p>
      <button @click="loadLots" class="retry-btn">Réessayer</button>
    </div>

    <!-- Main Content -->
    <div v-else>
      <!-- Filters -->
      <div class="filters-section">
        <div class="filters-container">
          <select v-model="statusFilter" class="filter-select">
            <option value="all">Tous les statuts</option>
            <option value="active">Actifs</option>
            <option value="expiring">Bientôt expirés</option>
            <option value="expired">Expirés</option>
          </select>

          <select v-model="beverageFilter" class="filter-select">
            <option value="all">Toutes les boissons</option>
            <option
                v-for="beverage in availableBeverages"
                :key="beverage"
                :value="beverage"
            >
              {{ beverage }}
            </option>
          </select>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="lots.length === 0" class="empty-state">
        <div class="empty-icon">📦</div>
        <h3>Aucun lot trouvé</h3>
        <p>Commencez par créer votre premier lot</p>
      </div>

      <!-- Lots Cards Grid -->
      <div v-else class="lots-grid">
        <div
            v-for="lot in filteredLots"
            :key="lot.id"
            class="lot-card"
            :class="getExpiryStatusClass(lot.datePeremption, lot.vendable)"
        >
          <div class="lot-header">
            <div class="lot-info">
              <h3 class="lot-number">{{ lot.numeroLot }}</h3>
              <p class="lot-beverage">{{ lot.boisson.nom }}</p>
            </div>
            <div
                class="lot-status-badge"
                :class="getExpiryStatusClass(lot.datePeremption, lot.vendable)"
            >
              {{ getStatusText(lot.datePeremption, lot.vendable) }}
            </div>
          </div>

          <div class="lot-details">
            <div class="detail-row">
              <span class="detail-label">Quantité initiale:</span>
              <span class="detail-value">{{ lot.quantiteInitiale }} unités</span>
            </div>

            <div class="detail-row">
              <span class="detail-label">Quantité actuelle:</span>
              <span class="detail-value">{{ lot.quantiteActuelle }} unités</span>
            </div>

            <div class="detail-row">
              <span class="detail-label">Date d'entrée:</span>
              <span class="detail-value">
                {{ formatDate(lot.dateEntree!) }}
              </span>
            </div>

            <div class="detail-row">
              <span class="detail-label">Date d'expiration:</span>
              <span
                  class="detail-value expiry"
                  :class="getExpiryStatusClass(lot.datePeremption, lot.vendable)"
              >
                {{ formatDate(lot.datePeremption) }}
              </span>
            </div>

            <div class="detail-row">
              <span class="detail-label">Jours restants:</span>
              <span
                  class="detail-value"
                  :class="getExpiryStatusClass(lot.datePeremption, lot.vendable)"
              >
                {{ getDaysRemaining(lot.datePeremption) }}
              </span>
            </div>
          </div>

          <div class="lot-actions">
            <router-link
                :to="`/movements?lot=${lot.numeroLot}`"
                class="action-link"
                title="Voir les mouvements de ce lot"
            >
              <EyeIcon class="w-4 h-4" />
              Voir Mouvements
            </router-link>
          </div>
        </div>
      </div>

      <!-- Summary Stats -->
      <div class="summary-section">
        <div class="summary-cards">
          <div class="summary-card">
            <div class="summary-icon active">📦</div>
            <div class="summary-content">
              <h4>Lots Actifs</h4>
              <p>{{ activeLotCount }} lots</p>
            </div>
          </div>

          <div class="summary-card">
            <div class="summary-icon warning">⚠️</div>
            <div class="summary-content">
              <h4>Bientôt Expirés</h4>
              <p>{{ expiringLotCount }} lots</p>
            </div>
          </div>

          <div class="summary-card">
            <div class="summary-icon expired">❌</div>
            <div class="summary-content">
              <h4>Expirés</h4>
              <p>{{ expiredLotCount }} lots</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { EyeIcon, ArrowPathIcon } from '@heroicons/vue/24/outline'
import { InventaireService, BoissonService } from '../api'
import type { Lot } from '../api'
import type { Boisson } from '../api'
import { showToast } from './../utils/toast'

/* ------------------------------------------------------------------ */
/*  STATE                                                             */
/* ------------------------------------------------------------------ */

const lots        = ref<Lot[]>([])
const beverages   = ref<Boisson[]>([])
const loading     = ref(false)
const error       = ref('')

const statusFilter   = ref<'all' | 'active' | 'expiring' | 'expired'>('all')
const beverageFilter = ref<string>('all')

/* ------------------------------------------------------------------ */
/*  COMPUTED                                                          */
/* ------------------------------------------------------------------ */

const availableBeverages = computed(() =>
    [...new Set(lots.value.map(lot => lot.boisson.nom))]
)

const filteredLots = computed(() => {
  let result = lots.value

  /* Filtre boisson */
  if (beverageFilter.value !== 'all') {
    result = result.filter(lot => lot.boisson.nom === beverageFilter.value)
  }

  /* Filtre statut */
  if (statusFilter.value !== 'all') {
    result = result.filter(lot =>
        getExpiryStatus(lot.datePeremption, lot.vendable) === statusFilter.value
    )
  }

  /* Tri par date d’expiration croissante */
  return result.sort(
      (a, b) =>
          new Date(a.datePeremption).getTime() -
          new Date(b.datePeremption).getTime()
  )
})

const activeLotCount = computed(
    () =>
        lots.value.filter(
            lot =>
                lot.vendable &&
                getExpiryStatus(lot.datePeremption, lot.vendable) === 'active'
        ).length
)

const expiringLotCount = computed(
    () =>
        lots.value.filter(
            lot =>
                lot.vendable &&
                getExpiryStatus(lot.datePeremption, lot.vendable) === 'expiring'
        ).length
)

const expiredLotCount = computed(
    () =>
        lots.value.filter(
            lot => getExpiryStatus(lot.datePeremption, lot.vendable) === 'expired'
        ).length
)

/* ------------------------------------------------------------------ */
/*  HELPERS                                                           */
/* ------------------------------------------------------------------ */

/** Renvoie 'expired' si le lot n’est pas vendable */
const getExpiryStatus = (
    expiryDate: string,
    vendable: boolean
): 'active' | 'expiring' | 'expired' => {
  if (!vendable) return 'expired'

  const today   = new Date()
  const expiry  = new Date(expiryDate)
  const diffDays = Math.ceil(
      (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  )

  if (diffDays < 0) return 'expired'
  if (diffDays <= 30) return 'expiring'
  return 'active'
}

const getExpiryStatusClass = (expiryDate: string, vendable: boolean) =>
    `status-${getExpiryStatus(expiryDate, vendable)}`

const getStatusText = (expiryDate: string, vendable: boolean) => {
  switch (getExpiryStatus(expiryDate, vendable)) {
    case 'active':
      return 'Actif'
    case 'expiring':
      return 'Bientôt expiré'
    case 'expired':
      return 'Expiré'
    default:
      return 'Actif'
  }
}

const getDaysRemaining = (expiryDate: string) => {
  const today   = new Date()
  const expiry  = new Date(expiryDate)
  const diffDays = Math.ceil(
      (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  )

  if (diffDays < 0)  return `Expiré depuis ${Math.abs(diffDays)} jours`
  if (diffDays === 0) return 'Expire aujourd’hui'
  if (diffDays === 1) return 'Expire demain'
  return `${diffDays} jours`
}

const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('fr-FR')

/* ------------------------------------------------------------------ */
/*  DATA FETCH                                                        */
/* ------------------------------------------------------------------ */

const loadLots = async () => {
  loading.value = true
  error.value   = ''
  try {
    const [lotsData, beveragesData] = await Promise.all([
      InventaireService.getAllLots(),
      BoissonService.getAllBeverages()
    ])
    lots.value      = lotsData
    beverages.value = beveragesData
  } catch (err) {
    console.error('Error loading lots:', err)
    error.value = 'Erreur lors du chargement des lots'
    showToast(error.value, 'error')
  } finally {
    loading.value = false
  }
}

onMounted(loadLots)
</script>
<style scoped>
.lots-page {
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
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  border: none;
  border-radius: var(--radius-lg);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  text-decoration: none;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.add-btn.primary {
  background: var(--color-primary-500);
  color: var(--color-text-inverse);
}

.add-btn.primary:hover {
  background: var(--color-primary-600);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.add-btn.secondary {
  background: var(--color-bg-secondary);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border-light);
}

.add-btn.secondary:hover {
  background: var(--color-bg-tertiary);
  color: var(--color-text-primary);
}

.add-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.add-btn:disabled:hover {
  transform: none;
  box-shadow: none;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-12);
  text-align: center;
}

.loading-spinner {
  width: 3rem;
  height: 3rem;
  border: 3px solid var(--color-border-light);
  border-top: 3px solid var(--color-primary-500);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: var(--space-4);
}

.loading-state p {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
}

/* Error State */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-12);
  text-align: center;
}

.error-icon {
  font-size: 3rem;
  margin-bottom: var(--space-4);
}

.error-state h3 {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-2);
}

.error-state p {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-4);
}

.retry-btn {
  padding: var(--space-3) var(--space-4);
  background: var(--color-primary-500);
  color: var(--color-text-inverse);
  border: none;
  border-radius: var(--radius-lg);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.retry-btn:hover {
  background: var(--color-primary-600);
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-12);
  text-align: center;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: var(--space-4);
  opacity: 0.6;
}

.empty-state h3 {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-2);
}

.empty-state p {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-4);
}

/* Filters */
.filters-section {
  background: var(--color-bg-primary);
  border-radius: var(--radius-xl);
  padding: var(--space-4);
  box-shadow: var(--shadow-sm);
}

.filters-container {
  display: flex;
  gap: var(--space-3);
}

.filter-select {
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
}

.filter-select:focus {
  outline: none;
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 3px var(--color-primary-100);
}

/* Lots Grid */
.lots-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: var(--space-4);
}

.lot-card {
  background: var(--color-bg-primary);
  border-radius: var(--radius-xl);
  padding: var(--space-5);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-fast);
  border-left: 4px solid transparent;
}

.lot-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.lot-card.status-active {
  border-left-color: var(--color-success-500);
}

.lot-card.status-expiring {
  border-left-color: var(--color-warning-500);
}

.lot-card.status-expired {
  border-left-color: var(--color-error-500);
}

.lot-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-4);
}

.lot-number {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-1);
}

.lot-beverage {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.lot-status-badge {
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.lot-status-badge.status-active {
  background: var(--color-success-50);
  color: var(--color-success-700);
}

.lot-status-badge.status-expiring {
  background: var(--color-warning-50);
  color: var(--color-warning-700);
}

.lot-status-badge.status-expired {
  background: var(--color-error-50);
  color: var(--color-error-700);
}

.lot-details {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.detail-value {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.detail-value.status-active {
  color: var(--color-success-600);
}

.detail-value.status-expiring {
  color: var(--color-warning-600);
}

.detail-value.status-expired {
  color: var(--color-error-600);
}

.lot-actions {
  border-top: 1px solid var(--color-border-light);
  padding-top: var(--space-3);
  display: flex;
  gap: var(--space-2);
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.action-btn.secondary {
  background: var(--color-bg-secondary);
  color: var(--color-text-secondary);
}

.action-btn.secondary:hover {
  background: var(--color-bg-tertiary);
  color: var(--color-text-primary);
}

.action-link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  background: var(--color-bg-secondary);
  color: var(--color-text-secondary);
  text-decoration: none;
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  transition: all var(--transition-fast);
}

.action-link:hover {
  background: var(--color-primary-50);
  color: var(--color-primary-600);
}

/* Summary */
.summary-section {
  background: var(--color-bg-primary);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  box-shadow: var(--shadow-sm);
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-4);
}

.summary-card {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
}

.summary-icon {
  font-size: var(--font-size-2xl);
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  flex-shrink: 0;
}

.summary-content h4 {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-1);
}

.summary-content p {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: var(--color-bg-primary);
  border-radius: var(--radius-xl);
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--shadow-xl);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-6) var(--space-6) var(--space-4);
  border-bottom: 1px solid var(--color-border-light);
}

.modal-header h2 {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
}

.close-btn {
  padding: var(--space-1);
  background: none;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.close-btn:hover {
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
}

.modal-form {
  padding: var(--space-6);
}

.form-group {
  margin-bottom: var(--space-4);
}

.form-group label {
  display: block;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  margin-bottom: var(--space-2);
}

.form-input,
.form-select {
  width: 100%;
  padding: var(--space-3);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  transition: all var(--transition-fast);
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 3px var(--color-primary-100);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  cursor: pointer;
}

.form-checkbox {
  width: auto;
  margin: 0;
}

.modal-actions {
  display: flex;
  gap: var(--space-3);
  justify-content: flex-end;
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-border-light);
}

.cancel-btn,
.save-btn {
  padding: var(--space-3) var(--space-4);
  border: none;
  border-radius: var(--radius-lg);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.cancel-btn {
  background: var(--color-bg-secondary);
  color: var(--color-text-secondary);
}

.cancel-btn:hover {
  background: var(--color-bg-tertiary);
  color: var(--color-text-primary);
}

.save-btn {
  background: var(--color-primary-500);
  color: var(--color-text-inverse);
}

.save-btn:hover {
  background: var(--color-primary-600);
}

.save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.save-btn:disabled:hover {
  background: var(--color-primary-500);
}

/* Responsive */
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

  .lots-grid {
    grid-template-columns: 1fr;
  }

  .summary-cards {
    grid-template-columns: 1fr;
  }

  .modal-content {
    width: 95%;
    margin: var(--space-4);
  }

  .lot-actions {
    flex-direction: column;
  }
}
</style>
