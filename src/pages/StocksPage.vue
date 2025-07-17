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
        v-for="stock in stocks"
        :key="stock.beverageName"
        class="stock-card"
        :class="getStockStatusClass(stock)"
      >
        <div class="stock-header">
          <h3 class="stock-name">{{ stock.beverageName }}</h3>
          <div class="stock-status-badge" :class="getStockStatusClass(stock)">
            {{ stock.alertSecurityLevel }}
          </div>
        </div>

        <div class="stock-details">
          <div class="stock-quantity">
            <span class="quantity-current">{{ stock.currentStockLevel }}</span>
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
          </div>
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
            <p>{{ stocks.reduce((total, m) => total + (+m.currentStockLevel || 0), 0) }} produits</p>
          </div>
        </div>

        <div class="summary-card">
          <div class="summary-icon warning">⚠️</div>
          <div class="summary-content">
            <h4>Stock Faible</h4>
            <p>
              {{
                stocks.filter(m =>
                    (+m.currentStockLevel || 0) > 0 &&
                    (+m.currentStockLevel || 0) <= (+m.thresholdLevel || 0)
                ).length
              }} produits
            </p>
          </div>
        </div>

        <div class="summary-card">
          <div class="summary-icon critical">🚨</div>
          <div class="summary-content">
            <h4>Stock Critique</h4>
            <p>
              {{
                stocks.filter(m => (+m.currentStockLevel || 0) <= 0).length
              }} produits
            </p>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, computed, onMounted} from 'vue'
import {StatisticsService, type Stock, type StockAlert} from "../api";

const statusFilter = ref('all')

const stocks = ref<Stock[]>([])


const getStockStatusClass = (stock: Stock) => {
  return `status-${stock.alertSecurityLevel}`
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
  const maxQuantity = Math.max(stock.currentStockLevel, stock.threshold * 2)
  return Math.min((stock.currentStockLevel / maxQuantity) * 100, 100)
}
async function loadStocks(){
  stocks.value = await StatisticsService.getStocks();
}
onMounted(() => {
  loadStocks()
})
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
