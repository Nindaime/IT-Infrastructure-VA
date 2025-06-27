<!-- src/views/DashboardPage.vue - Final version with custom header, settings dropdown, and improved UI -->
<script setup>
import { ref, computed } from 'vue'
import { useAssessmentStore } from '@/stores/assessment' // Import the assessment store
import { useAuthStore } from '@/stores/auth' // Import the auth store
import { useReportsStore } from '@/stores/reports' // Import the new reports store
import { useRouter } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'

// Initialize the Vue Router for navigation
const router = useRouter()

// Props received from the parent component (e.g., App.vue)
// No props needed from App.vue anymore
const authStore = useAuthStore()
const reportsStore = useReportsStore()
const assessmentStore = useAssessmentStore()

// Reactive state to control the visibility of the settings dropdown menu
const showSettingsMenu = ref(false)
const showDeleteConfirmModal = ref(false)
const reportToDeleteId = ref(null)

// Reactive state for the welcome modal
const showWelcomeModal = ref(false)

// Computed property to get the latest report for each assessment type
const latestReportsByType = computed(() => {
  const latestMap = new Map()
  // Iterate in reverse to easily get the latest by ID (assuming higher ID means newer)
  for (let i = reportsStore.userReports.length - 1; i >= 0; i--) {
    const report = reportsStore.userReports[i]
    // If we haven't seen this type yet, or if this report is newer (higher ID)
    // than the one currently stored for this type, update the map.
    // This assumes IDs are sequential and higher ID means newer.
    if (!latestMap.has(report.type) || report.id > latestMap.get(report.type).id) {
      latestMap.set(report.type, report)
    }
  }
  return Array.from(latestMap.values())
})

// --- Grading Logic (copied for consistency) ---
function getGrade(score) {
  if (score >= 85) return 'A'
  if (score >= 75) return 'B'
  if (score >= 65) return 'C'
  if (score >= 50) return 'D'
  return 'E'
}

function getGradeColorClass(grade) {
  switch (grade) {
    case 'A':
      return 'text-green-600'
    case 'B':
      return 'text-emerald-600'
    case 'C':
      return 'text-yellow-600'
    case 'D':
      return 'text-orange-600'
    case 'E':
      return 'text-red-600'
    default:
      return 'text-gray-600'
  }
}

/**
 * Navigates to the ReportViewerPage with the details of the selected report.
 * @param {object} report The report object containing details.
 */
function viewReport(report) {
  // The assessment store is still needed to pass the *currently viewed* report to the viewer page
  assessmentStore.setGeneratedReport(report.report, report.name, report.type)
  router.push({ name: 'ReportViewerPage' })
}

/**
 * Opens the confirmation modal before deleting a report.
 * @param {number} reportId The ID of the report to be deleted.
 */
function promptDeleteReport(reportId) {
  reportToDeleteId.value = reportId
  showDeleteConfirmModal.value = true
}

/**
 * Deletes a report from the user's list after confirmation.
 */
function confirmDeleteReport() {
  if (reportToDeleteId.value !== null) {
    reportsStore.deleteReport(reportToDeleteId.value)
  }
  cancelDelete() // Close modal and reset state
}

/**
 * Closes the delete confirmation modal without taking action.
 */
function cancelDelete() {
  showDeleteConfirmModal.value = false
  reportToDeleteId.value = null
}

/**
 * Navigates to the questionnaire to retake a specific assessment.
 * @param {object} report The report object to retake.
 */
function retakeAssessment(report) {
  router.push({ name: 'questionnaire', params: { type: report.type } })
}

/**
 * Navigates to the QuestionnairePage to initiate a new security assessment.
 */
function startNewAssessment() {
  // Navigate to the questionnaire page with a default assessment type
  router.push({ name: 'questionnaire', params: { type: 'Standard ITIVA Assessment' } })
}

/**
 * Closes the welcome modal.
 */
function closeWelcomeModal() {
  showWelcomeModal.value = false
}

/**
 * Navigates to the new LinkAccountsPage.
 */
function goToLinkAccounts() {
  router.push('/link-accounts')
  showSettingsMenu.value = false // Close menu after navigation
}

