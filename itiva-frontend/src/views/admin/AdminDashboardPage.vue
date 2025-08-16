<!-- src/views/admin/AdminDashboardPage.vue - Updated as per requirements -->
<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useQuestionnairesStore } from '@/stores/questionnaires'
import { mockRankings } from '@/api/mockData'

const router = useRouter()
const authStore = useAuthStore()
const questionnairesStore = useQuestionnairesStore()

// --- Welcome Modal State & Logic ---
const showWelcomeModal = ref(false)
onMounted(() => {
  if (localStorage.getItem('adminWelcomeModalShown') !== 'true') {
    showWelcomeModal.value = true
  }
})
watch(showWelcomeModal, (isShowing) => {
  if (!isShowing) {
    localStorage.setItem('adminWelcomeModalShown', 'true')
  }
})

// --- Dashboard Panel Data ---
const businesses = ref(
  mockRankings.map((r) => ({
    ...r,
    id: r.rank,
    status: r.score > 70 ? 'Active' : 'Needs Attention',
    categoryScores: r.report
      ? [
          { name: 'Website Strength', score: r.report.ws, key: 'ws' },
          { name: 'Devices & Network', score: r.report.dn, key: 'dn' },
          { name: 'Compliance & Documentation', score: r.report.cd, key: 'cd' },
          { name: 'Cyber Security Implementations', score: r.report.cs, key: 'cs' },
        ]
      : [],
  })),
)
const totalUsers = computed(() => businesses.value.length)
const activeAssessments = computed(
  () => questionnairesStore.questionnaires.filter((q) => q.status === 'Active').length,
)
const pendingApprovals = ref(5) // Static value as backend is not available

// --- Questionnaire Management State & Logic ---
const questionnaires = computed(() => {
  return questionnairesStore.questionnaires.map((q) => ({
    ...q,
    questionsCount: questionnairesStore.getQuestionCountForAssessment(q.name) || 'N/A',
  }))
})

const showDeleteModal = ref(false)
const showDuplicateModal = ref(false)
const questionnaireToAction = ref(null)

function openDeleteModal(questionnaire) {
  questionnaireToAction.value = questionnaire
  showDeleteModal.value = true
}

function confirmDelete() {
  if (questionnaireToAction.value) {
    questionnairesStore.deleteQuestionnaire(questionnaireToAction.value.id)
  }
  closeModals()
}

function openDuplicateModal(questionnaire) {
  questionnaireToAction.value = questionnaire
  showDuplicateModal.value = true
}

function confirmDuplicate() {
  if (questionnaireToAction.value) {
    questionnairesStore.duplicateQuestionnaire(questionnaireToAction.value.id)
  }
  closeModals()
}

function closeModals() {
  showDeleteModal.value = false
  showDuplicateModal.value = false
  questionnaireToAction.value = null
}

function formatDate(dateString) {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// --- Business Management State & Logic (existing) ---
const selectedBusinessForScores = ref(businesses.value.length > 0 ? businesses.value[0] : null)
const searchTerm = ref('')
const sortKey = ref('score')
const sortOrder = ref(0)

const filteredAndSortedBusinesses = computed(() => {
  let filtered = businesses.value
  if (searchTerm.value) {
    const lowerCaseSearchTerm = searchTerm.value.toLowerCase()
    filtered = filtered.filter(
      (biz) =>
        biz.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        biz.location.toLowerCase().includes(lowerCaseSearchTerm) ||
        biz.type.toLowerCase().includes(lowerCaseSearchTerm),
    )
  }
  return filtered.sort((a, b) => {
    let valA = a[sortKey.value]
    let valB = b[sortKey.value]
    if (typeof valA === 'string' && typeof valB === 'string') {
      return valA.localeCompare(valB) * (sortOrder.value === 0 ? -1 : 1)
    }
    return (valA - valB) * (sortOrder.value === 0 ? -1 : 1)
  })
})

function toggleSort(key) {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 0 ? 1 : 0
  } else {
    sortKey.value = key
    sortOrder.value = 0
  }
}

