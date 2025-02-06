import { createRouter, createWebHistory } from 'vue-router'
import Default from '@/layouts/default.vue'

declare module 'vue-router' {
  interface RouteMeta {
    //permissões para acessar
    // roles?: string[]

    //exige autenticação
    //requiresAuth?: boolean
  }
}

const routes = [
  {
    path: '/',
    component: Default,
    children: [
      {
        path: '/publications',
        name: 'Publications',
        meta: { requiresAuth: true },
        component: () => import('@/pages/publications.vue')
      },

      {
        path: '/conversations',
        name: 'conversations',
        meta: { requiresAuth: true },
        component: () => import('@/pages/conversations.vue')
      },

      {
        path: '/contacts',
        name: 'contacts',
        meta: { requiresAuth: true },
        component: () => import('@/pages/contacts.vue')
      }
    ]
  },
]

const router = createRouter({
  history: createWebHistory(""),
  routes
})

export default router