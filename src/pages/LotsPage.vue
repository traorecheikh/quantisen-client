<template>
  <div class="lots-page">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-text">
          <h1 class="page-title">Lots et Batches</h1>
          <p class="page-subtitle">Vue d'ensemble des lots avec numéros de série et dates d'expiration</p>
        </div>
        <div class="header-actions">
          <router-link to="/movements" class="add-btn primary">
            <PlusIcon class="w-4 h-4" />
            Ajouter un Lot
          </router-link>
        </div>
      </div>
    </div>

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
          <option v-for="beverage in availableBeverages" :key="beverage" :value="beverage">
            {{ beverage }}
          </option>
        </select>
      </div>
    </div>

    <!-- Lots Cards Grid -->
    <div class="lots-grid">
      <div
        v-for="lot in filteredLots"
        :key="lot.id"
        class="lot-card"
        :class="getExpiryStatusClass(lot.expiryDate)"
      >
        <div class="lot-header">
          <div class="lot-info">
            <h3 class="lot-number">{{ lot.lotNumber }}</h3>
            <p class="lot-beverage">{{ lot.beverageName }}</p>
          </div>
          <div class="lot-status-badge" :class="getExpiryStatusClass(lot.expiryDate)">
            {{ getStatusText(lot.expiryDate) }}
          </div>
        </div>

        <div class="lot-details">
          <div class="detail-row">
            <span class="detail-label">Quantité initiale:</span>
            <span class="detail-value">{{ lot.quantity }} unités</span>
          </div>

          <div class="detail-row">
            <span class="detail-label">Date d'entrée:</span>
            <span class="detail-value">{{ formatDate(lot.date) }}</span>
          </div>

          <div class="detail-row">
            <span class="detail-label">Date d'expiration:</span>
            <span class="detail-value expiry" :class="getExpiryStatusClass(lot.expiryDate)">
              {{ formatDate(lot.expiryDate) }}
            </span>
          </div>

          <div class="detail-row">
            <span class="detail-label">Jours restants:</span>
            <span class="detail-value" :class="getExpiryStatusClass(lot.expiryDate)">
              {{ getDaysRemaining(lot.expiryDate) }}
            </span>
          </div>
        </div>

        <div class="lot-actions">
          <router-link
            :to="`/movements?lot=${lot.lotNumber}`"
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
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { PlusIcon, EyeIcon } from '@heroicons/vue/24/outline'

interface Lot {
  id: number
  lotNumber: string
  beverageName: string
  quantity: number
  date: string
  expiryDate: string
}

const statusFilter = ref('all')
const beverageFilter = ref('all')

// Sample lots data - these would come from movements with lot information
const lots = ref<Lot[]>([
  {
    id: 1,
    lotNumber: 'LOT-2025-001',
    beverageName: 'Coca-Cola 330ml',
    quantity: 100,
    date: '2025-07-10',
    expiryDate: '2025-12-15'
  },
  {
    id: 2,
    lotNumber: 'LOT-2025-002',
    beverageName: 'Fanta Orange 330ml',
    quantity: 75,
    date: '2025-07-09',
    expiryDate: '2025-11-30'
  },
  {
    id: 3,
    lotNumber: 'LOT-2024-045',
    beverageName: 'Sprite 500ml',
    quantity: 50,
    date: '2024-12-01',
    expiryDate: '2025-08-15'
  },
  {
    id: 4,
    lotNumber: 'LOT-2024-032',
    beverageName: 'Pepsi 500ml',
    quantity: 80,
    date: '2024-10-15',
    expiryDate: '2025-07-05' // Expired
  }
])

const availableBeverages = computed(() =>
  [...new Set(lots.value.map(lot => lot.beverageName))]
)

const filteredLots = computed(() => {
  let filtered = lots.value

  if (beverageFilter.value !== 'all') {
    filtered = filtered.filter(lot => lot.beverageName === beverageFilter.value)
  }

  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(lot => {
      const status = getExpiryStatus(lot.expiryDate)
      return status === statusFilter.value
    })
  }

  return filtered.sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime())
})

const activeLotCount = computed(() =>
  lots.value.filter(lot => getExpiryStatus(lot.expiryDate) === 'active').length
)

const expiringLotCount = computed(() =>
  lots.value.filter(lot => getExpiryStatus(lot.expiryDate) === 'expiring').length
)

const expiredLotCount = computed(() =>
  lots.value.filter(lot => getExpiryStatus(lot.expiryDate) === 'expired').length
)

const getExpiryStatus = (expiryDate: string) => {
  const today = new Date()
  const expiry = new Date(expiryDate)
  const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return 'expired'
  if (diffDays <= 30) return 'expiring'
  return 'active'
}

const getExpiryStatusClass = (expiryDate: string) => {
  return `status-${getExpiryStatus(expiryDate)}`
}

const getStatusText = (expiryDate: string) => {
  switch (getExpiryStatus(expiryDate)) {
    case 'active': return 'Actif'
    case 'expiring': return 'Bientôt expiré'
    case 'expired': return 'Expiré'
    default: return 'Actif'
  }
}

const getDaysRemaining = (expiryDate: string) => {
  const today = new Date()
  const expiry = new Date(expiryDate)
  const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return `Expiré depuis ${Math.abs(diffDays)} jours`
  if (diffDays === 0) return 'Expire aujourd\'hui'
  if (diffDays === 1) return 'Expire demain'
  return `${diffDays} jours`
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('fr-FR')
}
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

.add-btn {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  border: none;
  border-radius: var(--radius-lg);
  background: var(--color-primary-500);
  color: var(--color-text-inverse);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  text-decoration: none;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.add-btn:hover {
  background: var(--color-primary-600);
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

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: stretch;
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
}
</style>
