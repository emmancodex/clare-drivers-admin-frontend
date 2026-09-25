import { createRouter, createWebHistory } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/authStore.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/LoginView.vue'),
      meta: { title: 'Sign In', public: true },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/auth/RegisterView.vue'),
      meta: { title: 'Create Account', public: true },
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('@/views/auth/ForgotPasswordView.vue'),
      meta: { title: 'Forgot Password', public: true },
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: () => import('@/views/auth/ResetPasswordView.vue'),
      meta: { title: 'Reset Password', public: true },
    },
    {
      path: '/',
      name: 'overview',
      component: () => import('@/views/OverviewView.vue'),
      meta: { title: 'Overview' },
    },
    {
      path: '/admins',
      name: 'admins',
      component: () => import('@/views/AdminsView.vue'),
      meta: { title: 'Admins', roles: ['SuperAdmin'] },
    },
    {
      path: '/drivers',
      name: 'drivers',
      component: () => import('@/views/DriversView.vue'),
      meta: { title: 'Drivers' },
    },
    {
      path: '/drivers/active',
      name: 'active-drivers',
      component: () => import('@/views/ActiveDriversView.vue'),
      meta: { title: 'Active Drivers' },
    },
    {
      path: '/drivers/active/:driverId',
      name: 'active-driver-detail',
      component: () => import('@/views/ActiveDriverDetailView.vue'),
      meta: { title: 'Active Driver Details' },
    },
    {
      path: '/drivers/:driverId',
      name: 'driver-detail',
      component: () => import('@/views/DriverDetailView.vue'),
      meta: { title: 'Driver Details' },
    },
    {
      path: '/logs',
      name: 'activity-logs',
      component: () => import('@/views/ActivityLogsView.vue'),
      meta: { title: 'Activity Logs' },
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
      meta: { title: 'Profile' },
    },
  ],
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()
  const { accessToken, user } = storeToRefs(authStore)
  const { bootAppRequest } = authStore

  await bootAppRequest()

  const isAuthenticated = !!accessToken.value
  const isPublic = !!to.meta.public

  if (!isAuthenticated && !isPublic) return { name: 'login' }
  if (isAuthenticated && isPublic) return { name: 'overview' }

  if (isAuthenticated && to.meta.roles && !to.meta.roles.includes(user.value?.role)) {
    return { name: 'overview' }
  }
})

router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} | ClareDrivers` : 'ClareDrivers'
})

export default router
