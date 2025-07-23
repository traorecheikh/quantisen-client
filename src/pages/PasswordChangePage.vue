<template>
  <div class="password-change-page">
    <div class="password-change-container">
      <!-- Header -->
      <div class="header-section">
        <div class="brand-logo">
          <svg
            width="48"
            height="48"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="64" height="64" rx="16" fill="var(--color-primary-600)" />
            <path d="M16 24h32v24a4 4 0 0 1-4 4H20a4 4 0 0 1-4-4V24z" fill="white" />
            <path d="M24 16h16v8H24z" fill="var(--color-primary-200)" />
          </svg>
        </div>
        <h1 class="welcome-title">Bienvenue dans la team QuantiSen, {{useAuthStore().user?.firstName}} {{useAuthStore().user?.lastName}} !</h1>
        <p class="welcome-subtitle">Changez votre mot de passe pour continuer</p>
      </div>

      <!-- Form Section -->
      <div class="form-section">
        <div class="form-container">
          <div class="form-header">
            <h2 class="form-title">Changement de mot de passe requis</h2>
            <p class="form-subtitle">
              Pour votre sécurité, veuillez changer votre mot de passe temporaire
            </p>
          </div>

          <form class="password-form" @submit.prevent="handlePasswordChange">
            <div class="form-group">
              <label for="current-password" class="form-label">Mot de passe actuel</label>
              <div class="input-container">
                <input
                  id="current-password"
                  v-model="passwordForm.ancienMotDePasse"
                  :type="showCurrentPassword ? 'text' : 'password'"
                  class="form-input"
                  placeholder="Entrez votre mot de passe actuel"
                  required
                />
                <button
                  type="button"
                  class="password-toggle"
                  @click="showCurrentPassword = !showCurrentPassword"
                >
                  <EyeIcon v-if="!showCurrentPassword" class="w-5 h-5" />
                  <EyeSlashIcon v-else class="w-5 h-5" />
                </button>
              </div>
            </div>

            <div class="form-group">
              <label for="new-password" class="form-label">Nouveau mot de passe</label>
              <div class="input-container">
                <input
                  id="new-password"
                  v-model="passwordForm.nouveauMotDePasse"
                  :type="showNewPassword ? 'text' : 'password'"
                  class="form-input"
                  placeholder="Entrez votre nouveau mot de passe"
                  required
                />
                <button
                  type="button"
                  class="password-toggle"
                  @click="showNewPassword = !showNewPassword"
                >
                  <EyeIcon v-if="!showNewPassword" class="w-5 h-5" />
                  <EyeSlashIcon v-else class="w-5 h-5" />
                </button>
              </div>
            </div>

            <div class="form-group">
              <label for="confirm-password" class="form-label"
                >Confirmer le nouveau mot de passe</label
              >
              <div class="input-container">
                <input
                  id="confirm-password"
                  v-model="confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  class="form-input"
                  placeholder="Confirmez votre nouveau mot de passe"
                  required
                />
                <button
                  type="button"
                  class="password-toggle"
                  @click="showConfirmPassword = !showConfirmPassword"
                >
                  <EyeIcon v-if="!showConfirmPassword" class="w-5 h-5" />
                  <EyeSlashIcon v-else class="w-5 h-5" />
                </button>
              </div>
            </div>

            <!-- Password Requirements -->
            <div class="password-requirements">
              <h4>Votre mot de passe doit contenir :</h4>
              <ul class="requirements-list">
                <li :class="{ valid: hasMinLength }">
                  <CheckCircleIcon v-if="hasMinLength" class="w-4 h-4 text-green-500" />
                  <XCircleIcon v-else class="w-4 h-4 text-gray-400" />
                  Au moins 8 caractères
                </li>
                <li :class="{ valid: hasUpperCase }">
                  <CheckCircleIcon v-if="hasUpperCase" class="w-4 h-4 text-green-500" />
                  <XCircleIcon v-else class="w-4 h-4 text-gray-400" />
                  Une lettre majuscule
                </li>
                <li :class="{ valid: hasLowerCase }">
                  <CheckCircleIcon v-if="hasLowerCase" class="w-4 h-4 text-green-500" />
                  <XCircleIcon v-else class="w-4 h-4 text-gray-400" />
                  Une lettre minuscule
                </li>
                <li :class="{ valid: hasNumber }">
                  <CheckCircleIcon v-if="hasNumber" class="w-4 h-4 text-green-500" />
                  <XCircleIcon v-else class="w-4 h-4 text-gray-400" />
                  Un chiffre
                </li>
              </ul>
            </div>

            <div class="form-actions">
              <button
                type="submit"
                class="change-password-btn"
                :disabled="isLoading || !isFormValid"
              >
                <ArrowPathIcon v-if="isLoading" class="loading-spinner w-5 h-5" />
                <span v-if="!isLoading">Changer le mot de passe</span>
                <span v-else>Changement en cours...</span>
              </button>
            </div>
          </form>

          <!-- Error Message -->
          <div v-if="errorMessage" class="error-message">
            <ExclamationTriangleIcon class="w-5 h-5" />
            {{ errorMessage }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { UtilisateurService } from '../api/features/utilisateurs/services/utilisateurService'
import {
  EyeIcon,
  EyeSlashIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/vue/24/outline'

const router = useRouter()
const authStore = useAuthStore()

const passwordForm = ref({
  ancienMotDePasse: '',
  nouveauMotDePasse: '',
})

const confirmPassword = ref('')
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')

// Password validation
const hasMinLength = computed(() => passwordForm.value.nouveauMotDePasse.length >= 8)
const hasUpperCase = computed(() => /[A-Z]/.test(passwordForm.value.nouveauMotDePasse))
const hasLowerCase = computed(() => /[a-z]/.test(passwordForm.value.nouveauMotDePasse))
const hasNumber = computed(() => /\d/.test(passwordForm.value.nouveauMotDePasse))
const passwordsMatch = computed(
  () => passwordForm.value.nouveauMotDePasse === confirmPassword.value
)

const isFormValid = computed(() => {
  return (
    hasMinLength.value &&
    hasUpperCase.value &&
    hasLowerCase.value &&
    hasNumber.value &&
    passwordsMatch.value &&
    passwordForm.value.ancienMotDePasse.length > 0
  )
})

const handlePasswordChange = async () => {
  if (!isFormValid.value) {
    errorMessage.value = 'Veuillez remplir tous les champs correctement'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    await UtilisateurService.changePassword(authStore.user!.id, passwordForm.value)
    authStore.updateUserAfterPasswordChange()
    await router.push('/dashboard')
  } catch (error: any) {
    errorMessage.value =
      error.response?.data?.message || 'Erreur lors du changement de mot de passe'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.password-change-page {
  min-height: 100vh;
  display: block;
  grid-template-columns: 1fr 1fr;
  background: var(--color-bg-secondary);
}

.header-section {
  background: linear-gradient(135deg, var(--color-primary-600) 0%, var(--color-primary-800) 100%);
  color: white;
  padding: var(--space-12);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.brand-logo {
  margin-bottom: var(--space-6);
}

.welcome-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: var(--space-4);
}

.welcome-subtitle {
  font-size: 1.125rem;
  opacity: 0.9;
}

.form-section {
  padding: var(--space-12);
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: var(--color-bg-primary);
}

.form-container {
  max-width: 500px;
  width: 100%;
  margin: 0 auto;
}

.form-header {
  text-align: center;
  margin-bottom: var(--space-8);
}

.form-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: var(--space-2);
  color: var(--color-text-primary);
}

.form-subtitle {
  color: var(--color-text-secondary);
}

.password-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-weight: 500;
  margin-bottom: var(--space-2);
  color: var(--color-text-primary);
}

.input-container {
  position: relative;
}

.form-input {
  width: 100%;
  padding: var(--space-3);
  padding-right: var(--space-10);
  border: 1px solid var(--color-border-secondary);
  border-radius: var(--radius-md);
  font-size: 1rem;
  transition: border-color var(--transition-base);
}

.form-input:focus {
  outline: none;
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 3px var(--color-primary-100);
}

.password-toggle {
  position: absolute;
  right: var(--space-3);
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: var(--space-1);
}

.password-requirements {
  background: var(--color-bg-secondary);
  padding: var(--space-4);
  border-radius: var(--radius-md);
  margin-top: var(--space-4);
}

.password-requirements h4 {
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: var(--space-2);
  color: var(--color-text-primary);
}

.requirements-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.requirements-list li {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

.requirements-list li.valid {
  color: var(--color-success-600);
}

.change-password-btn {
  width: 100%;
  padding: var(--space-3);
  background: var(--color-primary-600);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-weight: 500;
  cursor: pointer;
  transition: background-color var(--transition-base);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
}

.change-password-btn:hover:not(:disabled) {
  background: var(--color-primary-700);
}

.change-password-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.error-message {
  background: var(--color-error-50);
  border: 1px solid var(--color-error-200);
  color: var(--color-error-600);
  padding: var(--space-3);
  border-radius: var(--radius-md);
  margin-top: var(--space-4);
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.onboarding-section {
  grid-column: 1 / -1;
  background: var(--color-bg-primary);
  padding: var(--space-16) var(--space-12);
  border-top: 1px solid var(--color-border-secondary);
}

.onboarding-container {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.onboarding-title {
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: var(--space-8);
  color: var(--color-text-primary);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-6);
}

.feature-card {
  background: var(--color-bg-secondary);
  padding: var(--space-6);
  border-radius: var(--radius-lg);
  text-align: center;
}

.feature-icon {
  width: 3rem;
  height: 3rem;
  background: var(--color-primary-100);
  color: var(--color-primary-600);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--space-4);
}

.feature-card h4 {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: var(--space-2);
  color: var(--color-text-primary);
}

.feature-card p {
  color: var(--color-text-secondary);
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .password-change-page {
    grid-template-columns: 1fr;
  }

  .header-section {
    padding: var(--space-8);
  }

  .form-section {
    padding: var(--space-8);
  }
}
</style>
