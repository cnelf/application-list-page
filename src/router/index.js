import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'AppList',
      component: () => import('../views/AppList.vue')
    }
  ]
});

export default router;
