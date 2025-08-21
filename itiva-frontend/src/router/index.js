import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/views/HomePage.vue'
import AboutUsPage from '@/views/AboutUsPage.vue'
import LoginPage from '@/views/LoginPage.vue'
import DashboardPage from '@/views/DashboardPage.vue'
import QuestionnairePage from '@/views/QuestionnairePage.vue'
import ReportViewerPage from '@/views/ReportViewerPage.vue'
import AdminDashboardPage from '@/views/admin/AdminDashboardPage.vue'
import EditQuestionnairePage from '@/views/admin/EditQuestionnairePage.vue'
import LinkAccountsPage from '@/views/LinkAccountsPage.vue' // New import
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
      meta: { showHeaderAndFooter: true },
      beforeEnter: (to, from, next) => {
        const authStore = useAuthStore()
        authStore.checkAuthStatus()
        if (authStore.isAuthenticated) {
          if (authStore.currentUser.isAdmin) {
            next({ name: 'adminDashboard' })
          } else {
            next({ name: 'dashboard' })
          }
        } else {
          next()
        }
      },
    },
    {
      path: '/about',
      name: 'about',
      component: AboutUsPage,
      meta: { showHeaderAndFooter: true },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
      meta: { showHeaderAndFooter: false }, // To hide header/footer on this page
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardPage,
      // Meta flag to hide global header/footer, as DashboardPage will have its own
      meta: { showHeaderAndFooter: false },
    },
    {
      path: '/questionnaire/:type',
      name: 'questionnaire',
      component: QuestionnairePage,
      meta: { showHeaderAndFooter: false },
    },
    {
      // path: '/report/:businessName?', // Make businessName optional
      path: '/report/:reportId',
      name: 'ReportViewerPage', // Renamed for clarity in route push
      component: ReportViewerPage,
      props: true, // Pass route params as props to the component
      meta: { showHeaderAndFooter: false },
    },
    // Admin Routes
    {
      path: '/admin/dashboard',
      name: 'adminDashboard',
      component: AdminDashboardPage,
      meta: { showHeaderAndFooter: false }, // Admin pages use their own header
    },
    {
      path: '/admin/questionnaire/:questionnaireId',
      name: 'adminQuestionnaire',
      component: EditQuestionnairePage,
      meta: { showHeaderAndFooter: false },
    },
    // New route for linking accounts
    {
      path: '/link-accounts',
      name: 'linkAccounts',
      component: LinkAccountsPage,
      meta: { showHeaderAndFooter: false }, // Hide global header/footer for this page
    },
  ],
  // eslint-disable-next-line no-unused-vars
  scrollBehavior(to, from, savedPosition) {
    // Always scroll to top
    return { top: 0 }
  },
})

export default router
