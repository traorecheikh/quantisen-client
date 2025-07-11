<template>
  <nav class="app-header">
    <div class="header-content">
      <!-- Logo and Brand -->
      <div class="header-brand">
        <div class="brand-logo">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="8" fill="var(--color-primary-600)"/>
            <path d="M8 12h16v12a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V12z" fill="white"/>
            <path d="M12 8h8v4H12z" fill="var(--color-primary-200)"/>
          </svg>
        </div>
        <div class="brand-text">
          <h1 class="brand-title">BevStock</h1>
          <p class="brand-subtitle">Inventory Management</p>
        </div>
      </div>

      <!-- Navigation Actions -->
      <div class="header-actions">
        <button class="action-btn" @click="toggleSidebar">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M3 5h14a1 1 0 110 2H3a1 1 0 110-2zm0 4h14a1 1 0 110 2H3a1 1 0 110-2zm0 4h14a1 1 0 110 2H3a1 1 0 110-2z"/>
          </svg>
        </button>

        <!-- User Menu -->
        <div class="user-menu" v-if="user">
          <button class="user-button" @click="showUserMenu = !showUserMenu">
            <div class="user-avatar">
              {{ user.email?.charAt(0).toUpperCase() }}
            </div>
            <div class="user-info">
              <span class="user-name">{{ user.email }}</span>
              <span class="user-role">{{ user.role }}</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M4.427 9.573l3.396-3.396a.25.25 0 01.354 0l3.396 3.396a.25.25 0 01-.177.427H4.604a.25.25 0 01-.177-.427z"/>
            </svg>
          </button>

          <div v-if="showUserMenu" class="user-dropdown">
            <router-link to="/profile" class="dropdown-item">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 8a3 3 0 100-6 3 3 0 000 6zM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 00-11.215 0c-.22.578.254 1.139.872 1.139h9.471z"/>
              </svg>
              Profile Settings
            </router-link>
            <button @click="logout" class="dropdown-item logout-btn">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M3 2a1 1 0 011-1h8a1 1 0 011 1v2H3V2zM3 6h10v6a2 2 0 01-2 2H5a2 2 0 01-2-2V6z"/>
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
// import { useAuthStore } from '@/stores/auth'

const showUserMenu = ref(false)
// const authStore = useAuthStore()

// Temporary mock user - replace with actual auth store
const user = ref({
  email: 'admin@bevstock.com',
  role: 'GERANT'
})

const emit = defineEmits(['toggle-sidebar'])

const toggleSidebar = () => {
  emit('toggle-sidebar')
}

const logout = () => {
  // authStore.logout()
  console.log('Logout clicked')
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
