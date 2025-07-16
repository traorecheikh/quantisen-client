<template>
  <div class="beverages-page">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-text">
          <h1 class="page-title">Boissons</h1>
          <p class="page-subtitle">Gérer tous les produits de boisson de votre inventaire</p>
        </div>
        <div class="header-actions">
          <button
            class="add-btn primary"
            @click="openAddModal"
          >
            <PlusIcon class="w-4 h-4" />
            Ajouter Boisson
          </button>
        </div>
      </div>
    </div>

    <!-- Beverages Table -->
    <div class="table-section">
      <div class="table-container">
        <table class="beverages-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Description</th>
              <th>Prix</th>
              <th>Volume</th>
              <th>Seuil de Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="beverage in beverages" :key="beverage.id">
              <td class="name-cell">{{ beverage.nom }}</td>
              <td class="description-cell">{{ beverage.description }}</td>
              <td class="price-cell">{{ beverage.prix.toFixed(2) }} FCFA </td>
              <td class="volume-cell">{{ beverage.volume }}{{ beverage.unite }}</td>
              <td class="threshold-cell">{{ beverage.seuil }}</td>
              <td class="actions-cell">
                <button
                  class="edit-btn"
                  @click="openEditModal(beverage)"
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

    <!-- Add Beverage Modal -->
    <div v-if="showAddModal" class="modal-backdrop" @click="closeAddModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h2>Ajouter une Boisson</h2>
          <button class="close-btn" @click="closeAddModal">
            <XMarkIcon class="w-5 h-5" />
          </button>
        </div>

        <form @submit.prevent="addBeverage" class="modal-form">
          <div class="form-group">
            <label for="add-name">Nom de la boisson</label>
            <input
              id="add-name"
              v-model="addForm.nom"
              type="text"
              class="form-input"
              placeholder="Ex: Coca-Cola Classique"
              required
            />
          </div>

          <div class="form-group">
            <label for="add-description">Description</label>
            <textarea
              id="add-description"
              v-model="addForm.description"
              class="form-input"
              placeholder="Description du produit"
              rows="3"
            ></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="add-price">Prix (XOF)</label>
              <input
                id="add-price"
                v-model.number="addForm.prix"
                type="number"
                step="0.01"
                min="0"
                class="form-input"
                placeholder="0.00"
                required
              />
            </div>

            <div class="form-group">
              <label for="add-volume">Volume</label>
              <input
                id="add-volume"
                v-model.number="addForm.volume"
                type="number"
                min="1"
                class="form-input"
                placeholder="330"
                required
              />
            </div>

            <div class="form-group">
              <label for="add-unit">Unité</label>
              <select id="add-unit" v-model="addForm.unite" class="form-input" required>
                <option value="ml">ml</option>
                <option value="cl">cl</option>
                <option value="L">L</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label for="add-threshold">Seuil de Stock</label>
            <input
              id="add-threshold"
              v-model.number="addForm.seuil"
              type="number"
              min="1"
              class="form-input"
              placeholder="50"
              required
            />
          </div>

          <div class="modal-actions">
            <button type="button" class="cancel-btn" @click="closeAddModal">
              Annuler
            </button>
            <button type="submit" class="submit-btn primary">
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Edit Beverage Modal -->
    <div v-if="showEditModal" class="modal-backdrop" @click="closeEditModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h2>Modifier la Boisson</h2>
          <button class="close-btn" @click="closeEditModal">
            <XMarkIcon class="w-5 h-5" />
          </button>
        </div>

        <form @submit.prevent="updateBeverage" class="modal-form">
          <div class="form-group">
            <label for="edit-name">Nom de la boisson</label>
            <input
              id="edit-name"
              :value="editForm.nom"
              type="text"
              class="form-input disabled"
              disabled
              title="Le nom ne peut pas être modifié"
            />
            <span class="field-note">Le nom ne peut pas être modifié</span>
          </div>

          <div class="form-group">
            <label for="edit-description">Description</label>
            <textarea
              id="edit-description"
              v-model="editForm.description"
              class="form-input"
              placeholder="Description du produit"
              rows="3"
            ></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="edit-price">Prix (XOF)</label>
              <input
                id="edit-price"
                v-model.number="editForm.prix"
                type="number"
                step="0.01"
                min="0"
                class="form-input"
                required
              />
            </div>

            <div class="form-group">
              <label for="edit-volume">Volume</label>
              <input
                id="edit-volume"
                v-model.number="editForm.volume"
                type="number"
                min="1"
                class="form-input"
                required
              />
            </div>

            <div class="form-group">
              <label for="edit-unit">Unité</label>
              <select id="edit-unit" v-model="editForm.unite" class="form-input" required>
                <option value="ml">ml</option>
                <option value="cl">cl</option>
                <option value="L">L</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label for="edit-threshold">Seuil de Stock</label>
            <input
              id="edit-threshold"
              v-model.number="editForm.seuil"
              type="number"
              min="1"
              class="form-input"
              required
            />
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
import {onMounted, ref} from 'vue'
import { PlusIcon, PencilIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import {type Boisson, BoissonService} from "../api";

const showAddModal = ref(false)
const showEditModal = ref(false)
const editingBeverage = ref<Boisson | null>(null)

const beverages = ref<Boisson[]>([
  {
    id: 1,
    nom: 'Coca-Cola Classique',
    description: 'Soda classique au goût de cola',
    prix: 300,
    volume: 330,
    unite: 'ml',
    seuil: 50,
    isActive: true
  },
  {
    id: 2,
    nom: 'Fanta Orange',
    description: 'Soda à l’orange pétillant',
    prix: 350,
    volume: 330,
    unite: 'ml',
    seuil: 40,
    isActive: true
  },
  {
    id: 3,
    nom: 'Sprite',
    description: 'Soda citron-lime rafraîchissant',
    prix: 320,
    volume: 330,
    unite: 'ml',
    seuil: 30,
    isActive: true
  }
])

const addForm = ref({
  nom: '',
  description: '',
  prix: 0,
  volume: 0,
  unite: 'ml',
  seuil: 0
})

const editForm = ref({
  nom: '',
  description: '',
  prix: 0,
  volume: 0,
  unite: 'ml',
  seuil: 0,
  isActive: true
})

const openAddModal = () => {
  addForm.value = {
    nom: '',
    description: '',
    prix: 0,
    volume: 0,
    unite: 'ml',
    seuil: 0,
  }
  showAddModal.value = true
}

const closeAddModal = () => {
  showAddModal.value = false
}

const openEditModal = (beverage: Boisson) => {
  editingBeverage.value = beverage
  editForm.value = { ...beverage, }
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  editingBeverage.value = null
}

const addBeverage = () => {
  const newBeverage: Boisson = {
    id: Date.now(),
    isActive: false,
    ...addForm.value
  }
  beverages.value.push(newBeverage)
  closeAddModal()
}

const updateBeverage = () => {
  if (editingBeverage.value) {
    const index = beverages.value.findIndex(b => b.id === editingBeverage.value!.id)
    if (index !== -1) {
      beverages.value[index] = { ...editForm.value, id: editingBeverage.value.id , isActive:true}
    }
  }
  closeEditModal()
}

async function loadLots() {
  beverages.value = await BoissonService.getAllBeverages();
}

onMounted(loadLots)
</script>

<style scoped>
.beverages-page {
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

.add-btn {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  border: none;
  border-radius: var(--radius-lg);
  background: var(--color-primary-500);
  color: var(--color-text-inverse);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.add-btn:hover {
  background: var(--color-primary-600);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
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

.beverages-table {
  width: 100%;
  border-collapse: collapse;
}

.beverages-table th,
.beverages-table td {
  padding: var(--space-4);
  text-align: left;
  border-bottom: 1px solid var(--color-border-light);
}

.beverages-table th {
  background: var(--color-bg-secondary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.beverages-table td {
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
}

.name-cell {
  font-weight: var(--font-weight-medium);
}

.price-cell {
  font-weight: var(--font-weight-medium);
  color: var(--color-primary-600);
}

.actions-cell {
  width: 80px;
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

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: var(--space-3);
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

  .form-row {
    grid-template-columns: 1fr;
  }

  .modal {
    margin: var(--space-2);
  }

  .modal-actions {
    flex-direction: column;
  }
}
</style>
