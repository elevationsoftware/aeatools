import { createRouter, createWebHistory } from 'vue-router'
import ConnectPage from '../views/ConnectPage.vue'
import ParsePage from '../views/ParsePage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/connect'
    },
    {
      path: '/connect',
      component: ConnectPage,
    },
    {
      path: '/parse',
      component: ParsePage,
      children: [
        {
          path: '',
          name: 'parse',
          component: () => import('../components/ParseInput.vue')
        },
        {
          path: 'logos',
          name: 'logos',
          component: () => import('../components/Logos.vue')
        },
        {
          path: 'pectabs',
          name: 'pectabs',
          component: () => import('../components/Pectabs.vue')
        }
      ]
    }
  ]
})

export default router
