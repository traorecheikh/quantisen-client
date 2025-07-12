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
          <option value="all">
            <UserIcon class="w-4 h-4 inline mr-1" /> Tous les rôles
          </option>
          <option value="GERANT">
            <ShieldCheckIcon class="w-4 h-4 inline mr-1" /> Gérants uniquement
          </option>
          <option value="EMPLOYE">
            <UserIcon class="w-4 h-4 inline mr-1" /> Employés uniquement
          </option>
          <option value="LIVREUR">
            <UserIcon class="w-4 h-4 inline mr-1" /> Livreurs uniquement
          </option>
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
          <tbody v-if="filteredUsers.length > 0">
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
                  :disabled="user.role === 'GERANT'"
                  @click="toggleActive(user)"
                  :title="user.isActive ? 'Désactiver' : 'Activer'"
                >
                  <template v-if="user.role !== 'GERANT'">
                    <span v-if="user.isActive">
                      <!-- Ban icon (Heroicons outline) for active user -->
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636A9 9 0 105.636 18.364 9 9 0 0018.364 5.636z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6.343 6.343l11.314 11.314" />
                      </svg>
                    </span>
                    <span v-else>
                      <!-- Check circle icon (Heroicons outline) for inactive user -->
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4" />
                        <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" fill="none" />
                      </svg>
                    </span>
                  </template>
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
          <tbody v-else>
            <tr>
              <td colspan="5" class="empty-state-cell">
                <div class="empty-state">
                  <div class="empty-state-icon">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 4V3C15 2.4 14.6 2 14 2H10C9.4 2 9 2.4 9 3V4L3 7V9H4L5 15H7L6 9H9V15C9 15.6 9.4 16 10 16H14C14.6 16 15 15.6 15 15V9H18L17 15H19L20 9H21ZM11 10V14H13V10H11Z" fill="currentColor"/>
                    </svg>
                  </div>
                  <div class="empty-state-content">
                    <h3 class="empty-state-title">{{ emptyStateContent.title }}</h3>
                    <p class="empty-state-description">
                      {{ emptyStateContent.description }}
                    </p>
                    <button
                      v-if="emptyStateContent.showButton"
                      class="empty-state-button"
                      @click="openAddModalWithRole"
                    >
                      <UserPlusIcon class="w-5 h-5" />
                      {{ emptyStateContent.buttonText }}
                    </button>
                  </div>
                </div>
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
import { ref, computed, onMounted } from 'vue'
import {
  UserPlusIcon,
  TrashIcon,
  XMarkIcon,
  ShieldCheckIcon,
  UserIcon,
  PowerIcon
} from '@heroicons/vue/24/outline'
import {type User, UserService} from "../api";
import {UserRole} from "../api/enums/userRole.ts";
import {POSITION, useToast} from 'vue-toastification'

const showAddModal = ref(false)
const showDeleteModal = ref(false)
const userToDelete = ref<User | null>(null)
const roleFilter = ref('all')
const searchQuery = ref('')

const users = ref<User[]>([])

onMounted(async () => {
  users.value = await UserService.getAllUsers()
})

// Forms
const addForm = ref({
  firstName: '',
  lastName: '',
  email: '',
  role: UserRole.EMPLOYE as UserRole,
  password: ''
})

const filteredUsers = computed(() => {
  let filtered = users.value;

  if (roleFilter.value !== 'all') {
    filtered = filtered.filter(user => user.role === roleFilter.value);
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(user =>
      user.email.toLowerCase().includes(query)
    );
  }

  return filtered.sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA;
  });
})

