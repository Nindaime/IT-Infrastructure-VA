import { createRouter, createWebHistory } from 'vue-router'
import { useAuth, useUser } from '@clerk/vue'
import { watch } from 'vue'

import HomePage from '@/views/HomePage.vue'
import AboutUsPage from '@/views/AboutUsPage.vue'
import LoginPage from '@/views/LoginPage.vue'
import DashboardPage from '@/views/DashboardPage.vue'
import QuestionnairePage from '@/views/QuestionnairePage.vue'
import ReportViewerPage from '@/views/ReportViewerPage.vue'
import AdminDashboardPage from '@/views/admin/AdminDashboardPage.vue'
import EditQuestionnairePage from '@/views/admin/EditQuestionnairePage.vue'
import LinkAccountsPage from '@/views/LinkAccountsPage.vue'
import AccountVerificationPage from '@/views/AccountVerificationPage.vue'
import AccountSettingsPage from '@/views/AccountSettingsPage.vue'
import AdminApprovalsPage from '@/views/admin/AdminApprovalsPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomePage, meta: { showHeaderAndFooter: true } },
    { path: '/about', name: 'about', component: AboutUsPage, meta: { showHeaderAndFooter: true } },
    {
      path: '/login/:catchAll(.*)*',
      name: 'login',
      component: LoginPage,
      meta: { showHeaderAndFooter: false, viewKey: 'auth' },
    },
    {
      path: '/sign-up/:catchAll(.*)*',
      name: 'sign-up',
      component: LoginPage,
      meta: { showHeaderAndFooter: false, viewKey: 'auth' },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardPage,
      meta: { showHeaderAndFooter: false, requiresAuth: true },
    },
    {
      path: '/questionnaire/:type',
      name: 'questionnaire',
      component: QuestionnairePage,
      meta: { showHeaderAndFooter: false, requiresAuth: true },
    },
    {
      path: '/report/:reportId',
      name: 'ReportViewerPage',
      component: ReportViewerPage,
      props: true,
      meta: { showHeaderAndFooter: false, requiresAuth: true },
    },
    {
      path: '/link-accounts',
      name: 'linkAccounts',
      component: LinkAccountsPage,
      meta: { showHeaderAndFooter: false, requiresAuth: true },
    },
    {
      path: '/verify-account',
      name: 'verifyAccount',
      component: AccountVerificationPage,
      meta: { requiresAuth: true, showHeaderAndFooter: true },
    },
    {
      path: '/account-settings',
      name: 'account-settings',
      component: AccountSettingsPage,
      meta: { showHeaderAndFooter: true, requiresAuth: true },
    },
    // Admin Routes
    {
      path: '/admin/dashboard',
      name: 'adminDashboard',
      component: AdminDashboardPage,
      meta: { showHeaderAndFooter: false, requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/admin/questionnaire/:questionnaireId',
      name: 'adminQuestionnaire',
      component: EditQuestionnairePage,
      meta: { showHeaderAndFooter: false, requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/admin/approvals',
      name: 'adminApprovals',
      component: AdminApprovalsPage,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach(async (to, from, next) => {
  const { isSignedIn, isLoaded } = useAuth()
  const { user } = useUser()

  if (!isLoaded.value) {
    await new Promise((resolve) => {
      const unwatch = watch(isLoaded, (loaded) => {
        if (loaded) {
          unwatch()
          resolve()
        }
      })
    })
  }

  // Wait for user data to be available, especially after login
  if (isSignedIn.value && !user.value) {
    await new Promise((resolve) => {
      const unwatch = watch(user, (newValue) => {
        if (newValue) {
          unwatch()
          resolve()
        }
      })
    })
  }

  const userRole = user.value?.unsafeMetadata?.role

  // Redirect authenticated admins to admin dashboard when they hit user-land entry points
  const userEntryRoutes = ['home', 'login', 'sign-up', 'dashboard']
  if (isSignedIn.value && userRole === 'admin' && userEntryRoutes.includes(to.name)) {
    return next({ name: 'adminDashboard' })
  }

  // Auth-wall for protected routes
  if (to.meta.requiresAuth && !isSignedIn.value) {
    return next({ name: 'login' })
  }

  // Admin-wall for admin routes
  if (to.meta.requiresAdmin && userRole !== 'admin') {
    return next({ name: 'dashboard' })
  }

  return next()
})

export default router
