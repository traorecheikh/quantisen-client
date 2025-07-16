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
    <div v-if="loading && !dashboardStats" class="loading-state">
      <div class="spinner"></div>
      <p>Chargement des statistiques...</p>
    </div>

    <!-- Dashboard Content -->
    <div v-else-if="dashboardStats" class="dashboard-content">
      <!-- Key Metrics Cards -->
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-header">
            <div class="metric-icon success">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 5M7 13h10m-10 0L5.4 5M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6"/>
              </svg>
            </div>
            <div class="metric-details">
              <h3 class="metric-title">Total des boissons</h3>
              <p class="metric-value">{{ dashboardStats.totalBeverages }}</p>
              <p class="metric-change positive">{{ dashboardStats.totalBeverages > 0 ? 'Actif' : 'Aucun produit' }}</p>
            </div>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-header">
            <div class="metric-icon info">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
            </div>
            <div class="metric-details">
              <h3 class="metric-title">Stock total</h3>
              <p class="metric-value">{{ dashboardStats.totalStock }}</p>
              <p class="metric-change">unités en stock</p>
            </div>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-header">
            <div class="metric-icon" :class="dashboardStats.lowStockAlerts > 0 ? 'warning' : 'success'">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-6h2v6zm0-8h-2V7h2v4z"/>
              </svg>
            </div>
            <div class="metric-details">
              <h3 class="metric-title">Alertes stock faible</h3>
              <p class="metric-value">{{ dashboardStats.lowStockAlerts }}</p>
              <p class="metric-change" :class="dashboardStats.lowStockAlerts > 0 ? 'negative' : 'positive'">
                {{ dashboardStats.lowStockAlerts > 0 ? 'Nécessite attention' : 'Aucune alerte' }}
              </p>
            </div>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-header">
            <div class="metric-icon primary">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 5M7 13h10m-10 0L5.4 5M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6"/>
              </svg>
            </div>
            <div class="metric-details">
              <h3 class="metric-title">Total mouvements</h3>
              <p class="metric-value">{{ dashboardStats.totalMovements }}</p>
              <p class="metric-change">opérations effectuées</p>
            </div>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-header">
            <div class="metric-icon secondary">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
            <div class="metric-details">
              <h3 class="metric-title">Utilisateurs actifs</h3>
              <p class="metric-value">{{ dashboardStats.totalUsers }}</p>
              <p class="metric-change">utilisateurs système</p>
            </div>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-header">
            <div class="metric-icon success">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <div class="metric-details">
              <h3 class="metric-title">Valeur totale</h3>
              <p class="metric-value">{{ formatCurrency(dashboardStats.totalValue) }}</p>
              <p class="metric-change positive">valeur du stock</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activities and Alerts -->
      <div class="dashboard-grid">
        <!-- Recent Movements -->
        <div class="dashboard-section">
          <div class="section-header">
            <h2 class="section-title">Mouvements récents</h2>
            <router-link to="/movements" class="btn btn-outline-primary btn-sm">
              Voir tout
            </router-link>
          </div>
          <div class="movements-list">
            <div v-if="dashboardStats.recentMovements.length === 0" class="empty-state">
              <div class="empty-icon">📦</div>
              <p class="empty-title">Aucun mouvement récent</p>
              <p class="empty-subtitle">Les mouvements de stock apparaîtront ici</p>
            </div>
            <div v-else>
              <div v-for="movement in dashboardStats.recentMovements" :key="movement.id" class="movement-item">
                <div class="movement-icon" :class="getMovementTypeClass(movement.movementType)">
                  {{ getMovementIcon(movement.movementType) }}
                </div>
                <div class="movement-details">
                  <h4 class="movement-title">{{ movement.beverageName }}</h4>
                  <p class="movement-description">
                    {{ getMovementDescription(movement.movementType, movement.quantity) }}
                  </p>
                  <div class="movement-meta">
                    <span class="movement-user">{{ movement.userName }}</span>
                    <span class="movement-date">{{ formatDate(movement.date) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Stock Alerts -->
        <div class="dashboard-section">
          <div class="section-header">
            <h2 class="section-title">Alertes de stock</h2>
            <router-link to="/stocks" class="btn btn-outline-warning btn-sm">
              Gérer le stock
            </router-link>
          </div>
          <div class="alerts-list">
            <div v-if="dashboardStats.stockAlerts.length === 0" class="empty-state">
              <div class="empty-icon">✅</div>
              <p class="empty-title">Aucune alerte de stock</p>
              <p class="empty-subtitle">Tous les produits sont bien approvisionnés</p>
            </div>
            <div v-else>
              <div v-for="alert in dashboardStats.stockAlerts" :key="alert.id" class="alert-item" :class="getAlertClass(alert.alertLevel)">
                <div class="alert-icon">
                  {{ getAlertIcon(alert.alertLevel) }}
                </div>
                <div class="alert-details">
                  <h4 class="alert-title">{{ alert.beverageName }}</h4>
                  <p class="alert-description">
                    Stock actuel: {{ alert.currentStock }} / Seuil: {{ alert.threshold }}
                  </p>
                  <span class="alert-badge" :class="getAlertClass(alert.alertLevel)">
                    {{ getAlertText(alert.alertLevel) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Top Beverages -->
        <div class="dashboard-section">
          <div class="section-header">
            <h2 class="section-title">Boissons les plus actives</h2>
            <router-link to="/analytics" class="btn btn-outline-info btn-sm">
              Voir les analyses
            </router-link>
          </div>
          <div class="beverages-list">
            <div v-if="dashboardStats.topBeverages.length === 0" class="empty-state">
              <div class="empty-icon">📊</div>
              <p class="empty-title">Aucune donnée disponible</p>
              <p class="empty-subtitle">Les statistiques de performance apparaîtront ici</p>
            </div>
            <div v-else>
              <div v-for="beverage in dashboardStats.topBeverages" :key="beverage.id" class="beverage-item">
                <div class="beverage-details">
                  <h4 class="beverage-name">{{ beverage.name }}</h4>
                  <p class="beverage-stats">
                    {{ beverage.totalMovements }} mouvements • {{ beverage.totalQuantity }} unités
                  </p>
                </div>
                <div class="beverage-progress">
                  <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: getBeverageProgressWidth(beverage.totalMovements) }"></div>
                  </div>
                </div>
              </div>
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
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { StatisticsService } from '../api/features/stats/services/statService'
import type { DashboardStatistics } from '../api/features/stats/models/DashboardStatisticsModel'
import { showToast } from '../utils/toast'

// Reactive state
const dashboardStats = ref<DashboardStatistics | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

// Computed properties
const maxMovements = computed(() => {
  if (!dashboardStats.value?.topBeverages.length) return 1
  return Math.max(...dashboardStats.value.topBeverages.map(b => b.totalMovements))
})

// Methods
const loadDashboardData = async () => {
  try {
    loading.value = true
    error.value = null
    dashboardStats.value = await StatisticsService.getDashboardStatistics()
  } catch (err) {
    error.value = 'Impossible de charger les statistiques du tableau de bord'
    console.error('Error loading dashboard stats:', err)
    showToast('Erreur lors du chargement des statistiques', 'error')
  } finally {
    loading.value = false
  }
}

const refreshData = () => {
  loadDashboardData()
}

// Utility functions
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0
  }).format(amount)
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

  if (diffInMinutes < 60) {
    return `Il y a ${diffInMinutes} min`
  } else if (diffInMinutes < 1440) {
    return `Il y a ${Math.floor(diffInMinutes / 60)} h`
  } else {
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
}

const getMovementTypeClass = (type: string): string => {
  switch (type.toLowerCase()) {
    case 'entree': return 'success'
    case 'sortie': return 'error'
    case 'ajustement': return 'warning'
    default: return 'info'
  }
}

const getMovementIcon = (type: string): string => {
  switch (type.toLowerCase()) {
    case 'entree': return '↗'
    case 'sortie': return '↘'
    case 'ajustement': return '⚡'
    default: return '📦'
  }
}

const getMovementDescription = (type: string, quantity: number): string => {
  switch (type.toLowerCase()) {
    case 'entree': return `+${quantity} unités ajoutées`
    case 'sortie': return `-${quantity} unités sorties`
    case 'ajustement': return `${quantity} unités ajustées`
    default: return `${quantity} unités`
  }
}

const getAlertClass = (level: string): string => {
  switch (level) {
    case 'LOW': return 'warning'
    case 'CRITICAL': return 'error'
    case 'OUT_OF_STOCK': return 'danger'
    default: return 'info'
  }
}

const getAlertIcon = (level: string): string => {
  switch (level) {
    case 'LOW': return '⚠️'
    case 'CRITICAL': return '🚨'
    case 'OUT_OF_STOCK': return '❌'
    default: return 'ℹ️'
  }
}

const getAlertText = (level: string): string => {
  switch (level) {
    case 'LOW': return 'Stock faible'
    case 'CRITICAL': return 'Stock critique'
    case 'OUT_OF_STOCK': return 'Rupture de stock'
    default: return 'Alerte'
  }
}

const getBeverageProgressWidth = (movements: number): string => {
  if (maxMovements.value === 0) return '0%'
  return `${(movements / maxMovements.value) * 100}%`
}

// Lifecycle
onMounted(() => {
  loadDashboardData()

  // Set up auto-refresh every 30 seconds
  const interval = setInterval(loadDashboardData, 30000)

  // Cleanup interval on unmount
  onUnmounted(() => {
    clearInterval(interval)
  })
})
</script>

<style scoped>
.dashboard-page {
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

.btn {
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

.btn-primary {
  background: var(--color-primary-500);
  color: var(--color-text-inverse);
}

.btn-primary:hover {
  background: var(--color-primary-600);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-outline-primary {
  background: transparent;
  border: 1px solid var(--color-primary-500);
  color: var(--color-primary-500);
}

.btn-outline-primary:hover {
  background: var(--color-primary-50);
}

.btn-outline-warning {
  background: transparent;
  border: 1px solid var(--color-warning-500);
  color: var(--color-warning-500);
}

.btn-outline-warning:hover {
  background: var(--color-warning-50);
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-4);
}

.metric-card {
  background: var(--color-bg-primary);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-fast);
}

.metric-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.metric-header {
  display: flex;
  align-items: flex-start;
  gap: var(--space-4);
}

.metric-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: var(--radius-xl);
  flex-shrink: 0;
}

.metric-icon.success {
  background: var(--color-success-50);
  color: var(--color-success-600);
}

.metric-icon.warning {
  background: var(--color-warning-50);
  color: var(--color-warning-600);
}

.metric-icon.info {
  background: var(--color-secondary-100);
  color: var(--color-secondary-600);
}

.metric-icon.primary {
  background: var(--color-primary-50);
  color: var(--color-primary-600);
}

.metric-details {
  flex: 1;
  min-width: 0;
}

.metric-title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-1);
}

