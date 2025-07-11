<template>
  <div class="users-page">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-text">
          <h1 class="page-title">Utilisateurs</h1>
          <p class="page-subtitle">Gérer tous les comptes utilisateurs et leurs rôles</p>
        </div>
        <div class="header-actions">
          <button
            class="add-btn primary"
            @click="openAddModal"
          >
            <UserPlusIcon class="w-4 h-4" />
            Ajouter Utilisateur
          </button>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-section">
      <div class="filters-container">
        <select v-model="roleFilter" class="filter-select">
          <option value="all">Tous les rôles</option>
          <option value="GERANT">Gérants uniquement</option>
          <option value="EMPLOYE">Employés uniquement</option>
        </select>

        <input
          v-model="searchQuery"
          type="text"
          placeholder="Rechercher par email..."
          class="search-input"
        />
      </div>
    </div>

    <!-- Users Table -->
    <div class="table-section">
      <div class="table-container">
        <table class="users-table">
          <thead>
            <tr>
              <th>Utilisateur</th>
              <th>Rôle</th>
              <th>Statut</th>
              <th>Date de création</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in filteredUsers" :key="user.id">
              <td class="user-cell">
                <div class="user-info">
                  <div class="user-avatar">
                    {{ user.email.charAt(0).toUpperCase() }}
                  </div>
                  <div class="user-details">
                    <span class="user-email">{{ user.email }}</span>
                    <span class="user-meta">{{ user.firstName }} {{ user.lastName }}</span>
                  </div>
                </div>
              </td>
              <td class="role-cell">
                <span class="role-badge" :class="user.role.toLowerCase()">
                  <ShieldCheckIcon v-if="user.role === 'GERANT'" class="w-3 h-3" />
                  <UserIcon v-else class="w-3 h-3" />
                  {{ getRoleText(user.role) }}
                </span>
              </td>
              <td class="status-cell">
                <span class="status-badge" :class="user.isActive ? 'active' : 'inactive'">
                  {{ user.isActive ? 'Actif' : 'Inactif' }}
                </span>
              </td>
              <td class="date-cell">{{ formatDate(user.createdAt) }}</td>
              <td class="actions-cell">
                <button
                  class="edit-btn"
                  @click="openEditModal(user)"
                  title="Modifier"
                >
                  <PencilIcon class="w-4 h-4" />
                </button>
                <button
                  class="delete-btn"
                  @click="confirmDelete(user)"
                  title="Supprimer"
                  :disabled="user.role === 'GERANT' && gerantCount <= 1"
                >
                  <TrashIcon class="w-4 h-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add User Modal -->
    <div v-if="showAddModal" class="modal-backdrop" @click="closeAddModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h2>Ajouter un Utilisateur</h2>
          <button class="close-btn" @click="closeAddModal">
            <XMarkIcon class="w-5 h-5" />
          </button>
        </div>

        <form @submit.prevent="addUser" class="modal-form">
          <div class="form-row">
            <div class="form-group">
              <label for="add-firstName">Prénom</label>
              <input
                id="add-firstName"
                v-model="addForm.firstName"
                type="text"
                class="form-input"
                placeholder="Jean"
                required
              />
            </div>

            <div class="form-group">
              <label for="add-lastName">Nom</label>
              <input
                id="add-lastName"
                v-model="addForm.lastName"
                type="text"
                class="form-input"
                placeholder="Dupont"
                required
              />
            </div>
          </div>

          <div class="form-group">
            <label for="add-email">Adresse e-mail</label>
            <input
              id="add-email"
              v-model="addForm.email"
              type="email"
              class="form-input"
              placeholder="jean.dupont@example.com"
              required
            />
          </div>

          <div class="form-group">
            <label for="add-role">Rôle</label>
            <select id="add-role" v-model="addForm.role" class="form-input" required>
              <option value="">Sélectionner un rôle</option>
              <option value="EMPLOYE">Employé</option>
              <option value="GERANT">Gérant</option>
            </select>
          </div>

          <div class="form-group">
            <label for="add-password">Mot de passe temporaire</label>
            <input
              id="add-password"
              v-model="addForm.password"
              type="password"
              class="form-input"
              placeholder="Mot de passe temporaire"
              required
            />
            <span class="field-note">L'utilisateur devra changer ce mot de passe lors de sa première connexion</span>
          </div>

          <div class="modal-actions">
            <button type="button" class="cancel-btn" @click="closeAddModal">
              Annuler
            </button>
            <button type="submit" class="submit-btn primary">
              Créer Utilisateur
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Edit User Modal -->
    <div v-if="showEditModal" class="modal-backdrop" @click="closeEditModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h2>Modifier l'Utilisateur</h2>
          <button class="close-btn" @click="closeEditModal">
            <XMarkIcon class="w-5 h-5" />
          </button>
        </div>

        <form @submit.prevent="updateUser" class="modal-form">
          <div class="form-row">
            <div class="form-group">
              <label for="edit-firstName">Prénom</label>
              <input
                id="edit-firstName"
                v-model="editForm.firstName"
                type="text"
                class="form-input"
                required
              />
            </div>

            <div class="form-group">
              <label for="edit-lastName">Nom</label>
              <input
                id="edit-lastName"
                v-model="editForm.lastName"
                type="text"
                class="form-input"
                required
              />
            </div>
          </div>

          <div class="form-group">
            <label for="edit-email">Adresse e-mail</label>
            <input
              id="edit-email"
              :value="editForm.email"
              type="email"
              class="form-input disabled"
              disabled
              title="L'email ne peut pas être modifié"
            />
            <span class="field-note">L'email ne peut pas être modifié</span>
          </div>

          <div class="form-group">
            <label for="edit-role">Rôle</label>
            <select
              id="edit-role"
              v-model="editForm.role"
              class="form-input"
              :disabled="editForm.role === 'GERANT' && gerantCount <= 1"
              required
            >
              <option value="EMPLOYE">Employé</option>
              <option value="GERANT">Gérant</option>
            </select>
            <span v-if="editForm.role === 'GERANT' && gerantCount <= 1" class="field-note warning">
              Impossible de modifier le dernier gérant
            </span>
          </div>

          <div class="form-group">
            <label class="checkbox-label">
              <input
                type="checkbox"
                v-model="editForm.isActive"
                class="checkbox-input"
              />
              <span class="checkbox-text">Compte actif</span>
            </label>
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

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-backdrop" @click="closeDeleteModal">
      <div class="modal small" @click.stop>
        <div class="modal-header">
          <h2>Confirmer la suppression</h2>
          <button class="close-btn" @click="closeDeleteModal">
            <XMarkIcon class="w-5 h-5" />
          </button>
        </div>

        <div class="modal-content">
          <p>Êtes-vous sûr de vouloir supprimer l'utilisateur <strong>{{ userToDelete?.email }}</strong> ?</p>
          <p class="warning-text">Cette action est irréversible.</p>
        </div>

        <div class="modal-actions">
          <button type="button" class="cancel-btn" @click="closeDeleteModal">
            Annuler
          </button>
          <button type="button" class="submit-btn danger" @click="deleteUser">
            Supprimer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  UserPlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  ShieldCheckIcon,
  UserIcon
} from '@heroicons/vue/24/outline'

interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  role: 'GERANT' | 'EMPLOYE'
  isActive: boolean
  createdAt: string
}

const showAddModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const editingUser = ref<User | null>(null)
const userToDelete = ref<User | null>(null)
const roleFilter = ref('all')
const searchQuery = ref('')

// Sample users data
const users = ref<User[]>([
  {
    id: 1,
    email: 'admin@bevstock.com',
    firstName: 'Admin',
    lastName: 'Principal',
    role: 'GERANT',
    isActive: true,
    createdAt: '2025-01-15'
  },
  {
    id: 2,
    email: 'marie.martin@bevstock.com',
    firstName: 'Marie',
    lastName: 'Martin',
    role: 'EMPLOYE',
    isActive: true,
    createdAt: '2025-03-10'
  },
  {
    id: 3,
    email: 'pierre.durand@bevstock.com',
    firstName: 'Pierre',
    lastName: 'Durand',
    role: 'EMPLOYE',
    isActive: false,
    createdAt: '2025-02-20'
  }
])

// Forms
const addForm = ref({
  firstName: '',
  lastName: '',
  email: '',
  role: '',
  password: ''
})

const editForm = ref({
  firstName: '',
  lastName: '',
  email: '',
  role: 'EMPLOYE' as 'GERANT' | 'EMPLOYE',
  isActive: true
})

