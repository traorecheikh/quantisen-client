import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

import LoginPage from '../pages/LoginPage.vue';
import PasswordChangePage from '../pages/PasswordChangePage.vue';
import DashboardPage from '../pages/DashboardPage.vue';
import UsersPage from '../pages/UsersPage.vue';
import BeveragesPage from '../pages/BeveragesPage.vue';
import LotsPage from '../pages/LotsPage.vue';
import StocksPage from '../pages/StocksPage.vue';
import MovementsPage from '../pages/MouvementsPage.vue';
import ProfilePage from '../pages/ProfilePage.vue';
import AnalyticsPage from '../pages/AnalyticsPage.vue';
import CacheManager from "../components/common/CacheManager.vue";

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    component: LoginPage,
    meta: { requiresAuth: false }
  },
  {
    path: '/password-change',
    component: PasswordChangePage,
    meta: { requiresAuth: true, requiresPasswordChange: true }
  },
  {
    path: '/dashboard',
    component: DashboardPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/users',
    component: UsersPage,
    meta: { requiresAuth: true, roles: ['GERANT'] }
  },
  {
    path: '/beverages',
    component: BeveragesPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/lots',
    component: LotsPage,
    meta: { requiresAuth: true, roles: ['GERANT'] }
  },
  {
    path: '/stocks',
    component: StocksPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/movements',
    component: MovementsPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/analytics',
    component: AnalyticsPage,
    meta: { requiresAuth: true, roles: ['GERANT'] }
  },
  {
    path: '/profile',
    component: ProfilePage,
    meta: { requiresAuth: true }
  },
  {
    path: '/cache',
    component: CacheManager,
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/dashboard'
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard
router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore();

  // Check if route requires authentication
  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      next('/login');
      return;
    }

    // Check if user is active
    if (!authStore.isActive) {
      authStore.logout();
      next('/login');
      return;
    }

    // Check if password change is required
    if (authStore.isFirstLogin && to.path !== '/password-change') {
      next('/password-change');
      return;
    }

    // If trying to access password change page but not first login
    if (to.path === '/password-change' && !authStore.isFirstLogin) {
      next('/dashboard');
      return;
    }
  }

  // If authenticated user tries to access login page
  if (to.path === '/login' && authStore.isAuthenticated) {
    if (authStore.isFirstLogin) {
      next('/password-change');
      return;
    }
    next('/dashboard');
    return;
  }

  // Role-based access control
  if (to.meta.roles && !to.meta.roles.includes(authStore.user?.role)) {
    next('/dashboard');
    return;
  }

  next();
});

export default router;
