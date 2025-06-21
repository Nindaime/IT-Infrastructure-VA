import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/views/HomePage.vue'
import AboutUsPage from '@/views/AboutUsPage.vue'
import LoginPage from '@/views/LoginPage.vue'
import DashboardPage from '@/views/DashboardPage.vue'
import QuestionnairePage from '@/views/QuestionnairePage.vue'
import ReportViewerPage from '@/views/ReportViewerPage.vue'
import AdminDashboardPage from '@/views/admin/AdminDashboardPage.vue'
import EditQuestionnairePage from '@/views/admin/EditQuestionnairePage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
      meta: { showHeaderAndFooter: true }
    },
    {
      path: '/about',
      name: 'about',
      component: AboutUsPage,
      meta: { showHeaderAndFooter: true }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
      meta: { showHeaderAndFooter: false } // To hide header/footer on this page
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardPage,
      meta: { showHeaderAndFooter: true }
    },
    {
      path: '/assessment',
      name: 'assessment',
      component: QuestionnairePage,
      meta: { showHeaderAndFooter: false }
    },
    {
      path: '/report/:businessName?', // Make businessName optional
      name: 'report',
      component: ReportViewerPage,
      props: true, // Pass route params as props to the component
      meta: { showHeaderAndFooter: false }
    },
    // Admin Routes
    {
      path: '/admin/dashboard',
      name: 'adminDashboard',
      component: AdminDashboardPage,
      meta: { showHeaderAndFooter: false } // Admin pages use their own header
    },
    {
      path: '/admin/questionnaire',
      name: 'adminQuestionnaire',
      component: EditQuestionnairePage,
      meta: { showHeaderAndFooter: false }
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    // always scroll to top
    return { top: 0 }
  },
})

export default router
