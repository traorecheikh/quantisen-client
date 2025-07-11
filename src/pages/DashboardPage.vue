<template>
  <div class="dashboard-page">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-text">
          <h1 class="page-title">Dashboard Overview</h1>
          <p class="page-subtitle">Monitor your beverage inventory and operations</p>
        </div>
        <div class="header-actions">
          <button class="action-btn primary">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 2a1 1 0 011 1v4h4a1 1 0 110 2H9v4a1 1 0 11-2 0V9H3a1 1 0 110-2h4V3a1 1 0 011-1z"/>
            </svg>
            Quick Actions
          </button>
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
            <h3 class="metric-title">Total Products</h3>
            <p class="metric-value">{{ totalProducts }}</p>
            <p class="metric-change positive">+12% from last month</p>
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
            <h3 class="metric-title">Low Stock Items</h3>
            <p class="metric-value">{{ lowStockItems }}</p>
            <p class="metric-change negative">Requires attention</p>
          </div>
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-header">
          <div class="metric-icon info">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
          </div>
          <div class="metric-details">
            <h3 class="metric-title">Active Lots</h3>
            <p class="metric-value">{{ activeLots }}</p>
            <p class="metric-change neutral">{{ expiringSoon }} expiring soon</p>
          </div>
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-header">
          <div class="metric-icon primary">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
          </div>
          <div class="metric-details">
            <h3 class="metric-title">Today's Movements</h3>
            <p class="metric-value">{{ todayMovements }}</p>
            <p class="metric-change positive">{{ entryMovements }} entries, {{ exitMovements }} exits</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="content-grid">
      <!-- Quick Actions Panel -->
      <div class="panel">
        <div class="panel-header">
          <h2 class="panel-title">Quick Actions</h2>
        </div>
        <div class="panel-content">
          <div class="action-grid">
            <router-link to="/beverages" class="action-card">
              <div class="action-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="currentColor">
                  <path d="M6 8h20v16a4 4 0 01-4 4H10a4 4 0 01-4-4V8zM10 4h12v4H10z"/>
                </svg>
              </div>
              <div class="action-content">
                <h3 class="action-title">Manage Beverages</h3>
                <p class="action-description">Add, edit, or view beverage products</p>
              </div>
            </router-link>

            <router-link to="/lots" class="action-card">
              <div class="action-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="currentColor">
                  <path d="M8 6h16v20a2 2 0 01-2 2H10a2 2 0 01-2-2V6zM12 2h8v4h-8z"/>
                </svg>
              </div>
              <div class="action-content">
                <h3 class="action-title">Track Lots</h3>
                <p class="action-description">Monitor lot status and expiration dates</p>
              </div>
            </router-link>

            <router-link to="/movements" class="action-card">
              <div class="action-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="currentColor">
                  <path d="M16 4L8 12h6v12h4V12h6l-8-8zM4 28h24v-4H4v4z"/>
                </svg>
              </div>
              <div class="action-content">
                <h3 class="action-title">Record Movement</h3>
                <p class="action-description">Log stock entries, exits, and adjustments</p>
              </div>
            </router-link>

            <router-link to="/stocks" class="action-card">
              <div class="action-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="currentColor">
                  <path d="M4 4h24v24H4V4zm4 4v16h16V8H8zm4 4h8v8h-8v-8z"/>
                </svg>
              </div>
              <div class="action-content">
                <h3 class="action-title">View Stock</h3>
                <p class="action-description">Check current inventory levels</p>
              </div>
            </router-link>
          </div>
        </div>
      </div>

      <!-- Recent Activity Panel -->
      <div class="panel">
        <div class="panel-header">
          <h2 class="panel-title">Recent Activity</h2>
          <router-link to="/movements" class="panel-action">View All</router-link>
        </div>
        <div class="panel-content">
          <div class="activity-list">
            <div v-for="activity in recentActivities" :key="activity.id" class="activity-item">
              <div class="activity-icon" :class="activity.type">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path v-if="activity.type === 'entry'" d="M8 2a1 1 0 011 1v4h4a1 1 0 110 2H9v4a1 1 0 11-2 0V9H3a1 1 0 110-2h4V3a1 1 0 011-1z"/>
                  <path v-else-if="activity.type === 'exit'" d="M3 8a1 1 0 011-1h8a1 1 0 110 2H4a1 1 0 01-1-1z"/>
                  <path v-else d="M8 15A7 7 0 118 1a7 7 0 010 14zm0 1A8 8 0 108 0a8 8 0 000 16z"/>
                </svg>
              </div>
              <div class="activity-content">
                <p class="activity-description">{{ activity.description }}</p>
                <p class="activity-time">{{ activity.time }}</p>
              </div>
              <div class="activity-quantity" :class="activity.type">
                {{ activity.type === 'exit' ? '-' : '+' }}{{ activity.quantity }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Alert Notifications -->
    <div class="alerts-section" v-if="alerts.length > 0">
      <div class="panel">
        <div class="panel-header">
          <h2 class="panel-title">System Alerts</h2>
        </div>
        <div class="panel-content">
          <div class="alert-list">
            <div v-for="alert in alerts" :key="alert.id" class="alert-item" :class="alert.severity">
              <div class="alert-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"/>
                </svg>
              </div>
              <div class="alert-content">
                <h4 class="alert-title">{{ alert.title }}</h4>
                <p class="alert-message">{{ alert.message }}</p>
              </div>
              <button class="alert-dismiss">×</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Mock data - replace with real API calls
const totalProducts = ref(45)
const lowStockItems = ref(3)
const activeLots = ref(28)
const expiringSoon = ref(5)
const todayMovements = ref(12)
const entryMovements = ref(8)
const exitMovements = ref(4)

const recentActivities = ref([
  {
    id: 1,
    type: 'entry',
    description: 'Coca-Cola stock entry from Lot LOT-001',
    time: '2 hours ago',
    quantity: 50
  },
  {
    id: 2,
    type: 'exit',
    description: 'Fanta stock exit for delivery',
    time: '4 hours ago',
    quantity: 20
  },
  {
    id: 3,
    type: 'adjustment',
    description: 'Stock adjustment - damaged items',
    time: '1 day ago',
    quantity: 5
  }
])

const alerts = ref([
  {
    id: 1,
    severity: 'warning',
    title: 'Low Stock Alert',
    message: '3 beverages are below their minimum stock threshold and need restocking.'
  },
  {
    id: 2,
    severity: 'error',
    title: 'Expiration Warning',
    message: 'Lot LOT-003 (Pepsi) expires in 2 days. Please prioritize for sale.'
  }
])
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
