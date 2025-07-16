import { createRouter, createWebHistory } from 'vue-router';

import LoginPage from '../pages/LoginPage.vue';
import DashboardPage from '../pages/DashboardPage.vue';
import UsersPage from '../pages/UsersPage.vue';
import BeveragesPage from '../pages/BeveragesPage.vue';
import LotsPage from '../pages/LotsPage.vue';
import StocksPage from '../pages/StocksPage.vue';
import MovementsPage from '../pages/MouvementsPage.vue';
import ProfilePage from '../pages/ProfilePage.vue';
import AnalyticsPage from '../pages/AnalyticsPage.vue';

const routes = [
  { path: '/', redirect: '/dashboard' },
  { path: '/login', component: LoginPage },
  { path: '/dashboard', component: DashboardPage },
  { path: '/users', component: UsersPage },
  { path: '/beverages', component: BeveragesPage },
  { path: '/lots', component: LotsPage },
  { path: '/stocks', component: StocksPage },
  { path: '/movements', component: MovementsPage },
  { path: '/analytics', component: AnalyticsPage },
  { path: '/profile', component: ProfilePage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
