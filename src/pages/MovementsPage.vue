<template>
  <div class="movements-page">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-text">
          <h1 class="page-title">Mouvements de Stock</h1>
          <p class="page-subtitle">Gérer toutes les entrées et sorties de stock</p>
        </div>
        <div class="header-actions">
          <button
            class="add-btn success"
            @click="openAddModal('ENTREE')"
          >
            <ArrowDownIcon class="w-4 h-4" />
            Entrée de Stock
          </button>
          <button
            class="add-btn error"
            @click="openAddModal('SORTIE')"
          >
            <ArrowUpIcon class="w-4 h-4" />
            Sortie de Stock
          </button>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-section">
      <div class="filters-container">
        <select v-model="typeFilter" class="filter-select">
          <option value="all">Tous les mouvements</option>
          <option value="ENTREE">Entrées uniquement</option>
          <option value="SORTIE">Sorties uniquement</option>
        </select>

        <select v-model="beverageFilter" class="filter-select">
          <option value="all">Toutes les boissons</option>
          <option v-for="beverage in availableBeverages" :key="beverage" :value="beverage">
            {{ beverage }}
          </option>
        </select>
      </div>
    </div>

    <!-- Movements Table -->
    <div class="table-section">
      <div class="table-container">
        <table class="movements-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Boisson</th>
              <th>Quantité</th>
              <th>Lot/Batch</th>
              <th>Date d'Expiration</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="movement in filteredMovements" :key="movement.id">
              <td class="type-cell">
                <span class="type-badge" :class="movement.type.toLowerCase()">
                  <ArrowDownIcon v-if="movement.type === 'ENTREE'" class="w-3 h-3" />
                  <ArrowUpIcon v-else class="w-3 h-3" />
                  {{ movement.type }}
                </span>
              </td>
              <td class="beverage-cell">{{ movement.beverageName }}</td>
              <td class="quantity-cell">
                <span :class="movement.type.toLowerCase()">
                  {{ movement.type === 'ENTREE' ? '+' : '-' }}{{ movement.quantity }}
                </span>
              </td>
              <td class="lot-cell">{{ movement.lotNumber || '-' }}</td>
              <td class="expiry-cell">
                <span v-if="movement.expiryDate" :class="getExpiryStatus(movement.expiryDate)">
                  {{ formatDate(movement.expiryDate) }}
                </span>
                <span v-else>-</span>
              </td>
              <td class="date-cell">{{ formatDate(movement.date) }}</td>
              <td class="actions-cell">
                <button
                  class="edit-btn"
                  @click="openEditModal(movement)"
                  title="Modifier"
                >
                  <PencilIcon class="w-4 h-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add Movement Modal -->
    <div v-if="showAddModal" class="modal-backdrop" @click="closeAddModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h2>
            {{ addForm.type === 'ENTREE' ? 'Ajouter une Entrée' : 'Ajouter une Sortie' }}
          </h2>
          <button class="close-btn" @click="closeAddModal">
            <XMarkIcon class="w-5 h-5" />
          </button>
        </div>

        <form @submit.prevent="addMovement" class="modal-form">
          <div class="form-group">
            <label for="add-beverage">Boisson</label>
            <select id="add-beverage" v-model="addForm.beverageName" class="form-input" required>
              <option value="">Sélectionner une boisson</option>
              <option v-for="beverage in availableBeverages" :key="beverage" :value="beverage">
                {{ beverage }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="add-quantity">Quantité</label>
            <input
              id="add-quantity"
              v-model.number="addForm.quantity"
              type="number"
              min="1"
              class="form-input"
              placeholder="Ex: 50"
              required
            />
          </div>

          <!-- Lot Information (only for ENTREE) -->
          <div v-if="addForm.type === 'ENTREE'" class="lot-section">
            <h3 class="section-title">Informations du Lot (Optionnel)</h3>

            <div class="form-group">
              <label for="add-lot">Numéro de Lot</label>
              <input
                id="add-lot"
                v-model="addForm.lotNumber"
                type="text"
                class="form-input"
                placeholder="Ex: LOT-2025-001"
              />
            </div>

            <div class="form-group">
              <label for="add-expiry">Date d'Expiration</label>
              <input
                id="add-expiry"
                v-model="addForm.expiryDate"
                type="date"
                class="form-input"
              />
            </div>
          </div>

          <div class="modal-actions">
            <button type="button" class="cancel-btn" @click="closeAddModal">
              Annuler
            </button>
            <button type="submit" class="submit-btn" :class="addForm.type.toLowerCase()">
              {{ addForm.type === 'ENTREE' ? 'Ajouter Entrée' : 'Ajouter Sortie' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Edit Movement Modal -->
    <div v-if="showEditModal" class="modal-backdrop" @click="closeEditModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h2>Modifier le Mouvement</h2>
          <button class="close-btn" @click="closeEditModal">
            <XMarkIcon class="w-5 h-5" />
          </button>
        </div>

        <form @submit.prevent="updateMovement" class="modal-form">
          <div class="form-group">
            <label for="edit-type">Type</label>
            <input
              id="edit-type"
              :value="editForm.type"
              type="text"
              class="form-input disabled"
              disabled
              title="Le type ne peut pas être modifié"
            />
            <span class="field-note">Le type ne peut pas être modifié</span>
          </div>

          <div class="form-group">
            <label for="edit-beverage">Boisson</label>
            <input
              id="edit-beverage"
              :value="editForm.beverageName"
              type="text"
              class="form-input disabled"
              disabled
              title="La boisson ne peut pas être modifiée"
            />
            <span class="field-note">La boisson ne peut pas être modifiée</span>
          </div>

          <div class="form-group">
            <label for="edit-quantity">Quantité</label>
            <input
              id="edit-quantity"
              v-model.number="editForm.quantity"
              type="number"
              min="1"
              class="form-input"
              required
            />
          </div>

          <!-- Lot Information (only for ENTREE) -->
          <div v-if="editForm.type === 'ENTREE'" class="lot-section">
            <h3 class="section-title">Informations du Lot</h3>

            <div class="form-group">
              <label for="edit-lot">Numéro de Lot</label>
              <input
                id="edit-lot"
                v-model="editForm.lotNumber"
                type="text"
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label for="edit-expiry">Date d'Expiration</label>
              <input
                id="edit-expiry"
                v-model="editForm.expiryDate"
                type="date"
                class="form-input"
              />
            </div>
          </div>

          <div class="modal-actions">
            <button type="button" class="cancel-btn" @click="closeEditModal">
              Annuler
            </button>
            <button type="submit" class="submit-btn primary">
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  ArrowDownIcon,
  ArrowUpIcon,
  PencilIcon,
  XMarkIcon,
  PlusIcon
} from '@heroicons/vue/24/outline'

interface Movement {
  id: number
  type: 'ENTREE' | 'SORTIE'
  beverageName: string
  quantity: number
  lotNumber?: string
  expiryDate?: string
  date: string
}

const showAddModal = ref(false)
const showEditModal = ref(false)
const editingMovement = ref<Movement | null>(null)
const typeFilter = ref('all')
const beverageFilter = ref('all')

// Sample movements data that includes both individual movements and lot-based entries
const movements = ref<Movement[]>([
  {
    id: 1,
    type: 'ENTREE',
    beverageName: 'Coca-Cola 330ml',
    quantity: 100,
    lotNumber: 'LOT-2025-001',
    expiryDate: '2025-12-15',
    date: '2025-07-10'
  },
  {
    id: 2,
    type: 'SORTIE',
    beverageName: 'Coca-Cola 330ml',
    quantity: 25,
    date: '2025-07-11'
  },
  {
    id: 3,
    type: 'ENTREE',
    beverageName: 'Fanta Orange 330ml',
    quantity: 75,
    lotNumber: 'LOT-2025-002',
    expiryDate: '2025-11-30',
    date: '2025-07-09'
  },
  {
    id: 4,
    type: 'SORTIE',
    beverageName: 'Sprite 500ml',
    quantity: 15,
    date: '2025-07-11'
  }
])

const availableBeverages = ['Coca-Cola 330ml', 'Fanta Orange 330ml', 'Sprite 500ml', 'Pepsi 500ml']

// Add form
const addForm = ref({
  type: 'ENTREE' as 'ENTREE' | 'SORTIE',
  beverageName: '',
  quantity: 0,
  lotNumber: '',
  expiryDate: ''
})

// Edit form
const editForm = ref({
  type: 'ENTREE' as 'ENTREE' | 'SORTIE',
  beverageName: '',
  quantity: 0,
  lotNumber: '',
  expiryDate: ''
})

const filteredMovements = computed(() => {
  let filtered = movements.value

  if (typeFilter.value !== 'all') {
    filtered = filtered.filter(m => m.type === typeFilter.value)
  }

  if (beverageFilter.value !== 'all') {
    filtered = filtered.filter(m => m.beverageName === beverageFilter.value)
  }

  return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

const openAddModal = (type: 'ENTREE' | 'SORTIE') => {
  addForm.value = {
    type,
    beverageName: '',
    quantity: 0,
    lotNumber: '',
    expiryDate: ''
  }
  showAddModal.value = true
}

const closeAddModal = () => {
  showAddModal.value = false
}

const openEditModal = (movement: Movement) => {
  editingMovement.value = movement
  editForm.value = { ...movement }
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  editingMovement.value = null
}

const addMovement = () => {
  const newMovement: Movement = {
    id: Date.now(),
    type: addForm.value.type,
    beverageName: addForm.value.beverageName,
    quantity: addForm.value.quantity,
    lotNumber: addForm.value.lotNumber || undefined,
    expiryDate: addForm.value.expiryDate || undefined,
    date: new Date().toISOString().split('T')[0]
  }
  movements.value.push(newMovement)
  closeAddModal()
}

const updateMovement = () => {
  if (editingMovement.value) {
    const index = movements.value.findIndex(m => m.id === editingMovement.value!.id)
    if (index !== -1) {
      movements.value[index] = { ...editForm.value, id: editingMovement.value.id }
    }
  }
  closeEditModal()
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('fr-FR')
}

const getExpiryStatus = (expiryDate: string) => {
  const today = new Date()
  const expiry = new Date(expiryDate)
  const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return 'expired'
  if (diffDays <= 30) return 'warning'
  return 'normal'
}
</script>

<style scoped>
.movements-page {
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

.add-btn {
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

.add-btn.success {
  background: var(--color-success-500);
  color: var(--color-text-inverse);
}

.add-btn.success:hover {
  background: var(--color-success-600);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.add-btn.error {
  background: var(--color-error-500);
  color: var(--color-text-inverse);
}

.add-btn.error:hover {
  background: var(--color-error-600);
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

.table-section {
  background: var(--color-bg-primary);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.table-container {
  overflow-x: auto;
}

.movements-table {
  width: 100%;
  border-collapse: collapse;
}

.movements-table th,
.movements-table td {
  padding: var(--space-4);
  text-align: left;
  border-bottom: 1px solid var(--color-border-light);
}

.movements-table th {
  background: var(--color-bg-secondary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.movements-table td {
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
}

.type-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  text-transform: uppercase;
}

.type-badge.entree {
  background: var(--color-success-50);
  color: var(--color-success-700);
}

.type-badge.sortie {
  background: var(--color-error-50);
  color: var(--color-error-700);
}

.quantity-cell span.entree {
  color: var(--color-success-600);
  font-weight: var(--font-weight-semibold);
}

.quantity-cell span.sortie {
  color: var(--color-error-600);
  font-weight: var(--font-weight-semibold);
}

.expiry-cell .normal {
  color: var(--color-success-600);
}

.expiry-cell .warning {
  color: var(--color-warning-600);
  font-weight: var(--font-weight-medium);
}

.expiry-cell .expired {
  color: var(--color-error-600);
  font-weight: var(--font-weight-medium);
}

.edit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: none;
  border-radius: var(--radius-md);
  background: var(--color-bg-secondary);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.edit-btn:hover {
  background: var(--color-primary-50);
  color: var(--color-primary-600);
}

/* Modal Styles */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: var(--color-bg-primary);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-2xl);
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  margin: var(--space-4);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-6);
  border-bottom: 1px solid var(--color-border-light);
}

.modal-header h2 {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: none;
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.close-btn:hover {
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
}

.modal-form {
  padding: var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.form-group label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.form-input {
  padding: var(--space-3);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  transition: all var(--transition-fast);
}

.form-input:focus {
  outline: none;
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 3px var(--color-primary-100);
}

.form-input.disabled {
  background: var(--color-bg-secondary);
  color: var(--color-text-muted);
  cursor: not-allowed;
}

.field-note {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
  font-style: italic;
}

.lot-section {
  background: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  margin-top: var(--space-2);
}

.section-title {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-3);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-border-light);
}

.cancel-btn,
.submit-btn {
  padding: var(--space-3) var(--space-4);
  border: none;
  border-radius: var(--radius-lg);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.cancel-btn {
  background: var(--color-bg-secondary);
  color: var(--color-text-secondary);
}

.cancel-btn:hover {
  background: var(--color-bg-tertiary);
  color: var(--color-text-primary);
}

.submit-btn.entree {
  background: var(--color-success-500);
  color: var(--color-text-inverse);
}

.submit-btn.entree:hover {
  background: var(--color-success-600);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.submit-btn.sortie {
  background: var(--color-error-500);
  color: var(--color-text-inverse);
}

.submit-btn.sortie:hover {
  background: var(--color-error-600);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.submit-btn.primary {
  background: var(--color-primary-500);
  color: var(--color-text-inverse);
}

.submit-btn.primary:hover {
  background: var(--color-primary-600);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: stretch;
  }

  .header-actions {
    flex-direction: column;
  }

  .filters-container {
    flex-direction: column;
  }

  .modal {
    margin: var(--space-2);
  }

  .modal-actions {
    flex-direction: column;
  }
}
</style>
