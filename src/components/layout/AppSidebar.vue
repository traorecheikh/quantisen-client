<template>
  <aside class="app-sidebar" :class="{ 'collapsed': isCollapsed }">
    <div class="sidebar-content">
      <!-- Navigation Menu -->
      <nav class="sidebar-nav">
        <div class="nav-section">
          <h3 class="nav-section-title">Overview</h3>
          <ul class="nav-list">
            <li class="nav-item">
              <router-link to="/dashboard" class="nav-link" active-class="active">
                <svg class="nav-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
                </svg>
                <span class="nav-text">Dashboard</span>
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/stocks" class="nav-link" active-class="active">
                <svg class="nav-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                  <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-3a2 2 0 100 4h3v2a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"/>
                </svg>
                <span class="nav-text">Stock Overview</span>
              </router-link>
            </li>
          </ul>
        </div>

        <div class="nav-section">
          <h3 class="nav-section-title">Inventory</h3>
          <ul class="nav-list">
            <li class="nav-item">
              <router-link to="/beverages" class="nav-link" active-class="active">
                <svg class="nav-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                </svg>
                <span class="nav-text">Beverages</span>
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/lots" class="nav-link" active-class="active">
                <svg class="nav-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v7h-2l-1-2H8l-1 2H5V5z"/>
                </svg>
                <span class="nav-text">Lots & Batches</span>
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/movements" class="nav-link" active-class="active">
                <svg class="nav-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935L11.033 2.744A1 1 0 0112 2z"/>
                </svg>
                <span class="nav-text">Stock Movements</span>
              </router-link>
            </li>
          </ul>
        </div>

        <div class="nav-section" v-if="isGerant">
          <h3 class="nav-section-title">Administration</h3>
          <ul class="nav-list">
            <li class="nav-item">
              <router-link to="/users" class="nav-link" active-class="active">
                <svg class="nav-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                </svg>
                <span class="nav-text">User Management</span>
              </router-link>
            </li>
          </ul>
        </div>
      </nav>
    </div>

    <!-- Sidebar Footer -->
    <div class="sidebar-footer">
      <div class="footer-content">
        <div class="app-version">
          <span class="version-text">v1.0.0</span>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
// import { useAuthStore } from '@/stores/auth'

interface Props {
  isCollapsed: boolean
}

defineProps<Props>()

// const authStore = useAuthStore()

// Temporary mock - replace with actual auth store
const user = { role: 'GERANT' }

const isGerant = computed(() => user.role === 'GERANT')
</script>

<style scoped>
.app-sidebar {
  position: fixed;
  top: var(--layout-header-height);
  left: 0;
  bottom: 0;
  width: var(--layout-sidebar-width);
  background: var(--color-bg-primary);
  border-right: 1px solid var(--color-border-light);
  z-index: 900;
  transition: all var(--transition-base);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.app-sidebar.collapsed {
  width: var(--layout-sidebar-collapsed-width);
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: var(--space-4) 0;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.nav-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.nav-section-title {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0 var(--space-4);
  margin-bottom: var(--space-2);
}

.collapsed .nav-section-title {
  opacity: 0;
  visibility: hidden;
}

.nav-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  list-style: none;
}

.nav-item {
  margin: 0;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  transition: all var(--transition-fast);
  position: relative;
}

.nav-link::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: var(--color-primary-500);
  transform: scaleY(0);
  transition: transform var(--transition-fast);
}

.nav-link:hover {
  color: var(--color-text-primary);
  background: var(--color-bg-secondary);
}

.nav-link.active {
  color: var(--color-primary-600);
  background: var(--color-primary-50);
}

.nav-link.active::before {
  transform: scaleY(1);
}

.nav-icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
}

.nav-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: all var(--transition-fast);
}

.collapsed .nav-text {
  opacity: 0;
  visibility: hidden;
  width: 0;
}

.sidebar-footer {
  border-top: 1px solid var(--color-border-light);
  padding: var(--space-4);
}

.footer-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

.app-version {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.version-text {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  font-weight: var(--font-weight-medium);
}

.collapsed .version-text {
  display: none;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .app-sidebar {
    transform: translateX(-100%);
    transition: transform var(--transition-base);
  }

  .app-sidebar:not(.collapsed) {
    transform: translateX(0);
  }

  .app-sidebar.collapsed {
    transform: translateX(-100%);
  }
}

/* Scrollbar Styling */
.sidebar-content::-webkit-scrollbar {
  width: 4px;
}

.sidebar-content::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-content::-webkit-scrollbar-thumb {
  background: var(--color-border-medium);
  border-radius: var(--radius-full);
}

.sidebar-content::-webkit-scrollbar-thumb:hover {
  background: var(--color-border-dark);
}
</style>
