<template>
  <div class="analytics-page">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-text">
          <h1 class="page-title">Analyses et Statistiques</h1>
          <p class="page-subtitle">Analyse détaillée des mouvements de stock et performances</p>
        </div>
        <div class="header-actions">
          <div class="period-selector">
            <label class="selector-label">Période:</label>
            <select v-model="selectedPeriod" @change="loadAnalyticsData" class="period-select">
              <option value="weekly">Cette semaine</option>
              <option value="monthly">Ce mois</option>
              <option value="yearly">Cette année</option>
            </select>
          </div>
          <button @click="exportStatistics" class="btn btn-outline-primary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
              <path d="M14 2v6h6"/>
              <path d="M16 13H8"/>
              <path d="M16 17H8"/>
              <path d="M10 9H8"/>
            </svg>
            Exporter
          </button>
          <button @click="refreshData" class="btn btn-primary" :disabled="loading">
            <svg v-if="loading" class="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" opacity="0.25"/>
              <path d="m12 2 0 4 m0 12 0 4" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
            </svg>
            <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            {{ loading ? 'Actualisation...' : 'Actualiser' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading && !weeklyData" class="loading-state">
      <div class="spinner"></div>
      <p>Chargement des analyses...</p>
    </div>

    <!-- Analytics Content -->
    <div v-else-if="weeklyData" class="analytics-content">
      <!-- Movement Trends Summary -->
      <div class="trends-summary">
        <div class="trend-card" v-for="trend in movementTrends" :key="trend.period">
          <div class="trend-header">
            <h3 class="trend-title">{{ trend.period }}</h3>
            <div class="trend-indicator" :class="getTrendClass(trend.trend)">
              {{ getTrendIcon(trend.trend) }}
            </div>
          </div>
          <div class="trend-content">
            <p class="trend-value">{{ trend.totalMovements }}</p>
          </div>
        </div>
      </div>

      <!-- Weekly Stock Movement Chart -->
      <div class="chart-section">
        <div class="chart-container">
          <div class="chart-header">
            <h2 class="chart-title">Mouvements de Stock - {{ getPeriodLabel(selectedPeriod) }}</h2>
            <div class="chart-legend">
              <div class="legend-item">
                <div class="legend-color success"></div>
                <span>Entrées ({{ weeklyData.totalEntries }})</span>
              </div>
              <div class="legend-item">
                <div class="legend-color error"></div>
                <span>Sorties ({{ weeklyData.totalExits }})</span>
              </div>
              <div class="legend-item">
                <div class="legend-color warning"></div>
                <span>Ajustements ({{ weeklyData.totalAdjustments }})</span>
              </div>
            </div>
          </div>
          <div class="chart-wrapper">
            <canvas ref="chartCanvas" id="movementChart"></canvas>
          </div>
        </div>
      </div>

      <!-- Analytics Grid -->
      <div class="analytics-grid">
        <!-- Top Performing Beverages -->
        <div class="analytics-section">
          <div class="section-header">
            <h2 class="section-title">Top Boissons Performantes</h2>
            <span class="section-badge">{{ beveragePerformance.length }} produits</span>
          </div>
          <div class="performance-list">
            <div v-if="beveragePerformance.length === 0" class="empty-state">
              <div class="empty-icon">🏆</div>
              <p class="empty-title">Aucune donnée de performance disponible</p>
              <p class="empty-subtitle">Les statistiques de performance apparaîtront ici</p>
            </div>
            <div v-else>
              <div v-for="beverage in beveragePerformance" :key="beverage.id" class="performance-item">
                <div class="performance-rank">{{ beverage.rank }}</div>
                <div class="performance-details">
                  <h4 class="performance-name">{{ beverage.name }}</h4>
                  <div class="performance-stats">
                    <span class="stat-item">
                      <strong>{{ beverage.totalMovements }}</strong> mouvements
                    </span>
                    <span class="stat-item">
                      <strong>{{ beverage.totalQuantity }}</strong> unités
                    </span>
                    <span v-if="beverage.revenueImpact" class="stat-item">
                      <strong>{{ formatCurrency(beverage.revenueImpact) }}</strong>
                    </span>
                  </div>
                </div>
                <div class="performance-progress">
                  <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: getPerformanceProgressWidth(beverage.totalMovements) }"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Inventory Analytics -->
        <div class="analytics-section">
          <div class="section-header">
            <h2 class="section-title">Analyse de l'Inventaire</h2>
            <button @click="toggleInventoryView" class="btn btn-outline-secondary btn-sm">
              {{ inventoryViewType === 'chart' ? 'Vue Liste' : 'Vue Graphique' }}
            </button>
          </div>
          <div class="inventory-content">
            <!-- Stock Distribution Chart -->
            <div v-if="inventoryViewType === 'chart' && inventoryAnalytics" class="distribution-chart">
              <canvas ref="distributionCanvas" id="distributionChart"></canvas>
            </div>
            <!-- Stock Distribution List -->
            <div v-else-if="inventoryAnalytics" class="distribution-list">
              <div v-for="item in inventoryAnalytics.stockDistribution" :key="item.category" class="distribution-item">
                <div class="distribution-color" :style="{ backgroundColor: item.color }"></div>
                <div class="distribution-details">
                  <h4 class="distribution-category">{{ item.category }}</h4>
                  <div class="distribution-stats">
                    <span class="distribution-percentage">{{ item.percentage }}%</span>
                    <span class="distribution-value">{{ formatCurrency(item.value) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <div class="error-icon">⚠️</div>
      <h3>Erreur de chargement</h3>
      <p>{{ error }}</p>
      <button @click="refreshData" class="btn btn-primary">
        Réessayer
      </button>
    </div>

    <!-- Export Modal -->
    <div v-if="showExportModal" class="modal-overlay" @click="closeExportModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Exporter les Statistiques</h3>
          <button @click="closeExportModal" class="close-btn">×</button>
        </div>
        <div class="modal-body">
          <div class="export-options">
            <div class="export-option">
              <h4>Format</h4>
              <div class="radio-group">
                <label><input type="radio" v-model="exportFormat" value="pdf"> PDF</label>
                <label><input type="radio" v-model="exportFormat" value="excel"> Excel</label>
              </div>
            </div>
            <div class="export-option">
              <h4>Type de données</h4>
              <div class="radio-group">
                <label><input type="radio" v-model="exportType" value="analytics"> Analyses complètes</label>
                <label><input type="radio" v-model="exportType" value="movements"> Mouvements seulement</label>
                <label><input type="radio" v-model="exportType" value="inventory"> Inventaire seulement</label>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="closeExportModal" class="btn btn-outline-secondary">Annuler</button>
          <button @click="performExport" class="btn btn-primary" :disabled="exportLoading">
            {{ exportLoading ? 'Export en cours...' : 'Exporter' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue'
import { Chart, registerables } from 'chart.js'
import { StatisticsService } from '../api/features/stats/services/statService'
import type { WeeklyStockMovement, MovementTrend } from '../api/features/stats/models/WeeklyStockMovementModel'
import type { BeveragePerformance, InventoryAnalytics } from '../api/features/stats/models/AnalyticsModel'
import { showToast } from '../utils/toast'

Chart.register(...registerables)

// Reactive state
const weeklyData = ref<WeeklyStockMovement | null>(null)
const movementTrends = ref<MovementTrend[]>([])
const beveragePerformance = ref<BeveragePerformance[]>([])
const inventoryAnalytics = ref<InventoryAnalytics | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const selectedPeriod = ref<'weekly' | 'monthly' | 'yearly'>('weekly')
const inventoryViewType = ref<'chart' | 'list'>('chart')
const analysisTab = ref<'active' | 'inactive'>('active')

// Export modal state
const showExportModal = ref(false)
const exportFormat = ref<'pdf' | 'excel'>('pdf')
const exportType = ref<'analytics' | 'movements' | 'inventory'>('analytics')
const exportLoading = ref(false)

// Chart instances
const chartCanvas = ref<HTMLCanvasElement | null>(null)
const distributionCanvas = ref<HTMLCanvasElement | null>(null)
let movementChart: Chart | null = null
let distributionChart: Chart | null = null

// Computed properties
const maxPerformance = computed(() => {
  if (!beveragePerformance.value.length) return 1
  return Math.max(...beveragePerformance.value.map(b => b.totalMovements))
})

// Methods
const loadAnalyticsData = async () => {
  try {
    console.log('🚀 [AnalyticsPage] Starting analytics data load...');
    loading.value = true
    error.value = null

    console.log('📡 [AnalyticsPage] Making parallel API calls...');
    // Load all analytics data
    const [weeklyResponse, trendsResponse, performanceResponse, inventoryResponse] = await Promise.all([
      StatisticsService.getWeeklyStockMovement(),
      StatisticsService.getMovementTrends(selectedPeriod.value),
      StatisticsService.getBeveragePerformance(),
      StatisticsService.getInventoryAnalytics()
    ])

    console.log('✅ [AnalyticsPage] All API calls completed successfully');
    console.log('📊 [AnalyticsPage] Weekly data received:', weeklyResponse);
    console.log('📈 [AnalyticsPage] Trends data received:', trendsResponse);
    console.log('🏆 [AnalyticsPage] Performance data received:', performanceResponse);
    console.log('📦 [AnalyticsPage] Inventory data received:', inventoryResponse);

    weeklyData.value = weeklyResponse
    movementTrends.value = trendsResponse
    beveragePerformance.value = performanceResponse
    inventoryAnalytics.value = inventoryResponse

    console.log('💾 [AnalyticsPage] Data assigned to reactive variables');
    console.log('🎯 [AnalyticsPage] weeklyData.value:', weeklyData.value);
    console.log('🎯 [AnalyticsPage] movementTrends.value:', movementTrends.value);
    console.log('🎯 [AnalyticsPage] beveragePerformance.value:', beveragePerformance.value);
    console.log('🎯 [AnalyticsPage] inventoryAnalytics.value:', inventoryAnalytics.value);

    // Initialize charts after data is loaded
    console.log('🔧 [AnalyticsPage] Initializing charts...');
    await nextTick()
    initializeCharts()
    console.log('✅ [AnalyticsPage] Charts initialized successfully');
  } catch (err) {
    console.error('❌ [AnalyticsPage] Error loading analytics data:', err);
    error.value = 'Impossible de charger les données d\'analyse'
    showToast('Erreur lors du chargement des analyses', 'error')
  } finally {
    loading.value = false
    console.log('🏁 [AnalyticsPage] Analytics data load completed');
  }
}

const initializeCharts = () => {
  if (chartCanvas.value && weeklyData.value) {
    initMovementChart()
  }
  if (distributionCanvas.value && inventoryAnalytics.value && inventoryViewType.value === 'chart') {
    initDistributionChart()
  }
}

const initMovementChart = () => {
  if (movementChart) {
    movementChart.destroy()
  }

  const ctx = chartCanvas.value?.getContext('2d')
  if (!ctx || !weeklyData.value) return

  movementChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: weeklyData.value.weekDates,
      datasets: weeklyData.value.datasets.map(dataset => ({
        label: dataset.label,
        data: dataset.data,
        borderColor: dataset.color,
        backgroundColor: dataset.color + '20',
        tension: 0.4,
        fill: true
      }))
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          mode: 'index',
          intersect: false,
        }
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: 'Période'
          }
        },
        y: {
          display: true,
          title: {
            display: true,
            text: 'Quantité'
          }
        }
      },
      interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false
      }
    }
  })
}