/**
 * Handles user logout.
 */
function logout() {
  console.log('User logged out.')
  // In a real app, this would clear authentication tokens.
  router.push('/')
  authStore.logout() // Use the store's logout action
}
</script>

<template>
  <!-- Main container for the dashboard page, with light gray background -->
  <div class="min-h-screen bg-gray-100 font-sans flex flex-col">
    <!-- The single, unified AppHeader is called here. -->
    <AppHeader :show-new-assessment="true" />
    <!-- Main Content Area: Centered, padded, responsive -->
    <main class="container mx-auto px-6 py-8 flex-grow">
      <!-- Welcome Heading - uses authStore.userName -->
      <h1 class="text-3xl font-bold text-gray-900 mb-6">Welcome, {{ authStore.userName }}!</h1>

      <!-- Dashboard Overview Cards: Grid layout for key metrics -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <!-- Total Assessments Card -->
        <div class="bg-white rounded-lg shadow p-6 text-center">
          <h3 class="text-xl font-semibold text-gray-700 mb-2">Total Assessments</h3>
          <p class="text-5xl font-extrabold text-blue-600">{{ reportsStore.userReports.length }}</p>
        </div>
        <!-- Average Score Card -->
        <div class="bg-white rounded-lg shadow p-6 text-center">
          <h3 class="text-xl font-semibold text-gray-700 mb-2">Average Score</h3>
          <p class="text-5xl font-extrabold text-green-600">
            {{
              latestReportsByType.length > 0
                ? (
                    latestReportsByType.reduce((sum, r) => sum + r.score, 0) /
                    latestReportsByType.length
                  ).toFixed(1)
                : 'N/A'
            }}
          </p>
        </div>
        <!-- Last Assessment Date Card -->
        <div class="bg-white rounded-lg shadow p-6 text-center">
          <h3 class="text-xl font-semibold text-gray-700 mb-2">Last Assessment Date</h3>
          <p class="text-2xl font-bold text-gray-600">
            {{ reportsStore.userReports.length > 0 ? reportsStore.userReports[0].date : 'N/A' }}
            <!-- Still uses first report for "last date" -->
          </p>
        </div>
      </div>

      <!-- Recent Reports Section: Displays a table of user's past reports -->
      <section class="bg-white rounded-lg shadow p-6 mb-8">
        <h2 class="text-2xl font-semibold text-gray-800 mb-4">Your Recent Reports</h2>
        <div v-if="reportsStore.userReports.length > 0" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 overflow-y-auto">
            <thead class="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Report Name
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Score
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Grade
                </th>
                <th
                  scope="col"
                  class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Type
                </th>
                <th scope="col" class="relative px-4 py-3">
                  <span class="sr-only">View</span>
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="report in reportsStore.userReports" :key="report.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <div class="flex items-center">
                    <span>{{ report.name }}</span>
                    <button
                      @click="retakeAssessment(report)"
                      class="ml-2 text-gray-400 cursor-pointer hover:text-blue-600 transition-colors"
                      title="Retake Assessment"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M4 4v5h5M20 20v-5h-5M4 4l1.5 1.5A9 9 0 0120.5 15M20 20l-1.5-1.5A9 9 0 003.5 9"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ report.date }}
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-bold"
                  :class="
                    report.score > 75
                      ? 'text-green-600'
                      : report.score > 50
                        ? 'text-yellow-600'
                        : 'text-red-600'
                  "
                >
                  {{ report.score }}
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-bold"
                  :class="getGradeColorClass(getGrade(report.score))"
                >
                  {{ getGrade(report.score) }}
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ report.type }}
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex items-center justify-end space-x-4">
                    <button
                      @click="viewReport(report)"
                      class="text-blue-600 hover:text-blue-900 transition-colors duration-200 cursor-pointer"
                    >
                      View Report
                    </button>
                    <button
                      @click="promptDeleteReport(report.id)"
                      class="text-red-500 hover:text-red-700 cursor-pointer transition-colors"
                      title="Delete Report"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- Message if no reports are available -->
        <div v-else class="text-center py-8 text-gray-500">
          <p class="mb-4">
            No reports found. Start a new assessment to see your vulnerability reports here!
          </p>
          <button
            @click="startNewAssessment"
            class="bg-blue-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            Start New Assessment
          </button>
        </div>
      </section>

      <!-- Quick Actions Section: Buttons for common tasks -->
      <section class="bg-white rounded-lg shadow p-6">
        <h2 class="text-2xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <!-- Start New Assessment Button -->
          <button
            @click="startNewAssessment"
            class="flex cursor-pointer flex-col items-center justify-center p-6 bg-blue-50 rounded-lg shadow-sm hover:bg-blue-100 transition-colors duration-200"
          >
            <!-- Icon for New Assessment -->
            <svg
              class="w-12 h-12 text-blue-600 mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M12 4v16m8-8H4"
              ></path>
            </svg>
            <span class="text-lg font-medium text-blue-800">Start New Assessment</span>
          </button>
          <!-- Manage Settings Button (now handled by dropdown) -->
          <button
            @click="goToLinkAccounts"
            class="flex flex-col cursor-pointer items-center justify-center p-6 bg-green-50 rounded-lg shadow-sm hover:bg-green-100 transition-colors duration-200"
          >
            <!-- Icon for Settings/Link Accounts -->
            <svg
              class="w-12 h-12 text-green-600 mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.368 2.572-1.065z"
              ></path>
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              ></path>
            </svg>
            <span class="text-lg font-medium text-green-800">Link Accounts</span>
          </button>
          <!-- Logout Button -->
          <button
            @click="logout"
            class="flex flex-col cursor-pointer items-center justify-center p-6 bg-red-50 rounded-lg shadow-sm hover:bg-red-100 transition-colors duration-200"
          >
            <!-- Icon for Logout -->
            <svg
              class="w-12 h-12 text-red-600 mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              ></path>
            </svg>
            <span class="text-lg font-medium text-red-800">Logout</span>
          </button>
        </div>
      </section>
    </main>
    <AppFooter />

    <!-- Welcome Modal: Displays a welcome message when the dashboard is loaded -->
    <transition name="flash-out-fade">
      <div
        v-if="showWelcomeModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      >
        <div
          class="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center relative transform transition-all duration-300 scale-100 opacity-100"
        >
          <!-- Close button for the modal -->
          <button
            @click="closeWelcomeModal"
            class="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <!-- Close Icon -->
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
          <!-- Modal Heading -->
          <h3 class="text-3xl font-bold text-blue-600 mb-4">Welcome Back!</h3>
          <!-- Modal Body Text -->
          <p class="text-gray-700 mb-6">
            We're glad to see you again, {{ authStore.userName }}. Dive into your dashboard to
            manage your IT vulnerability assessments.
          </p>
          <!-- Get Started Button to close the modal -->
          <button
            @click="closeWelcomeModal"
            class="bg-blue-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            Get Started
          </button>
        </div>
      </div>
    </transition>
  </div>

  <!-- Delete Confirmation Modal -->
  <transition name="fade">
    <div
      v-if="showDeleteConfirmModal"
      class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-white rounded-lg shadow-xl p-6 max-w-md w-full relative">
        <button
          @click="cancelDelete"
          class="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
        <h3 class="text-xl font-bold text-gray-800 mb-4">Confirm Deletion</h3>
        <p class="text-gray-600 mb-6">
          Are you sure you want to delete this report? This action cannot be undone.
        </p>
        <div class="flex justify-end space-x-4">
          <button
            @click="cancelDelete"
            class="px-6 py-2 cursor-pointer font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="confirmDeleteReport"
            class="px-6 py-2 cursor-pointer font-semibold text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
/*
  Scoped styles for the flash-out-fade transition.
  This defines how the notification/modal will fade out.
*/
.flash-out-fade-enter-active,
.flash-out-fade-leave-active {
  transition:
    opacity 0.5s ease,
    transform 0.5s ease;
}

.flash-out-fade-enter-from,
.flash-out-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px); /* Moves up slightly while fading out */
}

/* Added for the new delete modal */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