const filteredUsers = computed(() => {
  let filtered = users.value

  if (roleFilter.value !== 'all') {
    filtered = filtered.filter(user => user.role === roleFilter.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(user =>
      user.email.toLowerCase().includes(query) ||
      user.firstName.toLowerCase().includes(query) ||
      user.lastName.toLowerCase().includes(query)
    )
  }

  return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
})

const gerantCount = computed(() =>
  users.value.filter(user => user.role === 'GERANT').length
)

const openAddModal = () => {
  addForm.value = {
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    password: ''
  }
  showAddModal.value = true
}

const closeAddModal = () => {
  showAddModal.value = false
}

const openEditModal = (user: User) => {
  editingUser.value = user
  editForm.value = { ...user }
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  editingUser.value = null
}

const confirmDelete = (user: User) => {
  userToDelete.value = user
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  userToDelete.value = null
}

const addUser = () => {
  const newUser: User = {
    id: Date.now(),
    firstName: addForm.value.firstName,
    lastName: addForm.value.lastName,
    email: addForm.value.email,
    role: addForm.value.role as 'GERANT' | 'EMPLOYE',
    isActive: true,
    createdAt: new Date().toISOString().split('T')[0]
  }
  users.value.push(newUser)
  closeAddModal()
}

const updateUser = () => {
  if (editingUser.value) {
    const index = users.value.findIndex(u => u.id === editingUser.value!.id)
    if (index !== -1) {
      users.value[index] = { ...editForm.value, id: editingUser.value.id, email: editingUser.value.email }
    }
  }
  closeEditModal()
}

const deleteUser = () => {
  if (userToDelete.value) {
    const index = users.value.findIndex(u => u.id === userToDelete.value!.id)
    if (index !== -1) {
      users.value.splice(index, 1)
    }
  }
  closeDeleteModal()
}

const getRoleText = (role: string) => {
  switch (role) {
    case 'GERANT':
      return 'Gérant'
    case 'EMPLOYE':
      return 'Employé'
    default:
      return role
  }
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('fr-FR')
}
</script>

<style scoped>
.users-page {
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

.filter-select,
.search-input {
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
}

.search-input {
  flex: 1;
  max-width: 300px;
}

.search-input::placeholder {
  color: var(--color-text-muted);
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

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table th,
.users-table td {
  padding: var(--space-4);
  text-align: left;
  border-bottom: 1px solid var(--color-border-light);
}

.users-table th {
  background: var(--color-bg-secondary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.users-table td {
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
}

.user-info {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.user-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: var(--radius-full);
  background: var(--color-primary-500);
  color: var(--color-text-inverse);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  flex-shrink: 0;
}

.user-details {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.user-email {
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.user-meta {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

.role-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  text-transform: uppercase;
}

.role-badge.gerant {
  background: var(--color-primary-50);
  color: var(--color-primary-700);
}

.role-badge.employe {
  background: var(--color-secondary-100);
  color: var(--color-secondary-700);
}

.status-badge {
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  text-transform: uppercase;
}

.status-badge.active {
  background: var(--color-success-50);
  color: var(--color-success-700);
}

.status-badge.inactive {
  background: var(--color-error-50);
  color: var(--color-error-700);
}

.actions-cell {
  display: flex;
  gap: var(--space-2);
}

.edit-btn,
.delete-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.edit-btn {
  background: var(--color-bg-secondary);
  color: var(--color-text-secondary);
}

.edit-btn:hover {
  background: var(--color-primary-50);
  color: var(--color-primary-600);
}

.delete-btn {
  background: var(--color-error-50);
  color: var(--color-error-600);
}

.delete-btn:hover:not(:disabled) {
  background: var(--color-error-100);
  color: var(--color-error-700);
}

.delete-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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

.modal.small {
  max-width: 400px;
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

.modal-content {
  padding: var(--space-6);
}

.modal-content p {
  margin-bottom: var(--space-3);
  color: var(--color-text-primary);
}

.warning-text {
  color: var(--color-error-600);
  font-weight: var(--font-weight-medium);
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

.field-note.warning {
  color: var(--color-warning-600);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  cursor: pointer;
}

.checkbox-input {
  width: 1rem;
  height: 1rem;
  accent-color: var(--color-primary-500);
}

.checkbox-text {
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
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

.submit-btn.danger {
  background: var(--color-error-500);
  color: var(--color-text-inverse);
}

.submit-btn.danger:hover {
  background: var(--color-error-600);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: stretch;
  }

  .filters-container {
    flex-direction: column;
  }

  .search-input {
    max-width: none;
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

  .actions-cell {
    flex-direction: column;
    gap: var(--space-1);
  }
}
</style>
