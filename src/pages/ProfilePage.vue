<template>
  <div class="profile-page">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-text">
          <h1 class="page-title">Profil & Paramètres</h1>
          <p class="page-subtitle">Gérer votre compte et vos préférences</p>
        </div>
        <div class="header-actions">
          <button
            class="action-btn secondary"
            @click="logout"
          >
            <ArrowRightOnRectangleIcon class="w-4 h-4" />
            Déconnexion
          </button>
        </div>
      </div>
    </div>

    <!-- Profile Information -->
    <div class="profile-section">
      <div class="profile-container">
        <div class="profile-header">
          <div class="profile-avatar">
            {{ currentUser?.email?.charAt(0)?.toUpperCase() }}
          </div>
          <div class="profile-info">
            <h2 class="profile-name">{{ currentUser?.firstName }} {{ currentUser?.lastName }}</h2>
            <p class="profile-email">{{ currentUser?.email }}</p>
            <span class="profile-role" :class="currentUser?.role?.toLowerCase()">
              <ShieldCheckIcon v-if="currentUser?.role === 'GERANT'" class="w-3 h-3" />
              <UserIcon v-else class="w-3 h-3" />
              {{ getRoleText(currentUser?.role) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Change Password Section -->
    <div class="settings-section">
      <div class="settings-container">
        <div class="settings-header">
          <h3 class="settings-title">Modifier le mot de passe</h3>
          <p class="settings-subtitle">Changez votre mot de passe pour sécuriser votre compte</p>
        </div>

        <form @submit.prevent="changePassword" class="password-form">
          <div class="form-group">
            <label for="current-password">Mot de passe actuel</label>
            <input
              id="current-password"
              v-model="passwordForm.currentPassword"
              type="password"
              class="form-input"
              placeholder="Entrez votre mot de passe actuel"
              required
            />
          </div>

          <div class="form-group">
            <label for="new-password">Nouveau mot de passe</label>
            <input
              id="new-password"
              v-model="passwordForm.newPassword"
              type="password"
              class="form-input"
              placeholder="Entrez votre nouveau mot de passe"
              required
            />
          </div>

          <div class="form-group">
            <label for="confirm-password">Confirmer le nouveau mot de passe</label>
            <input
              id="confirm-password"
              v-model="passwordForm.confirmPassword"
              type="password"
              class="form-input"
              placeholder="Confirmez votre nouveau mot de passe"
              required
            />
          </div>

          <div class="form-actions">
            <button type="submit" class="submit-btn primary">
              <KeyIcon class="w-4 h-4" />
              Modifier le mot de passe
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  ArrowRightOnRectangleIcon,
  KeyIcon,
  ShieldCheckIcon,
  UserIcon
} from '@heroicons/vue/24/outline'
import { type User, UserService } from "../api"
import { POSITION, useToast } from 'vue-toastification'

const router = useRouter()
const toast = useToast()

const currentUser = ref<User | null>(null)
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

onMounted(async () => {
  // Get current user info from localStorage or API
  const storedUser = localStorage.getItem('currentUser')
  if (storedUser) {
    currentUser.value = JSON.parse(storedUser)
  }
})

const getRoleText = (role: string | undefined) => {
  switch (role) {
    case 'GERANT':
      return 'Gérant'
    case 'EMPLOYE':
      return 'Employé'
    case 'LIVREUR':
      return 'Livreur'
    default:
      return role
  }
}

const changePassword = async () => {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    toast.error('Les mots de passe ne correspondent pas', {
      timeout: 3000,
      position: POSITION.BOTTOM_RIGHT
    })
    return
  }

  if (passwordForm.value.newPassword.length < 6) {
    toast.error('Le mot de passe doit contenir au moins 6 caractères', {
      timeout: 3000,
      position: POSITION.BOTTOM_RIGHT
    })
    return
  }

  try {
    if (currentUser.value?.id) {
      await UserService.changePassword(currentUser.value.id, {
        currentPassword: passwordForm.value.currentPassword,
        newPassword: passwordForm.value.newPassword
      })

      toast.success('Mot de passe modifié avec succès !', {
        timeout: 3000,
        position: POSITION.BOTTOM_RIGHT
      })

      // Clear form
      passwordForm.value = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
    }
  } catch (error) {
    toast.error('Erreur lors de la modification du mot de passe', {
      timeout: 3000,
      position: POSITION.BOTTOM_RIGHT
    })
  }
}

const logout = () => {
  localStorage.removeItem('authToken')
  localStorage.removeItem('currentUser')
  router.push('/login')
  toast.success('Déconnexion réussie', {
    timeout: 2000,
    position: POSITION.BOTTOM_RIGHT
  })
}
</script>

<style scoped>
.profile-page {
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

.action-btn.secondary {
  background: var(--color-bg-secondary);
  color: var(--color-text-secondary);
}

.action-btn.secondary:hover {
  background: var(--color-bg-tertiary);
  color: var(--color-text-primary);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.profile-section {
  background: var(--color-bg-primary);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  box-shadow: var(--shadow-sm);
}

.profile-container {
  max-width: 600px;
  margin: 0 auto;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.profile-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 4rem;
  border-radius: var(--radius-full);
  background: var(--color-primary-500);
  color: var(--color-text-inverse);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  flex-shrink: 0;
}

.profile-info {
  flex: 1;
}

.profile-name {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-1);
}

.profile-email {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-2);
}

.profile-role {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  text-transform: uppercase;
}

.profile-role.gerant {
  background: var(--color-primary-50);
  color: var(--color-primary-700);
}

.profile-role.employe {
  background: var(--color-secondary-100);
  color: var(--color-secondary-700);
}

.profile-role.livreur {
  background: var(--color-info-100);
  color: var(--color-info-700);
}

.settings-section {
  background: var(--color-bg-primary);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  box-shadow: var(--shadow-sm);
}

.settings-container {
  max-width: 600px;
  margin: 0 auto;
}

.settings-header {
  margin-bottom: var(--space-6);
}

.settings-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-2);
}

.settings-subtitle {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
}

.password-form {
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

.form-input::placeholder {
  color: var(--color-text-muted);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-border-light);
}

.submit-btn {
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

  .profile-header {
    flex-direction: column;
    text-align: center;
  }

  .form-actions {
    justify-content: stretch;
  }

  .submit-btn {
    justify-content: center;
  }
}
</style>
