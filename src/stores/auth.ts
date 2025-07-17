import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { UtilisateurService } from '../api'
import type { LoginRequest, LoginResponse, Utilisateur } from '../api'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'))
  const user = ref<Utilisateur | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    try {
      user.value = JSON.parse(storedUser)
    } catch (e) {
      localStorage.removeItem('user')
    }
  }

  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isFirstLogin = computed(() => user.value?.isFirstLogin || false)
  const isActive = computed(() => user.value?.isActive || false)

  const login = async (
    credentials: LoginRequest
  ): Promise<{ success: boolean; requiresPasswordChange: boolean }> => {
    isLoading.value = true
    error.value = null

    try {
      const response: LoginResponse = await UtilisateurService.login(credentials)
      console.log(response.utilisateur)
      if (!response.utilisateur.isActive) {
        error.value = "Votre compte est désactivé. Contactez l'administrateur."
        return { success: false, requiresPasswordChange: false }
      }

      token.value = response.token
      user.value = response.utilisateur

      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(response.utilisateur))

      return {
        success: true,
        requiresPasswordChange: response.utilisateur.isFirstLogin,
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur de connexion. Vérifiez vos identifiants.'
      return { success: false, requiresPasswordChange: false }
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const updateUserAfterPasswordChange = () => {
    if (user.value) {
      user.value.isFirstLogin = false
      localStorage.setItem('user', JSON.stringify(user.value))
    }
  }

  return {
    token,
    user,
    isLoading,
    error,
    isAuthenticated,
    isFirstLogin,
    isActive,
    login,
    logout,
    updateUserAfterPasswordChange,
  }
})