const initDistributionChart = () => {
  if (distributionChart) {
    distributionChart.destroy()
  }

  const ctx = distributionCanvas.value?.getContext('2d')
  if (!ctx || !inventoryAnalytics.value) return

  distributionChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: inventoryAnalytics.value.stockDistribution.map(item => item.category),
      datasets: [{
        data: inventoryAnalytics.value.stockDistribution.map(item => item.percentage),
        backgroundColor: inventoryAnalytics.value.stockDistribution.map(item => item.color),
        borderWidth: 2,
        borderColor: '#fff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            padding: 20
          }
        }
      }
    }
  })
}

const refreshData = () => {
  loadAnalyticsData()
}

const toggleInventoryView = () => {
  inventoryViewType.value = inventoryViewType.value === 'chart' ? 'list' : 'chart'
  if (inventoryViewType.value === 'chart') {
    nextTick(() => initDistributionChart())
  }
}

const exportStatistics = () => {
  showExportModal.value = true
}

const closeExportModal = () => {
  showExportModal.value = false
}

const performExport = async () => {
  try {
    exportLoading.value = true
    let blob: Blob

    if (exportFormat.value === 'pdf') {
      blob = await StatisticsService.exportStatisticsPDF(exportType.value as any)
    } else if (exportFormat.value === 'excel') {
      blob = await StatisticsService.exportStatisticsExcel(exportType.value as any)
    }

    // Create download link
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `statistics_${exportType.value}_${new Date().toISOString().split('T')[0]}.${exportFormat.value}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)

    showToast('Export terminé avec succès', 'success')
    closeExportModal()
  } catch (err) {
    console.error('Export error:', err)
    showToast('Erreur lors de l\'export', 'error')
  } finally {
    exportLoading.value = false
  }
}

// Utility functions
const getPeriodLabel = (period: string): string => {
  switch (period) {
    case 'weekly': return 'Cette Semaine'
    case 'monthly': return 'Ce Mois'
    case 'yearly': return 'Cette Année'
    default: return 'Période'
  }
}

const getTrendClass = (trend: string): string => {
  switch (trend) {
    case 'UP': return 'success'
    case 'DOWN': return 'error'
    case 'STABLE': return 'warning'
    default: return 'info'
  }
}

const getTrendIcon = (trend: string): string => {
  switch (trend) {
    case 'UP': return '↗️'
    case 'DOWN': return '↘️'
    case 'STABLE': return '➡️'
    default: return '📊'
  }
}

const getPerformanceProgressWidth = (movements: number): string => {
  if (maxPerformance.value === 0) return '0%'
  return `${(movements / maxPerformance.value) * 100}%`
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0
  }).format(amount)
}


// Lifecycle
onMounted(() => {
  loadAnalyticsData()
})

onUnmounted(() => {
  if (movementChart) {
    movementChart.destroy()
  }
  if (distributionChart) {
    distributionChart.destroy()
  }
})
</script>

<style scoped>
.analytics-page {
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
  align-items: center;
  gap: var(--space-4);
}

.period-selector {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.selector-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.period-select {
  padding: var(--space-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
  font-size: var(--font-size-base);
  cursor: pointer;
}

.btn {
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: background var(--transition-fast), transform var(--transition-fast);
}

.btn-primary {
  background: var(--color-primary);
  color: #ffffff;
  border: none;
}

.btn-primary:disabled {
  background: var(--color-primary-50);
  color: var(--color-text-disabled);
  cursor: not-allowed;
}

.btn-outline-primary {
  background: transparent;
  border: 1px solid var(--color-primary);
  color: var(--color-primary);
}

.btn-outline-primary:hover {
  background: var(--color-primary-50);
}

.btn-primary:hover {
  background: var(--color-primary-dark);
  transform: translateY(-1px);
}

.chart-section {
  background: var(--color-bg-primary);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  box-shadow: var(--shadow-sm);
}

.chart-container {
  width: 100%;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-6);
}

.chart-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.chart-legend {
  display: flex;
  gap: var(--space-4);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: var(--radius-sm);
}

.legend-color.success {
  background: #10b981;
}

.legend-color.error {
  background: #ef4444;
}

.legend-color.warning {
  background: #f59e0b;
}

.chart-wrapper {
  position: relative;
  height: 400px;
  width: 100%;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-4);
}

.summary-card {
  background: var(--color-bg-primary);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-fast);
}

.summary-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-4);
}

.card-header h3 {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
}

.card-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: var(--radius-full);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
}

.card-icon.success {
  background: var(--color-success-50);
  color: var(--color-success-600);
}

.card-icon.error {
  background: var(--color-error-50);
  color: var(--color-error-600);
}

.card-icon.warning {
  background: var(--color-warning-50);
  color: var(--color-warning-600);
}

.card-content {
  text-align: left;
}

.card-value {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-1);
}

.card-value.positive {
  color: var(--color-success-600);
}

.card-value.negative {
  color: var(--color-error-600);
}

.card-subtitle {
  font-size: var(--font-size-sm);
  color: var(--color-text-tertiary);
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: var(--space-4);
  text-align: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: var(--space-4);
  text-align: center;
}

.error-icon {
  font-size: 2rem;
  color: var(--color-error-600);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: var(--color-bg-primary);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  box-shadow: var(--shadow-lg);
  width: 90%;
  max-width: 600px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-4);
}

.close-btn {
  background: transparent;
  border: none;
  color: var(--color-text-secondary);
  font-size: 1.5rem;
  cursor: pointer;
}

.export-options {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.export-option {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.tab-button {
  padding: var(--space-2) var(--space-4);
  border: none;
  border-radius: var(--radius-md);
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
  font-size: var(--font-size-base);
  cursor: pointer;
  transition: background var(--transition-fast);
}

.tab-button.active {
  background: var(--color-primary);
  color: #ffffff;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.activity-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4);
  border-radius: var(--radius-md);
  background: var(--color-bg-secondary);
  transition: background var(--transition-fast);
}

.activity-item:hover {
  background: var(--color-bg-tertiary);
}

.activity-score {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: var(--radius-full);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: #ffffff;
}

.activity-score.high {
  background: var(--color-success-600);
}

.activity-score.medium {
  background: var(--color-warning-600);
}

.activity-score.low {
  background: var(--color-error-600);
}

.activity-score.inactive {
  background: var(--color-text-tertiary);
}

.performance-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.performance-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4);
  border-radius: var(--radius-md);
  background: var(--color-bg-secondary);
  transition: background var(--transition-fast);
}

.performance-item:hover {
  background: var(--color-bg-tertiary);
}

.performance-rank {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: var(--radius-full);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: #ffffff;
  background: var(--color-primary);
}

.performance-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.performance-name {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.performance-stats {
  display: flex;
  gap: var(--space-4);
  flex-wrap: wrap;
}

.stat-item {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.progress-bar {
  position: relative;
  height: 8px;
  border-radius: var(--radius-sm);
  background: var(--color-bg-tertiary);
}

.progress-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  border-radius: var(--radius-sm);
  background: var(--color-primary);
}

.distribution-chart {
  position: relative;
  height: 300px;
  width: 100%;
}

.distribution-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.distribution-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4);
  border-radius: var(--radius-md);
  background: var(--color-bg-secondary);
}

.distribution-color {
  width: 12px;
  height: 12px;
  border-radius: var(--radius-sm);
}

.expiration-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.expiration-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4);
  border-radius: var(--radius-md);
  background: var(--color-bg-secondary);
}

.expiration-urgency {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: var(--radius-full);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: #ffffff;
}

.expiration-urgency.critical {
  background: var(--color-error-600);
}

.expiration-urgency.warning {
  background: var(--color-warning-600);
}

.expiration-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.expiration-beverage {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.expiration-info {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.expiration-date {
  font-size: var(--font-size-sm);
  color: var(--color-text-tertiary);
}

.expiration-value {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-8);
  text-align: center;
  color: var(--color-text-secondary);
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: var(--space-4);
}

.empty-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-2);
}

.empty-subtitle {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-4);
}

.no-data-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-12);
  text-align: center;
  background: var(--color-bg-primary);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
}

.no-data-icon {
  font-size: 4rem;
  margin-bottom: var(--space-6);
}

.no-data-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-3);
}

.no-data-subtitle {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-6);
  max-width: 400px;
}

.trends-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-4);
  margin-bottom: var(--space-6);
}

.trend-card {
  background: var(--color-bg-primary);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-fast);
}

.trend-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.trend-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-4);
}

.trend-title {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
}

.trend-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: var(--radius-full);
  font-size: var(--font-size-lg);
}

.trend-indicator.success {
  background: var(--color-success-50);
  color: var(--color-success-600);
}

.trend-indicator.error {
  background: var(--color-error-50);
  color: var(--color-error-600);
}

.trend-indicator.warning {
  background: var(--color-warning-50);
  color: var(--color-warning-600);
}

.trend-content {
  text-align: left;
}

.trend-value {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-1);
}

.trend-change {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.trend-change.success {
  color: var(--color-success-600);
}

.trend-change.error {
  color: var(--color-error-600);
}

.trend-change.warning {
  color: var(--color-warning-600);
}

.analytics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: var(--space-6);
}

.analytics-section {
  background: var(--color-bg-primary);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-6) var(--space-6) var(--space-4) var(--space-6);
  border-bottom: 1px solid var(--color-border-light);
}

.section-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.section-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  background: var(--color-primary-100);
  color: var(--color-primary-700);
}

.section-badge.warning {
  background: var(--color-warning-100);
  color: var(--color-warning-700);
}

.btn-outline-secondary {
  background: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
}

.btn-outline-secondary:hover {
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
}

.btn-sm {
  padding: var(--space-1) var(--space-3);
  font-size: var(--font-size-sm);
}

.btn-outline-info {
  background: transparent;
  border: 1px solid var(--color-info-500);
  color: var(--color-info-500);
}

.btn-outline-info:hover {
  background: var(--color-info-50);
}

.inventory-content,
.performance-list,
.expiration-content,
.analysis-content {
  padding: var(--space-6);
}

.analysis-tabs {
  display: flex;
  gap: var(--space-1);
  border-radius: var(--radius-md);
  background: var(--color-bg-secondary);
  padding: var(--space-1);
}

.activity-score.inactive {
  background: var(--color-text-tertiary);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  margin-top: var(--space-6);
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@media (max-width: 768px) {
  .header-actions {
    flex-direction: column;
    align-items: stretch;
    gap: var(--space-3);
  }

  .period-selector {
    justify-content: space-between;
  }

  .analytics-grid {
    grid-template-columns: 1fr;
  }

  .trends-summary {
    grid-template-columns: 1fr;
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}
</style>
