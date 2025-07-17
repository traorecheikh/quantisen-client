<template>
  <nav class="app-header">
    <div class="header-content">
      <!-- Logo and Brand -->
      <div class="header-brand">
        <div class="brand-logo">
          <img src="/logo.png" alt="Boisson Stock Logo" width="32" height="32" />
        </div>

        <div class="brand-text">
          <h1 class="brand-title">QuantiSen</h1>
          <p class="brand-subtitle">Gestion des Stocks de Boissons</p>
        </div>
      </div>

      <!-- Navigation Actions -->
      <div class="header-actions">
        <button class="action-btn" @click="toggleSidebar" title="Menu">
          <Bars3Icon class="w-4 h-4" />
        </button>

        <!-- User Menu -->
        <div class="user-menu" v-if="user">
          <button class="user-button" @click="showUserMenu = !showUserMenu">
            <div class="user-avatar">
              {{ user.email?.charAt(0).toUpperCase() }}
            </div>
            <div class="user-info">
              <span class="user-name">{{ user.email }}</span>
              <span class="user-role">{{ getRoleText(user.role) }}</span>
            </div>
            <ChevronDownIcon class="w-3 h-3" />
          </button>

          <div v-if="showUserMenu" class="user-dropdown">
            <router-link to="/profile" class="dropdown-item">
              <UserIcon class="w-3 h-3" />
              Paramètres du profil
            </router-link>
            <button @click="logout" class="dropdown-item logout-btn">
              <ArrowRightOnRectangleIcon class="w-3 h-3" />
              Se déconnecter
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import {
  Bars3Icon,
  ChevronDownIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/vue/24/outline'

const router = useRouter()
const authStore = useAuthStore()
const showUserMenu = ref(false)

const user = authStore.user

const emit = defineEmits(['toggle-sidebar'])

const toggleSidebar = () => {
  emit('toggle-sidebar')
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

const logout = async () => {
  authStore.logout()
  await router.push('/login')
}
</script>

<style scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--layout-header-height);
  background: var(--color-bg-primary);
  border-bottom: 1px solid var(--color-border-light);
  z-index: 1000;
  box-shadow: var(--shadow-sm);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 var(--space-6);
  max-width: none;
}

.header-brand {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.brand-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.brand-text {
  display: flex;
  flex-direction: column;
}

.brand-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  line-height: var(--line-height-tight);
}

.brand-subtitle {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: var(--line-height-tight);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border: none;
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.action-btn:hover {
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
}

.user-menu {
  position: relative;
}

.user-button {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2) var(--space-3);
  border: none;
  border-radius: var(--radius-lg);
  background: transparent;
  color: var(--color-text-primary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.user-button:hover {
  background: var(--color-bg-secondary);
}

.user-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: var(--radius-full);
  background: var(--color-primary-500);
  color: var(--color-text-inverse);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 0;
}

.user-name {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
}

.user-role {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: var(--space-2);
  min-width: 200px;
  padding: var(--space-2);
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  z-index: 1001;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  width: 100%;
  padding: var(--space-3);
  border: none;
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  text-align: left;
  text-decoration: none;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.dropdown-item:hover {
  background: var(--color-bg-secondary);
}

.logout-btn {
  color: var(--color-error-600);
}

.logout-btn:hover {
  background: var(--color-error-50);
}

@media (max-width: 768px) {
  .header-content {
    padding: 0 var(--space-4);
  }

  .brand-text {
    display: none;
  }

  .user-info {
    display: none;
  }
}
</style>