// Dynamic empty state messages
const emptyStateContent = computed(() => {
  if (searchQuery.value) {
    // When searching by email
    return {
      title: 'Aucun utilisateur trouvé',
      description: `Aucun utilisateur ne correspond à la recherche "${searchQuery.value}". Essayez avec un autre email.`,
      buttonText: 'Ajouter un utilisateur',
      showButton: true
    }
  } else if (roleFilter.value !== 'all') {
    // When filtering by role
    const roleText = getRoleText(roleFilter.value);
    return {
      title: `Aucun ${roleText.toLowerCase()} trouvé`,
      description: `Vous n'avez pas encore d'utilisateur avec le rôle "${roleText}". Ajoutez votre premier ${roleText.toLowerCase()} pour commencer.`,
      buttonText: `Ajouter un ${roleText.toLowerCase()}`,
      showButton: true
    }
  } else {
    // When no filters are applied
    return {
      title: 'Aucun utilisateur trouvé',
      description: 'Commencez à construire votre équipe en ajoutant votre premier utilisateur. Vous pourrez gérer leurs rôles et permissions facilement.',
      buttonText: 'Ajouter votre premier utilisateur',
      showButton: true
    }
  }
})

// Function to open modal with pre-selected role if filtering
const openAddModalWithRole = () => {
  addForm.value = {
    firstName: '',
    lastName: '',
    email: '',
    role: roleFilter.value !== 'all' ? roleFilter.value as UserRole : UserRole.EMPLOYE,
    password: ''
  }
  showAddModal.value = true
}

const gerantCount = computed(() =>
  users.value.filter(user => user.role === UserRole.GERANT).length
)

const toast = useToast()

const openAddModal = () => {
  addForm.value = {
    firstName: '',
    lastName: '',
    email: '',
    role: UserRole.EMPLOYE,
    password: ''
  }
  showAddModal.value = true
}

const closeAddModal = () => {
  showAddModal.value = false
}

const confirmDelete = (user: User) => {
  userToDelete.value = user
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  userToDelete.value = null
}

const addUser = async () => {
  try {
    const newUser = await UserService.createUser({
      email: addForm.value.email,
      motDePasse: addForm.value.password,
      role: addForm.value.role,
    })
    users.value.push(newUser)
    toast.success('Utilisateur ajouté avec succès !', {
      timeout: 2000,
      position: POSITION.BOTTOM_RIGHT,
    })
    closeAddModal()
  } catch (error) {
    // Error toast is shown globally
  }
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

const toggleActive = async (user: User) => {
  if (user.role === UserRole.GERANT) return;
  try {
    await UserService.changeStatus(user.id, !user.isActive);

    user.isActive = !user.isActive;

    toast.success(
      user.isActive ? 'Utilisateur activé avec succès !' : 'Utilisateur bloqué avec succès !',
      { timeout: 2000, position: POSITION.BOTTOM_RIGHT }
    );
  } catch (error) {
    toast.error(
      'Erreur lors de la modification du statut de l\'utilisateur',
      { timeout: 2000, position: POSITION.BOTTOM_RIGHT }
    );
  }
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

const formatDate = (dateStr?: string) => {
  if (!dateStr) return ''
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
  min-height: 100px;
  align-items: center;
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
:root {
  --color-error-100: #fee2e2;
  --color-error-700: #b91c1c;
}


.delete-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Empty State Styles */
.empty-state-cell {
  padding: var(--space-12) var(--space-6);
  text-align: center;
  border-bottom: none;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-6);
  max-width: 400px;
  margin: 0 auto;
}

.empty-state-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
  border-radius: var(--radius-full);
  background: linear-gradient(135deg, var(--color-primary-50) 0%, var(--color-primary-100) 100%);
  color: var(--color-primary-500);
  margin-bottom: var(--space-2);
  transition: all var(--transition-fast);
}

.empty-state-icon:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.empty-state-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
}

.empty-state-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0;
  line-height: 1.2;
}

.empty-state-description {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin: 0;
  text-align: center;
  max-width: 320px;
}

.empty-state-button {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-4) var(--space-6);
  border: none;
  border-radius: var(--radius-lg);
  background: var(--color-primary-500);
  color: var(--color-text-inverse);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: all var(--transition-fast);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.empty-state-button:hover {
  background: var(--color-primary-600);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.empty-state-button:active {
  transform: translateY(0);
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
