<!-- src/views/DashboardPage.vue -->
<script setup>
import { ref, computed, onMounted, onBeforeUnmount, inject } from 'vue'
import { useRouter } from 'vue-router'
import { useAssessmentStore } from '@/stores/assessment'
import { useAuthStore } from '@/stores/auth'
import { useReportsStore } from '@/stores/reports'
import { useQuestionnairesStore } from '@/stores/questionnaires'
import { useUiStore } from '@/stores/ui'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'

function toPascalCaseUsername(u) {
  if (!u) return ''
  return u
    .split(/[_\s-]+/)
    .map((p) => (p ? p.charAt(0).toUpperCase() + p.slice(1) : ''))
    .join('')
}

const router = useRouter()
const mainContent = ref(null)
const authStore = useAuthStore()
const reportsStore = useReportsStore()
const uiStore = useUiStore()
const questionnairesStore = useQuestionnairesStore()
const assessmentStore = useAssessmentStore()
const showToast = inject('showToast')

const showDeleteConfirmModal = ref(false)
const reportToDeleteId = ref(null)
const showNewAssessmentModal = ref(false)
const searchQuery = ref('')

const reportsForDisplay = computed(() => reportsStore.userReports)
const completedReports = computed(() => reportsForDisplay.value.filter((r) => !r.isDraft))
const draftReports = computed(() => reportsForDisplay.value.filter((r) => r.isDraft))
const hasDrafts = computed(() => draftReports.value.length > 0)

const averageScore = computed(() => {
  if (completedReports.value.length === 0) return 'N/A'
  const total = completedReports.value.reduce((sum, report) => sum + report.score, 0)
  return (total / completedReports.value.length).toFixed(1)
})

