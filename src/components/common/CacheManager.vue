/** * Cache Management Component for Dashboard * Provides cache statistics and manual cache control
*/

<template>
  <div class="cache-manager">
    <div class="cache-header">
      <h3 class="cache-title">Gestion du Cache</h3>
      <div class="cache-actions">
        <button @click="refreshStats" class="btn btn-secondary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Actualiser
        </button>
        <button @click="clearAllCache" class="btn btn-warning">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          Tout Vider
        </button>
      </div>
    </div>

    <div class="cache-stats">
      <div class="stat-card">
        <div class="stat-icon">🗂️</div>
        <div class="stat-content">
          <h4>Entrées en cache</h4>
          <p class="stat-value">{{ stats.size }}</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">💾</div>
        <div class="stat-content">
          <h4>Utilisation mémoire</h4>
          <p class="stat-value">{{ stats.totalMemory }}</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">⚡</div>
        <div class="stat-content">
          <h4>Taux de réussite</h4>
          <p class="stat-value">{{ hitRate }}%</p>
        </div>
      </div>
    </div>

    <div class="cache-entries" v-if="showDetails">
      <div class="entries-header">
        <h4>Entrées en cache</h4>
        <button @click="showDetails = false" class="btn btn-sm">Cacher</button>
      </div>

      <div class="entry-list">
        <div v-for="entry in groupedEntries" :key="entry.category" class="entry-group">
          <div class="group-header">
            <span class="group-name">{{ entry.category }}</span>
            <span class="group-count">{{ entry.keys.length }} entrées</span>
            <button
              @click="clearCategory(entry.category.toLowerCase())"
              class="btn btn-sm btn-danger"
            >
              Vider
            </button>
          </div>

          <div class="group-keys">
            <div v-for="key in entry.keys" :key="key" class="cache-key">
              <span class="key-name">{{ key }}</span>
              <button @click="clearKey(key)" class="btn btn-xs btn-danger">×</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="cache-controls">
      <button @click="showDetails = !showDetails" class="btn btn-secondary">
        {{ showDetails ? 'Cacher les détails' : 'Afficher les détails' }}
      </button>

      <button @click="clearExpired" class="btn btn-secondary">Supprimer expirés</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { cacheManager } from '../../api/api'
import { showToast } from '../../utils/toast'

const stats = ref({
  size: 0,
  keys: [] as string[],
  totalMemory: '0 KB',
})

const showDetails = ref(false)
const hitRate = ref(0)

const groupedEntries = computed(() => {
  const groups: { [key: string]: string[] } = {}

  stats.value.keys.forEach((key) => {
    const category = key.split('_')[0] || 'Other'
    const categoryName = category.charAt(0).toUpperCase() + category.slice(1)

    if (!groups[categoryName]) {
      groups[categoryName] = []
    }
    groups[categoryName].push(key)
  })

  return Object.entries(groups).map(([category, keys]) => ({
    category,
    keys: keys.sort(),
  }))
})

const refreshStats = () => {
  stats.value = cacheManager.getStats()

  // Calculate hit rate (simplified - you might want to implement proper metrics)
  const totalRequests = stats.value.size * 1.5 // Simulated
  hitRate.value = totalRequests > 0 ? Math.round((stats.value.size / totalRequests) * 100) : 0
}

const clearAllCache = () => {
  cacheManager.clear()
  refreshStats()
  showToast('Cache cleared successfully', 'success')
}

const clearExpired = () => {
  cacheManager.clearExpired()
  refreshStats()
  showToast('Expired cache entries cleared', 'success')
}

const clearCategory = (category: string) => {
  const keys = cacheManager.getStats().keys
  keys.forEach((key) => {
    if (key.toLowerCase().includes(category)) {
      cacheManager.delete(key)
    }
  })
  refreshStats()
  showToast(`${category} cache cleared`, 'success')
}

const clearKey = (key: string) => {
  cacheManager.delete(key)
  refreshStats()
  showToast('Cache entry deleted', 'success')
}

onMounted(() => {
  refreshStats()

  // Auto-refresh stats every 30 seconds
  setInterval(refreshStats, 30000)
})
</script>

<style scoped>
.cache-manager {
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border-light);
  border-radius: 8px;
  padding: var(--space-6);
  margin-top: var(--space-6);
}

.cache-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-4);
}

.cache-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.cache-actions {
  display: flex;
  gap: var(--space-2);
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-2) var(--space-3);
  border: 1px solid transparent;
  border-radius: 4px;
  font-size: var(--font-size-sm);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary {
  background: var(--color-secondary-100);
  color: var(--color-secondary-700);
  border-color: var(--color-secondary-200);
}

.btn-secondary:hover {
  background: var(--color-secondary-200);
}

.btn-warning {
  background: var(--color-warning-100);
  color: var(--color-warning-700);
  border-color: var(--color-warning-200);
}

.btn-warning:hover {
  background: var(--color-warning-200);
}

.btn-danger {
  background: var(--color-error-100);
  color: var(--color-error-700);
  border-color: var(--color-error-200);
}

.btn-danger:hover {
  background: var(--color-error-200);
}

.btn-sm {
  padding: var(--space-1) var(--space-2);
  font-size: var(--font-size-xs);
}

.btn-xs {
  padding: 2px 6px;
  font-size: var(--font-size-xs);
  line-height: 1;
}

.cache-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-4);
  margin-bottom: var(--space-6);
}

.stat-card {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-light);
  border-radius: 6px;
  padding: var(--space-4);
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.stat-icon {
  font-size: 1.5rem;
  width: 40px;
  text-align: center;
}

.stat-content h4 {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text-secondary);
  margin: 0 0 var(--space-1);
}

.stat-value {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.cache-entries {
  margin-bottom: var(--space-4);
}

.entries-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-3);
}

.entries-header h4 {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.entry-list {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid var(--color-border-light);
  border-radius: 4px;
}

.entry-group {
  border-bottom: 1px solid var(--color-border-light);
}

.entry-group:last-child {
  border-bottom: none;
}

.group-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-3);
  background: var(--color-bg-tertiary);
  border-bottom: 1px solid var(--color-border-light);
}

.group-name {
  font-weight: 600;
  color: var(--color-text-primary);
}

.group-count {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.group-keys {
  padding: var(--space-2);
}

.cache-key {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-2);
  border-radius: 4px;
  margin-bottom: var(--space-1);
  background: var(--color-bg-secondary);
}

.cache-key:last-child {
  margin-bottom: 0;
}

.key-name {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  font-family: monospace;
}

.cache-controls {
  display: flex;
  gap: var(--space-3);
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-border-light);
}

@media (max-width: 768px) {
  .cache-stats {
    grid-template-columns: 1fr;
  }

  .cache-actions {
    flex-direction: column;
    gap: var(--space-2);
  }

  .cache-controls {
    flex-direction: column;
  }
}
</style>
