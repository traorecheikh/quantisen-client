<template>
  <div class="dashboard-page">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-text">
          <h1 class="page-title">Tableau de bord</h1>
          <p class="page-subtitle">Surveillez votre inventaire de boissons et vos opérations</p>
        </div>
        <div class="header-actions">
          <button @click="refreshData" class="btn btn-primary" :disabled="loading">
            <svg v-if="loading" class="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none" opacity="0.25"/>
              <path d="m12 2 0 4 m0 12 0 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
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
    <div v-if="loading && !dashboardStats" class="loading-state">
      <div class="spinner"></div>
      <p>Chargement des statistiques...</p>
    </div>

    <!-- Dashboard Content -->
    <div v-else-if="dashboardStats" class="dashboard-content">
      <!-- Key Metrics Cards -->
      <div class="metrics-grid">
        <!-- Total Beverages Card -->
        <div class="metric-card">
          <div class="metric-header">
            <div class="metric-icon success">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5 12V7a1 1 0 011-1h12a1 1 0 011 1v5M5 12l2 6h10l2-6M5 12h14M12 6V2m-4 8v6m8-6v6"/>
              </svg>
            </div>
            <div class="metric-details">
              <h3 class="metric-title">Total Boissons</h3>
              <p class="metric-value counting-animation">{{ animatedBeverages }}</p>
              <p class="metric-change positive">
                {{ dashboardStats.totalBeverages > 0 ? 'Produits actifs' : 'Aucun produit' }}
              </p>
            </div>
          </div>
        </div>

        <!-- Total Stock Card -->
        <div class="metric-card">
          <div class="metric-header">
            <div class="metric-icon primary">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 3h18v4H3V3zm0 6h18v2H3V9zm0 4h18v2H3v-2zm0 4h18v4H3v-4z"/>
              </svg>
            </div>
            <div class="metric-details">
              <h3 class="metric-title">Stock Total</h3>
              <p class="metric-value counting-animation">{{ animatedStock }}</p>
              <p class="metric-change">unités en stock</p>
            </div>
          </div>
        </div>

        <!-- Total Movements Card -->
        <div class="metric-card">
          <div class="metric-header">
            <div class="metric-icon warning">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <div class="metric-details">
              <h3 class="metric-title">Mouvements</h3>
              <p class="metric-value counting-animation">{{ animatedMovements }}</p>
              <p class="metric-change">opérations effectuées</p>
            </div>
          </div>
        </div>

        <!-- Active Users Card -->
        <div class="metric-card">
          <div class="metric-header">
            <div class="metric-icon info">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </div>
            <div class="metric-details">
              <h3 class="metric-title">Utilisateurs</h3>
              <p class="metric-value counting-animation">{{ animatedUsers }}</p>
              <p class="metric-change">utilisateurs système</p>
            </div>
          </div>
        </div>

        <!-- Stock Value Card -->
        <div class="metric-card">
          <div class="metric-header">
            <div class="metric-icon success">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"/>
              </svg>
            </div>
            <div class="metric-details">
              <h3 class="metric-title">Valeur Totale</h3>
              <p class="metric-value counting-animation">{{ animatedValue }}</p>
              <p class="metric-change positive">valeur du stock</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Performance Section -->
      <div class="performance-section">
        <div class="section-header">
          <h2 class="section-title">Performance</h2>
        </div>

        <div class="performance-grid">
          <div class="performance-card">
            <div class="performance-header">
              <div class="performance-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                </svg>
              </div>
              <h3>Efficacité</h3>
            </div>
            <div class="performance-content">
              <div class="progress-bar">
                <div class="progress-fill" style="width: 85%"></div>
              </div>
              <span class="progress-text">85%</span>
            </div>
          </div>

          <div class="performance-card">
            <div class="performance-header">
              <div class="performance-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 3v18h18V3H3zm16 16H5V5h14v14zm-8-2h2v-4h-2v4zm0-6h2V7h-2v4z"/>
                </svg>
              </div>
              <h3>Productivité</h3>
            </div>
            <div class="performance-content">
              <div class="progress-bar">
                <div class="progress-fill" style="width: 92%"></div>
              </div>
              <span class="progress-text">92%</span>
            </div>
          </div>

          <div class="performance-card">
            <div class="performance-header">
              <div class="performance-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <h3>Qualité</h3>
            </div>
            <div class="performance-content">
              <div class="progress-bar">
                <div class="progress-fill" style="width: 96%"></div>
              </div>
              <span class="progress-text">96%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- No Data State -->
    <div v-else-if="!loading && !dashboardStats" class="no-data-state">
      <div class="no-data-icon">📈</div>
      <h3 class="no-data-title">Aucune donnée disponible</h3>
      <p class="no-data-subtitle">
        Les statistiques du tableau de bord apparaîtront ici une fois que des données seront disponibles.
      </p>
      <button @click="refreshData" class="btn btn-primary">
        Actualiser les données
      </button>
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { StatisticsService } from '../api/features/stats/services/statService'
import type { DashboardStatistics } from '../api/features/stats/models/DashboardStatisticsModel'
import { showToast } from '../utils/toast'

const dashboardStats = ref<DashboardStatistics | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

// Animation counters
const animatedBeverages = ref(0)
const animatedStock = ref(0)
const animatedMovements = ref(0)
const animatedUsers = ref(0)
const animatedValue = ref('0 FCFA')

// Animate numbers
const animateNumber = (target: number, current: any, duration: number = 2000) => {
  const start = performance.now()
  const startValue = typeof current.value === 'string' ? 0 : current.value

  const animate = (now: number) => {
    const elapsed = now - start
    const progress = Math.min(elapsed / duration, 1)
    const easeOutQuart = 1 - Math.pow(1 - progress, 4)

    const value = Math.floor(startValue + (target - startValue) * easeOutQuart)
    current.value = value

    if (progress < 1) {
      requestAnimationFrame(animate)
    }
  }

  requestAnimationFrame(animate)
}