const filteredReports = computed(() => {
  if (!searchQuery.value.trim()) return reportsForDisplay.value
  return reportsForDisplay.value.filter((report) =>
    report.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})

const activeAssessments = computed(() =>
  questionnairesStore.questionnaires.filter((q) => q.status === 'Active'),
)

function viewReport(report) {
  router.push({ name: 'ReportViewerPage', params: { reportId: report.id } })
}

function promptDeleteReport(reportId) {
  reportToDeleteId.value = reportId
  showDeleteConfirmModal.value = true
}

async function confirmDeleteReport() {
  if (reportToDeleteId.value !== null) {
    await reportsStore.deleteReport(reportToDeleteId.value)
    showToast('Report deleted successfully', 'success')
    cancelDelete()
  }
}

function cancelDelete() {
  showDeleteConfirmModal.value = false
  reportToDeleteId.value = null
}

async function continueAssessment(report) {
  assessmentStore.loadDraft(report)
  router.push({ name: 'questionnaire', params: { type: report.type } })
}

const latestDraft = computed(() => {
  return draftReports.value
    .slice()
    .sort((a, b) => new Date(b.lastModified || b.date) - new Date(a.lastModified || a.date))[0]
})

async function continueLatestDraft() {
  if (!latestDraft.value) return
  continueAssessment(latestDraft.value)
}

async function startSelectedAssessment(type) {
  showNewAssessmentModal.value = false
  router.push({ name: 'questionnaire', params: { type } })
}

async function logout() {
  await authStore.logout()
  showToast('You have been logged out.', 'info')
}

onMounted(() => {
  uiStore.setMainScrollContainer(mainContent.value)
})

onBeforeUnmount(() => {
  uiStore.setMainScrollContainer(null)
})
</script>

<template>
  <div class="h-screen bg-gray-100 dark:bg-gray-900 font-sans flex flex-col">
    <AppHeader
      :show-new-assessment="true"
      @request-new-assessment-modal="showNewAssessmentModal = true"
    />

    <main ref="mainContent" class="flex-grow overflow-y-auto">
      <div class="container mx-auto px-6 py-6">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Welcome,
          {{ toPascalCaseUsername(authStore.currentUser?.username) || authStore.userFullName }}
        </h1>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
            <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Total Assessments
            </h3>
            <p class="text-5xl font-extrabold text-blue-600 dark:text-blue-400">
              {{ completedReports.length }}
            </p>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
            <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Average Score
            </h3>
            <p class="text-5xl font-extrabold text-green-600 dark:text-green-400">
              {{ averageScore }}
            </p>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
            <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Drafts</h3>
            <p class="text-5xl font-extrabold text-yellow-600 dark:text-yellow-400">
              {{ draftReports.length }}
            </p>
          </div>
        </div>

        <section class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8 h-115">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-100">Recent Reports</h2>
            <div class="flex items-center gap-3 w-full sm:w-auto">
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Search reports by name..."
                class="w-full sm:w-64 px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div v-if="filteredReports.length > 0" class="max-h-96 overflow-y-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase"
                  >
                    Name
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase"
                  >
                    Date & Time
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase"
                  >
                    Type
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase"
                  >
                    Score
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase"
                  >
                    Grade
                  </th>
                  <th class="relative px-6 py-3"><span class="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody
                class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700"
              >
                <tr v-for="report in filteredReports" :key="report.id">
                  <td class="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                    {{ report.name }}
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {{ new Date(report.date).toLocaleString() }}
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                    {{ report.type || '—' }}
                  </td>
                  <td
                    class="px-6 py-4 text-sm font-bold"
                    :class="report.isDraft ? 'text-gray-400' : 'text-green-600 dark:text-green-400'"
                  >
                    {{ report.isDraft ? 'N/A' : report.score }}
                  </td>
                  <td class="px-6 py-4 text-sm">
                    <span
                      v-if="!report.isDraft"
                      :class="[
                        'px-2 py-1 rounded text-xs font-semibold',
                        report.score >= 90
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200'
                          : report.score >= 75
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200'
                            : report.score >= 60
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200',
                      ]"
                      >{{
                        report.score >= 90
                          ? 'A'
                          : report.score >= 75
                            ? 'B'
                            : report.score >= 60
                              ? 'C'
                              : 'D'
                      }}</span
                    >
                    <span v-else class="text-gray-400">—</span>
                  </td>
                  <td class="px-6 py-4 text-sm font-medium">
                    <div class="flex items-center justify-end gap-3">
                      <button
                        v-if="!report.isDraft"
                        @click="viewReport(report)"
                        class="cursor-pointer text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        View
                      </button>
                      <button
                        v-else
                        @click="continueAssessment(report)"
                        class="cursor-pointer inline-flex items-center gap-1 text-yellow-700 hover:text-yellow-900 dark:text-yellow-300"
                      >
                        <span
                          class="inline-flex items-center gap-1 px-1 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/40"
                        >
                          Draft
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                              clip-rule="evenodd"
                            />
                          </svg>
                        </span>
                      </button>
                      <button
                        @click="promptDeleteReport(report.id)"
                        class="cursor-pointer text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>No reports found.</p>
          </div>
        </section>

        <section v-if="!isAdminView" class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Quick Actions
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              @click="showNewAssessmentModal = true"
              class="flex flex-col items-center min-h-25 justify-center p-6 rounded-lg shadow-sm transition-colors duration-200 cursor-pointer bg-blue-50 dark:bg-blue-900/50 hover:bg-blue-100 dark:hover:bg-blue-900"
            >
              <span class="text-lg font-medium text-blue-800 dark:text-blue-300"
                >Start New Assessment</span
              >
            </button>
            <button
              v-if="hasDrafts"
              @click="continueLatestDraft"
              class="flex flex-col items-center min-h-25 justify-center p-6 rounded-lg shadow-sm transition-colors duration-200 cursor-pointer bg-yellow-50 dark:bg-yellow-900/40 hover:bg-yellow-100 dark:hover:bg-yellow-800"
            >
              <span class="text-lg font-medium text-yellow-800 dark:text-yellow-300"
                >Continue Draft</span
              >
            </button>
            <button
              @click="logout"
              class="flex flex-col items-center min-h-25 justify-center p-6 rounded-lg shadow-sm transition-colors duration-200 cursor-pointer bg-red-50 dark:bg-red-900/50 hover:bg-red-100 dark:hover:bg-red-900"
            >
              <span class="text-lg font-medium text-red-800 dark:text-red-300">Logout</span>
            </button>
          </div>
        </section>
      </div>
    </main>
    <AppFooter />

    <!-- Modals -->
    <transition name="fade">
      <div
        v-if="showNewAssessmentModal"
        @click.self="showNewAssessmentModal = false"
        class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50"
      >
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-lg w-full">
          <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            Start a New Assessment
          </h3>
          <ul class="space-y-2">
            <li v-for="assessment in activeAssessments" :key="assessment.id">
              <button
                @click="startSelectedAssessment(assessment.name)"
                class="w-full text-left p-4 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900 cursor-pointer"
              >
                <h4 class="font-semibold text-gray-800 dark:text-gray-200">
                  {{ assessment.name }}
                </h4>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div
        v-if="showDeleteConfirmModal"
        class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50"
      >
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full">
          <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Confirm Deletion</h3>
          <p class="text-gray-600 dark:text-gray-300 mb-6">Are you sure? This cannot be undone.</p>
          <div class="flex justify-end space-x-4">
            <button
              @click="cancelDelete"
              class="px-6 py-2 font-semibold text-gray-700 bg-gray-200 dark:bg-gray-600 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 cursor-pointer"
            >
              Cancel
            </button>
            <button
              @click="confirmDeleteReport"
              class="px-6 py-2 font-semibold text-white bg-red-600 rounded-md hover:bg-red-700 cursor-pointer"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