function selectBusinessForScores(biz) {
  selectedBusinessForScores.value = biz
}

function editQuestionnaire(questionnaire) {
  router.push({ name: 'adminQuestionnaire', params: { questionnaireId: questionnaire.id } })
}

function addNewQuestionnaire() {
  router.push({ name: 'adminQuestionnaire', params: { questionnaireId: 'new' } })
}

async function logout() {
  await authStore.logout()
}
</script>

<template>
  <!-- Main container for the admin dashboard: full height, light gray background -->
  <div class="min-h-screen bg-gray-100 font-sans">
    <!-- Admin Dashboard Header: White background, shadow, flex layout for alignment -->
    <header
      class="bg-white shadow-sm py-4 px-6 flex justify-between items-center sticky top-0 z-20"
    >
      <div class="flex items-center">
        <!-- ITIVA Admin link now correctly points to the admin dashboard -->
        <RouterLink to="/admin/dashboard" class="text-2xl font-bold"
          >IT<span class="text-blue-600">I</span>VA
          <span class="text-blue-600">Admin</span></RouterLink
        >
      </div>
      <nav class="flex items-center space-x-4">
        <button
          @click="addNewQuestionnaire"
          class="px-4 py-2 rounded-md cursor-pointer text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-colors duration-200"
        >
          Add New Questionnaire
        </button>
        <button
          @click="logout"
          class="px-4 py-2 rounded-md cursor-pointer text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
        >
          Logout
        </button>
      </nav>
    </header>

    <!-- Main Content Area: Centered, padded, responsive -->
    <main class="container mx-auto px-6 py-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

      <!-- Overview Cards: Grid layout for key metrics -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <!-- Total Users Card -->
        <div class="bg-white rounded-lg shadow p-6 text-center">
          <h3 class="text-xl font-semibold text-gray-700 mb-2">Total Users</h3>
          <p class="text-5xl font-extrabold text-blue-600">{{ totalUsers }}</p>
        </div>
        <!-- Active Assessments Card -->
        <div class="bg-white rounded-lg shadow p-6 text-center">
          <h3 class="text-xl font-semibold text-gray-700 mb-2">Active Assessments</h3>
          <p class="text-5xl font-extrabold text-purple-600">{{ activeAssessments }}</p>
        </div>
        <!-- Pending Approvals Card -->
        <div class="bg-white rounded-lg shadow p-6 text-center">
          <h3 class="text-xl font-semibold text-gray-700 mb-2">Pending Approvals</h3>
          <p class="text-5xl font-extrabold text-yellow-600">{{ pendingApprovals }}</p>
        </div>
      </div>

      <!-- Business Management Section: Split into 2 columns with progress bars -->
      <section class="bg-white rounded-lg shadow p-6 mb-8">
        <h2 class="text-2xl font-semibold text-gray-800 mb-4">Business Overview and Management</h2>
        <div class="mb-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <input
            type="text"
            v-model="searchTerm"
            placeholder="Search businesses..."
            class="w-full sm:w-1/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <div class="flex items-center flex-wrap gap-2">
            <span class="mr-2 text-sm font-medium">Sort by:</span>
            <button
              @click="toggleSort('score')"
              :class="[
                'px-3 py-1 text-sm rounded-full cursor-pointer',
                sortKey === 'score' ? 'bg-blue-600 text-white' : 'bg-gray-200',
              ]"
            >
              Score
              <span v-if="sortKey === 'score'">{{ sortOrder === 0 ? ' ▲' : ' ▼' }}</span>
            </button>
            <button
              @click="toggleSort('name')"
              :class="[
                'px-3 py-1 text-sm rounded-full cursor-pointer',
                sortKey === 'name' ? 'bg-blue-600 text-white' : 'bg-gray-200',
              ]"
            >
              Name
              <span v-if="sortKey === 'name'">{{ sortOrder === 0 ? ' ▲' : ' ▼' }}</span>
            </button>
            <button
              @click="toggleSort('location')"
              :class="[
                'px-3 py-1 text-sm rounded-full cursor-pointer',
                sortKey === 'location' ? 'bg-blue-600 text-white' : 'bg-gray-200',
              ]"
            >
              Location
              <span v-if="sortKey === 'location'">{{ sortOrder === 0 ? ' ▲' : ' ▼' }}</span>
            </button>
            <button
              @click="toggleSort('type')"
              :class="[
                'px-3 py-1 text-sm rounded-full cursor-pointer',
                sortKey === 'type' ? 'bg-blue-600 text-white' : 'bg-gray-200',
              ]"
            >
              Type
              <span v-if="sortKey === 'type'">{{ sortOrder === 0 ? ' ▲' : ' ▼' }}</span>
            </button>
          </div>
        </div>

        <!-- Split view for Business List and Category Scores with Progress Bars -->
        <div class="flex flex-col lg:flex-row gap-6">
          <!-- Left Side: Business List (Scrollable) -->
          <div
            class="w-full lg:w-1/2 h-96 overflow-y-auto custom-scrollbar bg-gray-50 p-4 pt-0 rounded-lg border border-gray-200"
          >
            <h3 class="text-lg font-semibold text-gray-800 mb-4 sticky top-0 bg-gray-50 py-2 z-10">
              Business List
            </h3>
            <ul class="space-y-3">
              <li
                v-for="biz in filteredAndSortedBusinesses"
                :key="biz.id"
                @click="selectBusinessForScores(biz)"
                class="p-4 rounded-lg hover:bg-white cursor-pointer flex items-center justify-between border border-gray-200 transition-colors duration-200"
                :class="{
                  'bg-blue-100 border-blue-300':
                    selectedBusinessForScores && selectedBusinessForScores.id === biz.id,
                }"
              >
                <div class="flex items-center">
                  <span class="font-bold text-gray-400 mr-4 w-6 text-center">{{ biz.rank }}</span>
                  <div>
                    <p class="font-bold text-gray-900 text-lg">{{ biz.name }}</p>
                    <p class="text-sm text-gray-600">{{ biz.location }} - {{ biz.type }}</p>
                  </div>
                </div>
                <div class="flex items-center space-x-4">
                  <span
                    class="font-extrabold text-xl"
                    :class="
                      biz.score > 75
                        ? 'text-green-600'
                        : biz.score > 50
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    "
                  >
                    {{ biz.score }}
                  </span>
                  <span
                    :class="[
                      'px-3 py-1 text-xs font-semibold rounded-full',
                      biz.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800',
                    ]"
                  >
                    {{ biz.status }}
                  </span>
                </div>
              </li>
            </ul>
            <div
              v-if="filteredAndSortedBusinesses.length === 0"
              class="text-center py-8 text-gray-500"
            >
              No businesses found matching your criteria.
            </div>
          </div>

          <!-- Right Side: Category Scores with Progress Bars (shows for selectedBusinessForScores) -->
          <div
            class="w-full lg:w-1/2 bg-gray-50 p-4 rounded-lg border border-gray-200 flex flex-col justify-start"
          >
            <h3 class="text-8xl font-bold text-green-600 mb-2">
              {{ selectedBusinessForScores.score }}
            </h3>
            <div v-if="selectedBusinessForScores">
              <p class="text-xl font-bold text-yellow-600 mb-4">
                {{ selectedBusinessForScores.name }}'s Scores
              </p>
              <div class="space-y-2">
                <div
                  v-for="category in selectedBusinessForScores.categoryScores"
                  :key="category.key"
                >
                  <p class="text-sm font-medium text-gray-700 mb-2">{{ category.name }}</p>
                  <div class="w-full bg-gray-200 rounded-full h-4">
                    <div
                      class="h-full rounded-full flex items-center justify-end pr-2 text-xs font-bold text-white transition-all duration-500"
                      :class="{
                        'bg-green-500': category.score >= 85,
                        'bg-emerald-500': category.score >= 75 && category.score < 85,
                        'bg-yellow-500': category.score >= 65 && category.score < 75,
                        'bg-orange-500': category.score >= 50 && category.score < 65,
                        'bg-red-500': category.score < 50,
                      }"
                      :style="{ width: `${category.score}%` }"
                    >
                      {{ category.score }}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-8 text-gray-500">
              Select a business from the list to view its category scores.
            </div>
          </div>
        </div>
      </section>

      <!-- Questionnaire Management Section -->
      <section class="bg-white rounded-lg shadow p-6">
        <h2 class="text-2xl font-semibold text-gray-800 mb-4">Questionnaire Management</h2>
        <div class="mb-4">
          <button
            @click="addNewQuestionnaire"
            class="px-5 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition-colors duration-200 cursor-pointer"
          >
            Create New Questionnaire
          </button>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Questions
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Last Updated
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="q in questionnaires" :key="q.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ q.name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ q.questionsCount }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(q.lastUpdated) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="[
                      'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                      q.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800',
                    ]"
                  >
                    {{ q.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button @click="editQuestionnaire(q)" class="text-indigo-600 hover:text-indigo-900 cursor-pointer">Edit</button>
                  <button @click="openDuplicateModal(q)" class="text-blue-600 hover:text-blue-900 ml-4 cursor-pointer">Duplicate</button>
                  <button @click="openDeleteModal(q)" class="text-red-600 hover:text-red-900 ml-4 cursor-pointer">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>

    <!-- Modals -->
    <transition name="fade">
      <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full">
          <h3 class="text-lg font-medium text-gray-900">Delete Questionnaire</h3>
          <p class="mt-2 text-sm text-gray-600">
            Are you sure you want to delete "<strong>{{ questionnaireToAction.name }}</strong>"? This will also delete all of its questions. This action cannot be undone.
          </p>
          <div class="mt-4 flex justify-end space-x-2">
            <button @click="closeModals" class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 cursor-pointer">Cancel</button>
            <button @click="confirmDelete" class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 cursor-pointer">Delete</button>
          </div>
        </div>
      </div>
    </transition>

    <transition name="fade">
      <div v-if="showDuplicateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full">
          <h3 class="text-lg font-medium text-gray-900">Duplicate Questionnaire</h3>
          <p class="mt-2 text-sm text-gray-600">
            Are you sure you want to duplicate "<strong>{{ questionnaireToAction.name }}</strong>"? A new draft copy will be created.
          </p>
          <div class="mt-4 flex justify-end space-x-2">
            <button @click="closeModals" class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 cursor-pointer">Cancel</button>
            <button @click="confirmDuplicate" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer">Duplicate</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Welcome Modal: Displays a welcome message when the dashboard is loaded -->
    <!-- Using flash-out-fade transition for the modal overlay and content -->
    <transition name="flash-out-fade" @after-leave="showWelcomeModal = false">
      <div
        v-if="showWelcomeModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      >
        <div
          class="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center relative transform transition-all duration-300 scale-100 opacity-100"
        >
          <!-- Close button for the modal -->
          <button
            @click="showWelcomeModal = false"
            class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
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
          <!-- Modal Heading: Updated for Admin context -->
          <h3 class="text-3xl font-bold text-blue-600 mb-4">Admin Access Granted!</h3>
          <!-- Modal Body Text -->
          <p class="text-gray-700 mb-6">
            Manage users, businesses, and questionnaires from this powerful dashboard.
          </p>
          <!-- Continue Button to close the modal -->
          <button
            @click="showWelcomeModal = false"
            class="bg-blue-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-blue-700 transition-colors duration-200 cursor-pointer"
          >
            Continue
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
/*
  Scoped styles for the flash-out-fade transition specific to this component.
  This defines how the modal will fade out.
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
</style>