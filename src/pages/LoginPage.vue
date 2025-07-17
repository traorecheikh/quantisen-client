<template>
  <div class="login-page">
    <div class="login-container">
      <!-- Left Side - Branding -->
      <div class="login-brand">
        <div class="brand-content">
          <div class="brand-logo">
            <svg
              width="64"
              height="64"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="64" height="64" rx="16" fill="var(--color-primary-600)" />
              <path d="M16 24h32v24a4 4 0 0 1-4 4H20a4 4 0 0 1-4-4V24z" fill="white" />
              <path d="M24 16h16v8H24z" fill="var(--color-primary-200)" />
            </svg>
          </div>
          <h1 class="brand-title">QuantiSen</h1>
          <p class="brand-subtitle">Gestion Professionnelle des Stocks de Boissons</p>

          <div class="features-list">
            <div class="feature-item">
              <CheckCircleIcon class="w-3 h-3" />
              <span>Suivi des stocks en temps réel</span>
            </div>
            <div class="feature-item">
              <CheckCircleIcon class="w-3 h-3" />
              <span>Gestion des lots et dates d'expiration</span>
            </div>
            <div class="feature-item">
              <CheckCircleIcon class="w-3 h-3" />
              <span>Rapports et analyses avancés</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Side - Login Form -->
      <div class="login-form-section">
        <div class="form-container">
          <div class="form-header">
            <h2 class="form-title">Bon retour</h2>
            <p class="form-subtitle">Connectez-vous pour accéder à votre tableau de bord</p>
          </div>

          <form class="login-form" @submit.prevent="handleLogin">
            <div class="form-group">
              <label for="email" class="form-label">Adresse e-mail</label>
              <div class="input-container">
                <input
                  id="email"
                  v-model="loginForm.email"
                  type="email"
                  class="form-input"
                  placeholder="Entrez votre e-mail"
                  required
                />
                <EnvelopeIcon class="input-icon w-5 h-5" />
              </div>
            </div>

            <div class="form-group">
              <label for="password" class="form-label">Mot de passe</label>
              <div class="input-container">
                <input
                  id="password"
                  v-model="loginForm.password"
                  :type="showPassword ? 'text' : 'password'"
                  class="form-input"
                  placeholder="Entrez votre mot de passe"
                  required
                />
                <button type="button" class="password-toggle" @click="showPassword = !showPassword">
                  <EyeIcon v-if="!showPassword" class="w-5 h-5" />
                  <EyeSlashIcon v-else class="w-5 h-5" />
                </button>
              </div>
            </div>

            <div class="form-actions">
              <button type="submit" class="login-btn" :disabled="isLoading">
                <ArrowPathIcon v-if="isLoading" class="loading-spinner w-5 h-5" />
                <span v-if="!isLoading">Se connecter</span>
                <span v-else>Connexion...</span>
              </button>
            </div>
          </form>

          <!-- Error Message -->
          <div v-if="errorMessage" class="error-message">
            <ExclamationTriangleIcon class="w-5 h-5" />
            {{ errorMessage }}
          </div>

          <div class="form-footer">
            <p class="help-text">
              Besoin d'un accès ? Contactez votre administrateur système pour obtenir vos
              identifiants de connexion.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import {
  CheckCircleIcon,
  EnvelopeIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
} from '@heroicons/vue/24/outline'

const router = useRouter()
const authStore = useAuthStore()

const loginForm = ref({
  email: '',
  password: '',
})

const showPassword = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const result = await authStore.login({
      email: loginForm.value.email,
      motDePasse: loginForm.value.password,
    })

    if (result.success) {
      if (result.requiresPasswordChange) {
        await router.push('/password-change')
      } else {
        await router.push('/dashboard')
      }
    } else {
      errorMessage.value = authStore.error || 'Échec de la connexion'
    }
  } catch (error) {
    errorMessage.value = "Une erreur inattendue s'est produite"
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-secondary);
  padding: var(--space-4);
}

.login-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: 1000px;
  width: 100%;
  background: var(--color-bg-primary);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-2xl);
  overflow: hidden;
  min-height: 600px;
}

.login-brand {
  background: linear-gradient(135deg, var(--color-primary-600) 0%, var(--color-primary-800) 100%);
  color: var(--color-text-inverse);
  padding: var(--space-12);
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
}

.login-brand::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/><circle cx="90" cy="40" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  opacity: 0.1;
}

.brand-content {
  position: relative;
  z-index: 1;
}

.brand-logo {
  margin-bottom: var(--space-6);
}

.brand-title {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--space-3);
}

.brand-subtitle {
  font-size: var(--font-size-lg);
  opacity: 0.9;
  margin-bottom: var(--space-8);
  line-height: var(--line-height-relaxed);
}

.features-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.feature-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-size: var(--font-size-base);
  opacity: 0.95;
}

.login-form-section {
  padding: var(--space-12);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.form-container {
  max-width: 400px;
  width: 100%;
  margin: 0 auto;
}

.form-header {
  text-align: center;
  margin-bottom: var(--space-8);
}

.form-title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-2);
}

.form-subtitle {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.form-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.input-container {
  position: relative;
}

.form-input {
  width: 100%;
  padding: var(--space-4) var(--space-12) var(--space-4) var(--space-4);
  border: 2px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  font-size: var(--font-size-base);
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
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

.input-icon {
  position: absolute;
  right: var(--space-4);
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-muted);
  pointer-events: none;
}

.password-toggle {
  position: absolute;
  right: var(--space-4);
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--color-text-muted);
  cursor: pointer;
  padding: var(--space-1);
  border-radius: var(--radius-base);
  transition: all var(--transition-fast);
}

.password-toggle:hover {
  color: var(--color-text-secondary);
  background: var(--color-bg-secondary);
}

.form-actions {
  margin-top: var(--space-2);
}

.login-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-4);
  background: var(--color-primary-500);
  color: var(--color-text-inverse);
  border: none;
  border-radius: var(--radius-lg);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.login-btn:hover:not(:disabled) {
  background: var(--color-primary-600);
  transform: translateY(-1px);
  box-shadow: var(--shadow-lg);
}

.login-btn:disabled {
  opacity: 0.7;
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
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  background: var(--color-error-50);
  color: var(--color-error-700);
  border: 1px solid var(--color-error-200);
  border-radius: var(--radius-lg);
  font-size: var(--font-size-sm);
  margin-top: var(--space-4);
}

.form-footer {
  margin-top: var(--space-8);
  text-align: center;
}

.help-text {
  font-size: var(--font-size-sm);
  color: var(--color-text-tertiary);
  line-height: var(--line-height-relaxed);
}

@media (max-width: 768px) {
  .login-container {
    grid-template-columns: 1fr;
    max-width: 400px;
  }

  .login-brand {
    padding: var(--space-8);
    text-align: center;
  }

  .brand-title {
    font-size: var(--font-size-2xl);
  }

  .login-form-section {
    padding: var(--space-8);
  }

  .form-title {
    font-size: var(--font-size-2xl);
  }
}
</style>