// Animate currency values
const animateCurrency = (target: number, duration: number = 2000) => {
  const start = performance.now()
  const startValue = 0

  const animate = (now: number) => {
    const elapsed = now - start
    const progress = Math.min(elapsed / duration, 1)
    const easeOutQuart = 1 - Math.pow(1 - progress, 4)

    const value = Math.floor(startValue + (target - startValue) * easeOutQuart)
    animatedValue.value = formatCurrency(value)

    if (progress < 1) {
      requestAnimationFrame(animate)
    }
  }

  requestAnimationFrame(animate)
}

// Format currency for astronomical values
const formatCurrency = (amount: number): string => {
  if (amount >= 1e12) {
    return (amount / 1e12).toFixed(1) + 'T FCFA'
  } else if (amount >= 1e9) {
    return (amount / 1e9).toFixed(1) + 'B FCFA'
  } else if (amount >= 1e6) {
    return (amount / 1e6).toFixed(1) + 'M FCFA'
  } else if (amount >= 1e3) {
    return (amount / 1e3).toFixed(1) + 'K FCFA'
  }
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0
  }).format(amount)
}

// Watch for data changes and animate
watch(dashboardStats, (newStats) => {
  if (newStats) {
    animateNumber(newStats.totalBeverages, animatedBeverages)
    animateNumber(newStats.totalStock, animatedStock)
    animateNumber(newStats.totalMovements, animatedMovements)
    animateNumber(newStats.totalUsers, animatedUsers)
    animateCurrency(newStats.totalValue)
  }
}, { immediate: true })

const loadDashboardData = async () => {
  try {
    loading.value = true
    error.value = null
    dashboardStats.value = await StatisticsService.getDashboardStatistics()
    showToast('Données actualisées avec succès', 'success')
  } catch (err) {
    error.value = 'Impossible de charger les statistiques du tableau de bord'
    showToast('Erreur lors du chargement des statistiques', 'error')
  } finally {
    loading.value = false
  }
}

const refreshData = () => {
  loadDashboardData()
}

onMounted(() => {
  loadDashboardData()
})
</script>

<style scoped>
.dashboard-page {
  background: var(--color-bg-primary);
  min-height: 100vh;
}

/* Page Header */
.page-header {
  background: var(--color-bg-primary);
  border-bottom: 1px solid var(--color-border-light);
  padding: var(--space-6) 0;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-4);
}

.page-title {
  font-size: var(--font-size-2xl);
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.page-subtitle {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  margin: var(--space-1) 0 0;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  border: 1px solid transparent;
  border-radius: 6px;
  font-size: var(--font-size-sm);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background: var(--color-primary-600);
  color: var(--color-text-inverse);
  border-color: var(--color-primary-600);
}

.btn-primary:hover:not(:disabled) {
  background: var(--color-primary-700);
  border-color: var(--color-primary-700);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: var(--space-4);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--color-border-light);
  border-top: 4px solid var(--color-primary-600);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-state p {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

/* Dashboard Content */
.dashboard-content {
  padding: var(--space-6) 0;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-6);
  margin-bottom: var(--space-8);
}

.metric-card {
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border-light);
  border-radius: 8px;
  padding: var(--space-6);
  transition: all 0.2s ease;
}

.metric-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.metric-header {
  display: flex;
  align-items: flex-start;
  gap: var(--space-4);
}

.metric-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.metric-icon.success {
  background: var(--color-success-600);
}

.metric-icon.primary {
  background: var(--color-primary-600);
}

.metric-icon.warning {
  background: var(--color-warning-600);
}

.metric-icon.info {
  background: var(--color-secondary-600);
}

.metric-details {
  flex: 1;
}

.metric-title {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text-secondary);
  margin: 0 0 var(--space-1);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.metric-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
  line-height: 1.1;
}

.metric-change {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
  margin: var(--space-1) 0 0;
}

.metric-change.positive {
  color: var(--color-success-600);
}

/* Performance Section */
.performance-section {
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border-light);
  border-radius: 8px;
  padding: var(--space-6);
}

.section-header {
  margin-bottom: var(--space-6);
}

.section-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.performance-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--space-4);
}

.performance-card {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-light);
  border-radius: 6px;
  padding: var(--space-4);
}

.performance-header {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-3);
}

.performance-icon {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  background: var(--color-primary-600);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.performance-header h3 {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text-primary);
  margin: 0;
}

.performance-content {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: var(--color-border-light);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--color-primary-600);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-text-primary);
  min-width: 3rem;
  text-align: right;
}

/* No Data & Error States */
.no-data-state, .error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
  gap: var(--space-4);
}

.no-data-icon, .error-icon {
  font-size: 3rem;
  margin-bottom: var(--space-2);
}

.no-data-title, .error-state h3 {
  color: var(--color-text-primary);
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin: 0;
}

.no-data-subtitle, .error-state p {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  margin: 0;
  max-width: 500px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: stretch;
    gap: var(--space-4);
  }

  .metrics-grid {
    grid-template-columns: 1fr;
    gap: var(--space-4);
  }

  .performance-grid {
    grid-template-columns: 1fr;
  }

  .metric-value {
    font-size: 1.5rem;
  }

  .page-title {
    font-size: var(--font-size-xl);
  }
}

/* Animation for counting numbers */
@keyframes countUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.counting-animation {
  animation: countUp 0.5s ease-out;
}
</style>
