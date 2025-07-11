<template>
  <div class="dashboard-page">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-text">
          <h1 class="page-title">Tableau de bord</h1>
          <p class="page-subtitle">Surveillez votre inventaire de boissons et vos opérations</p>
        </div>

      </div>
    </div>

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
            <h3 class="metric-title">Total des produits</h3>
            <p class="metric-value">{{ totalProducts }}</p>
            <p class="metric-change positive">+12% par rapport au mois dernier</p>
          </div>
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-header">
          <div class="metric-icon warning">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
          </div>
          <div class="metric-details">
            <h3 class="metric-title">Articles en stock faible</h3>
            <p class="metric-value">{{ lowStockItems }}</p>
            <p class="metric-change negative">Nécessite attention</p>
          </div>
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-header">
          <div class="metric-icon info">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <div class="metric-details">
            <h3 class="metric-title">Valeur totale du stock</h3>
            <p class="metric-value">{{ totalValue.toLocaleString() }} FCFA</p>
            <p class="metric-change positive">+5% cette semaine</p>
          </div>
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-header">
          <div class="metric-icon error">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-6h2v6zm0-8h-2V7h2v4z"/>
            </svg>
          </div>
          <div class="metric-details">
            <h3 class="metric-title">Produits expirés</h3>
            <p class="metric-value">{{ expiredItems }}</p>
            <p class="metric-change negative">Action requise</p>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const totalProducts = ref(0)
const lowStockItems = ref(0)
const totalValue = ref(0)
const expiredItems = ref(0)

const recentActivities = ref([
  {
    id: 1,
    type: 'success',
    title: 'Nouveau stock ajouté',
    description: 'Coca-Cola 500ml - 100 unités',
    time: 'Il y a 2 heures'
  },
  {
    id: 2,
    type: 'warning',
    title: 'Stock faible détecté',
    description: 'Pepsi 330ml - 15 unités restantes',
    time: 'Il y a 4 heures'
  },
  {
    id: 3,
    type: 'info',
    title: 'Rapport généré',
    description: 'Rapport mensuel des ventes',
    time: 'Il y a 6 heures'
  }
])

onMounted(() => {
  // Simulate loading data
  totalProducts.value = 245
  lowStockItems.value = 8
  totalValue.value = 1655420
  expiredItems.value = 3
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

.action-btn {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  border: none;
  border-radius: var(--radius-lg);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.action-btn.primary {
  background: var(--color-primary-500);
  color: var(--color-text-inverse);
}

.action-btn.primary:hover {
  background: var(--color-primary-600);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
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

.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-6);
}

.panel {
  background: var(--color-bg-primary);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-6) var(--space-6) var(--space-4) var(--space-6);
  border-bottom: 1px solid var(--color-border-light);
}

.panel-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.panel-action {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-primary-600);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.panel-action:hover {
  color: var(--color-primary-700);
}

.panel-content {
  padding: var(--space-6);
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-4);
}

.action-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-6);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
  text-decoration: none;
  transition: all var(--transition-fast);
}

.action-card:hover {
  background: var(--color-bg-tertiary);
  transform: translateY(-2px);
}

.action-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 4rem;
  background: var(--color-primary-100);
  color: var(--color-primary-600);
  border-radius: var(--radius-xl);
}

.action-content {
  text-align: center;
}

.action-title {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-1);
}

.action-description {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.activity-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  border-radius: var(--radius-lg);
  background: var(--color-bg-secondary);
}

.activity-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: var(--radius-full);
  flex-shrink: 0;
}

.activity-icon.entry {
  background: var(--color-success-100);
  color: var(--color-success-600);
}

.activity-icon.exit {
  background: var(--color-error-100);
  color: var(--color-error-600);
}

.activity-icon.adjustment {
  background: var(--color-warning-100);
  color: var(--color-warning-600);
}

.activity-content {
  flex: 1;
  min-width: 0;
}

.activity-description {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  margin-bottom: var(--space-1);
}

.activity-time {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
}

.activity-quantity {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-base);
}

.activity-quantity.entry {
  background: var(--color-success-50);
  color: var(--color-success-700);
}

.activity-quantity.exit {
  background: var(--color-error-50);
  color: var(--color-error-700);
}

.activity-quantity.adjustment {
  background: var(--color-warning-50);
  color: var(--color-warning-700);
}

.alerts-section {
  margin-top: var(--space-2);
}

.alert-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.alert-item {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-4);
  border-radius: var(--radius-lg);
  border-left: 4px solid;
}

.alert-item.warning {
  background: var(--color-warning-50);
  border-left-color: var(--color-warning-500);
}

.alert-item.error {
  background: var(--color-error-50);
  border-left-color: var(--color-error-500);
}

.alert-icon {
  color: var(--color-warning-600);
  flex-shrink: 0;
}

.alert-item.error .alert-icon {
  color: var(--color-error-600);
}

.alert-content {
  flex: 1;
  min-width: 0;
}

.alert-title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-1);
}

.alert-message {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.alert-dismiss {
  background: none;
  border: none;
  font-size: var(--font-size-lg);
  color: var(--color-text-tertiary);
  cursor: pointer;
  padding: 0;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-base);
  transition: all var(--transition-fast);
}

.alert-dismiss:hover {
  background: var(--color-bg-muted);
  color: var(--color-text-secondary);
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