.metric-value {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-1);
}

.metric-change {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.metric-change.positive {
  color: var(--color-success-600);
}

.metric-change.negative {
  color: var(--color-error-600);
}

.metric-change.neutral {
  color: var(--color-text-tertiary);
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-6);
}

.dashboard-section {
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

.movements-list, .alerts-list, .beverages-list {
  padding: var(--space-6);
}

.empty-state {
  text-align: center;
  color: var(--color-text-secondary);
  padding: var(--space-6);
}

.movement-item, .alert-item, .beverage-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4);
  border-radius: var(--radius-lg);
  background: var(--color-bg-secondary);
}

.movement-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: var(--radius-full);
  flex-shrink: 0;
}

.movement-icon.success {
  background: var(--color-success-50);
  color: var(--color-success-600);
}

.movement-icon.error {
  background: var(--color-error-50);
  color: var(--color-error-600);
}

.movement-icon.warning {
  background: var(--color-warning-50);
  color: var(--color-warning-600);
}

.movement-details {
  flex: 1;
  min-width: 0;
}

.movement-title {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-1);
}

.movement-description {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.movement-meta {
  display: flex;
  gap: var(--space-4);
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
}

.alert-icon {
  color: var(--color-warning-600);
  flex-shrink: 0;
}

.alert-item.error .alert-icon {
  color: var(--color-error-600);
}

.alert-details {
  flex: 1;
  min-width: 0;
}

.alert-title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-1);
}

.alert-description {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.alert-badge {
  display: inline-block;
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-base);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
}

.progress-bar {
  background: var(--color-bg-muted);
  border-radius: var(--radius-base);
  height: 0.5rem;
  width: 100%;
  overflow: hidden;
}

.progress-fill {
  background: var(--color-primary-600);
  height: 100%;
  transition: width var(--transition-fast);
}

.spinner {
  border: 4px solid var(--color-border-light);
  border-top: 4px solid var(--color-primary-600);
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: stretch;
  }

  .content-grid {
    grid-template-columns: 1fr;
  }

  .action-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }

  .page-title {
    font-size: var(--font-size-2xl);
  }
}
</style>
