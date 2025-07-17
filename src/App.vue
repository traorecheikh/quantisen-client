<template>
  <div id="app" class="app-layout">
    <template v-if="shouldShowLayout">
      <AppHeader @toggle-sidebar="toggleSidebar" />
      <AppSidebar :is-collapsed="sidebarCollapsed" />
    </template>

    <main class="app-main" :class="{
      'sidebar-collapsed': sidebarCollapsed && shouldShowLayout,
      'no-layout': !shouldShowLayout
    }">
      <div class="main-content">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from './stores/auth'
import AppHeader from './components/layout/AppHeader.vue'
import AppSidebar from './components/layout/AppSidebar.vue'

const route = useRoute()
const authStore = useAuthStore()

const sidebarCollapsed = ref(false)

const shouldShowLayout = computed(() => {
  // Don't show layout on login or password change pages
  const excludedRoutes = ['/login', '/password-change']
  return authStore.isAuthenticated && !excludedRoutes.includes(route.path)
})

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  background: var(--color-bg-secondary);
}

.app-main {
  margin-left: var(--layout-sidebar-width);
  margin-top: var(--layout-header-height);
  transition: margin-left var(--transition-base);
  min-height: calc(100vh - var(--layout-header-height));
}

.app-main.sidebar-collapsed {
  margin-left: var(--layout-sidebar-collapsed-width);
}

.app-main.no-layout {
  margin-left: 0;
  margin-top: 0;
  min-height: 100vh;
}

.main-content {
  padding: var(--layout-content-padding);
  max-width: var(--layout-max-width);
  margin: 0 auto;
}

.no-layout .main-content {
  padding: 0;
  max-width: none;
}

@media (max-width: 768px) {
  .app-main {
    margin-left: 0;
  }

  .app-main.sidebar-collapsed {
    margin-left: 0;
  }
}
</style>
