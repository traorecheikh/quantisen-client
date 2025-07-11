<template>
  <div class="analytics-page">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-text">
          <h1 class="page-title">Analyses</h1>
          <p class="page-subtitle">Tendances des entrées et sorties de stock</p>
        </div>
      </div>
    </div>

    <!-- Chart Section -->
    <div class="chart-section">
      <div class="chart-container">
        <div class="chart-header">
          <h2 class="chart-title">Mouvements de Stock - Cette Semaine</h2>
          <div class="chart-legend">
            <div class="legend-item">
              <div class="legend-color success"></div>
              <span>Entrées</span>
            </div>
            <div class="legend-item">
              <div class="legend-color error"></div>
              <span>Sorties</span>
            </div>
          </div>
        </div>
        <div class="chart-wrapper">
          <canvas ref="chartCanvas" id="weeklyChart"></canvas>
        </div>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="summary-grid">
      <div class="summary-card">
        <div class="card-header">
          <h3>Total Entrées</h3>
          <div class="card-icon success">↗</div>
        </div>
        <div class="card-content">
          <p class="card-value">{{ totalEntries }}</p>
          <p class="card-subtitle">unités cette semaine</p>
        </div>
      </div>

      <div class="summary-card">
        <div class="card-header">
          <h3>Total Sorties</h3>
          <div class="card-icon error">↘</div>
        </div>
        <div class="card-content">
          <p class="card-value">{{ totalExits }}</p>
          <p class="card-subtitle">unités cette semaine</p>
        </div>
      </div>

      <div class="summary-card">
        <div class="card-header">
          <h3>Bilan Net</h3>
          <div class="card-icon" :class="netBalance >= 0 ? 'success' : 'error'">
            {{ netBalance >= 0 ? '⇈' : '⇊' }}
          </div>
        </div>
        <div class="card-content">
          <p class="card-value" :class="netBalance >= 0 ? 'positive' : 'negative'">
            {{ netBalance >= 0 ? '+' : '' }}{{ netBalance }}
          </p>
          <p class="card-subtitle">différence nette</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const chartCanvas = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart | null = null

// Sample data for the week
const weeklyData = ref({
  labels: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
  entries: [120, 95, 140, 80, 110, 160, 90],
  exits: [85, 110, 95, 125, 90, 75, 105]
})

const totalEntries = computed(() =>
  weeklyData.value.entries.reduce((sum, val) => sum + val, 0)
)

const totalExits = computed(() =>
  weeklyData.value.exits.reduce((sum, val) => sum + val, 0)
)

const netBalance = computed(() =>
  totalEntries.value - totalExits.value
)

const createChart = () => {
  if (!chartCanvas.value) return

  const ctx = chartCanvas.value.getContext('2d')
  if (!ctx) return

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: weeklyData.value.labels,
      datasets: [
        {
          label: 'Entrées',
          data: weeklyData.value.entries,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#10b981',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8
        },
        {
          label: 'Sorties',
          data: weeklyData.value.exits,
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#ef4444',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: '#ffffff',
          titleColor: '#1f2937',
          bodyColor: '#6b7280',
          borderColor: '#e5e7eb',
          borderWidth: 1,
          cornerRadius: 8,
          displayColors: true,
          callbacks: {
            label: function(context) {
              return `${context.dataset.label}: ${context.parsed.y} unités`
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: '#f3f4f6'
          },
          ticks: {
            color: '#6b7280',
            font: {
              size: 12
            }
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: '#6b7280',
            font: {
              size: 12
            }
          }
        }
      },
      interaction: {
        intersect: false,
        mode: 'index'
      }
    }
  })
}

onMounted(() => {
  createChart()
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

@media (max-width: 768px) {
  .chart-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-4);
  }

  .chart-wrapper {
    height: 300px;
  }

  .summary-grid {
    grid-template-columns: 1fr;
  }
}
</style>
