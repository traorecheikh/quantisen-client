<template>
  <div class="stocks-page">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-text">
          <h1 class="page-title">Vue d'ensemble des stocks</h1>
          <p class="page-subtitle">Surveillance des niveaux de stock actuels pour toutes les boissons</p>
        </div>
        <div class="header-actions">
          <div class="filter-group">
            <select v-model="statusFilter" class="filter-select">
              <option value="all">Tous les statuts</option>
              <option value="normal">Stock normal</option>
              <option value="low">Stock faible</option>
              <option value="critical">Stock critique</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Stock Cards Grid -->
    <div class="stocks-grid">
      <div
        v-for="stock in filteredStocks"
        :key="stock.id"
        class="stock-card"
        :class="getStockStatusClass(stock)"
      >
        <div class="stock-header">
          <h3 class="stock-name">{{ stock.name }}</h3>
          <div class="stock-status-badge" :class="getStockStatusClass(stock)">
            {{ getStatusText(stock.status) }}
          </div>
        </div>

        <div class="stock-details">
          <div class="stock-quantity">
            <span class="quantity-current">{{ stock.currentQuantity }}</span>
            <span class="quantity-unit">unités</span>
          </div>

          <div class="stock-threshold">
            <div class="threshold-bar">
              <div
                class="threshold-fill"
                :style="{ width: getThresholdPercentage(stock) + '%' }"
                :class="getStockStatusClass(stock)"
              ></div>
            </div>
            <span class="threshold-text">Seuil: {{ stock.threshold }}</span>
          </div>
        </div>

        <div class="stock-meta">
          <span class="last-updated">Dernière mise à jour: {{ stock.lastUpdated }}</span>
        </div>
      </div>
    </div>

    <!-- Summary Stats -->
    <div class="summary-section">
      <div class="summary-cards">
        <div class="summary-card">
          <div class="summary-icon normal">📦</div>
          <div class="summary-content">
            <h4>Stock Normal</h4>
            <p>{{ normalStockCount }} produits</p>
          </div>
        </div>

        <div class="summary-card">
          <div class="summary-icon warning">⚠️</div>
          <div class="summary-content">
            <h4>Stock Faible</h4>
            <p>{{ lowStockCount }} produits</p>
          </div>
        </div>

        <div class="summary-card">
          <div class="summary-icon critical">🚨</div>
          <div class="summary-content">
            <h4>Stock Critique</h4>
            <p>{{ criticalStockCount }} produits</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Stock {
  id: number
  name: string
  currentQuantity: number
  threshold: number
  status: 'normal' | 'low' | 'critical'
  lastUpdated: string
}

const statusFilter = ref('all')

// Sample stock data
const stocks = ref<Stock[]>([
  {
    id: 1,
    name: 'Coca-Cola 330ml',
    currentQuantity: 180,
    threshold: 50,
    status: 'normal',
    lastUpdated: '11/07/2025'
  },
  {
    id: 2,
    name: 'Fanta Orange 330ml',
    currentQuantity: 25,
    threshold: 40,
    status: 'low',
    lastUpdated: '10/07/2025'
  },
  {
    id: 3,
    name: 'Sprite 330ml',
    currentQuantity: 8,
    threshold: 30,
    status: 'critical',
    lastUpdated: '11/07/2025'
  },
  {
    id: 4,
    name: 'Pepsi 500ml',
    currentQuantity: 95,
    threshold: 35,
    status: 'normal',
    lastUpdated: '11/07/2025'
  },
  {
    id: 5,
    name: 'Orangina 250ml',
    currentQuantity: 15,
    threshold: 25,
    status: 'low',
    lastUpdated: '09/07/2025'
  }
])

const filteredStocks = computed(() => {
  if (statusFilter.value === 'all') return stocks.value
  return stocks.value.filter(stock => stock.status === statusFilter.value)
})

const normalStockCount = computed(() =>
  stocks.value.filter(stock => stock.status === 'normal').length
)

const lowStockCount = computed(() =>
  stocks.value.filter(stock => stock.status === 'low').length
)

const criticalStockCount = computed(() =>
  stocks.value.filter(stock => stock.status === 'critical').length
)

const getStockStatusClass = (stock: Stock) => {
  return `status-${stock.status}`
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'normal': return 'Normal'
    case 'low': return 'Faible'
    case 'critical': return 'Critique'
    default: return 'Normal'
  }
}

const getThresholdPercentage = (stock: Stock) => {
  const maxQuantity = Math.max(stock.currentQuantity, stock.threshold * 2)
  return Math.min((stock.currentQuantity / maxQuantity) * 100, 100)
}
</script>

<style scoped>
.stocks-page {
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

.filter-select {
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
}

.stocks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--space-4);
}

.stock-card {
  background: var(--color-bg-primary);
  border-radius: var(--radius-xl);
  padding: var(--space-5);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-fast);
  border-left: 4px solid transparent;
}

.stock-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.stock-card.status-normal {
  border-left-color: var(--color-success-500);
}

.stock-card.status-low {
  border-left-color: var(--color-warning-500);
}

.stock-card.status-critical {
  border-left-color: var(--color-error-500);
}

.stock-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-4);
}

.stock-name {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.stock-status-badge {
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stock-status-badge.status-normal {
  background: var(--color-success-50);
  color: var(--color-success-700);
}

.stock-status-badge.status-low {
  background: var(--color-warning-50);
  color: var(--color-warning-700);
}

.stock-status-badge.status-critical {
  background: var(--color-error-50);
  color: var(--color-error-700);
}

.stock-details {
  margin-bottom: var(--space-4);
}

.stock-quantity {
  display: flex;
  align-items: baseline;
  gap: var(--space-2);
  margin-bottom: var(--space-3);
}

.quantity-current {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
}

.quantity-unit {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.stock-threshold {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.threshold-bar {
  height: 6px;
  background: var(--color-bg-secondary);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.threshold-fill {
  height: 100%;
  border-radius: var(--radius-full);
  transition: width var(--transition-base);
}

.threshold-fill.status-normal {
  background: var(--color-success-500);
}

.threshold-fill.status-low {
  background: var(--color-warning-500);
}

.threshold-fill.status-critical {
  background: var(--color-error-500);
}

.threshold-text {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
}

.stock-meta {
  border-top: 1px solid var(--color-border-light);
  padding-top: var(--space-3);
}

.last-updated {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
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

  .stocks-grid {
    grid-template-columns: 1fr;
  }

  .summary-cards {
    grid-template-columns: 1fr;
  }
}
</style>
