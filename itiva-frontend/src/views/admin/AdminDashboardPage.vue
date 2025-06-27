<!-- src/views/admin/AdminDashboardPage.vue - Updated as per requirements -->
<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth' // Import the auth store
import { useRouter, RouterLink } from 'vue-router' // Import RouterLink for navigation
import { mockRankings, fullQuestionnaireData } from '@/api/mockData' // Using mock data

// Initialize the router for navigation
const router = useRouter()

// Mock data for admin dashboard overview
const totalUsers = ref(150)
const activeAssessments = ref(25)

// Initialize the auth store
const authStore = useAuthStore()
const pendingApprovals = ref(5)

// Mock list of all businesses/clients (could be fetched from backend)
const businesses = ref(
  mockRankings.map((r) => ({
    ...r,
    id: r.rank, // Ensure unique ID for iteration
    status: r.score > 70 ? 'Active' : 'Needs Attention',
    // Add category scores directly from report for progress bars
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

// Reactive state for selected business to show category scores on the right side
const selectedBusinessForScores = ref(businesses.value.length > 0 ? businesses.value[0] : null)

// Mock list of questionnaires (editable by admin)
const questionnaires = ref([
  {
    id: 1,
    name: 'Standard ITIVA Assessment',
    questionsCount: fullQuestionnaireData.length,
    lastUpdated: '2024-05-01',
    status: 'Active',
  },
  {
    id: 2,
    name: 'Advanced Cloud Security Check',
    questionsCount: 15,
    lastUpdated: '2024-04-10',
    status: 'Active',
  },
  {
    id: 3,
    name: 'GDPR Compliance Audit',
    questionsCount: 10,
    lastUpdated: '2024-03-20',
    status: 'Draft',
  },
])

// Reactive state for search and sort for business list
const searchTerm = ref('')
const sortKey = ref('score') // Default sort key is 'score'
const sortOrder = ref(0) // 0 for descending, 1 for ascending

// Computed property for filtered and sorted businesses in the list
const filteredAndSortedBusinesses = computed(() => {
  let filtered = businesses.value

  // Apply search filter
  if (searchTerm.value) {
    const lowerCaseSearchTerm = searchTerm.value.toLowerCase()
    filtered = filtered.filter(
      (biz) =>
        biz.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        biz.location.toLowerCase().includes(lowerCaseSearchTerm) ||
        biz.type.toLowerCase().includes(lowerCaseSearchTerm),
    )
  }

  // Apply sorting
  return filtered.sort((a, b) => {
    let valA = a[sortKey.value]
    let valB = b[sortKey.value]
    if (typeof valA === 'string' && typeof valB === 'string') {
      return valA.localeCompare(valB) * (sortOrder.value === 0 ? -1 : 1)
    }
    return (valA - valB) * (sortOrder.value === 0 ? -1 : 1)
  })
})

/**
 * Toggles the sort order when a sort key is clicked.
 * @param {string} key The key to sort by.
 */
function toggleSort(key) {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 0 ? 1 : 0 // Toggle between 0 and 1
  } else {
    sortKey.value = key
    sortOrder.value = 0 // Default to descending for new key
  }
}

/**
 * Sets the selected business for displaying category scores.
 * @param {object} biz The business object to select.
 */
function selectBusinessForScores(biz) {
  selectedBusinessForScores.value = biz
}

/**
 * Navigates to the edit questionnaire page for a specific questionnaire.
 * @param {object} questionnaire The questionnaire object to be edited.
 */
function editQuestionnaire(questionnaire) {
  router.push({ name: 'adminQuestionnaire', params: { questionnaireId: questionnaire.id } })
}

/**
 * Handles adding a new questionnaire.
 */
function addNewQuestionnaire() {
  router.push({ name: 'adminQuestionnaire', params: { questionnaireId: 'new' } })
}

/**
 * Logs out the admin and navigates to the home page.
 */
function logout() {
  console.log('Admin logged out')
  authStore.logout() // Use the store's logout action
  router.push('/login') // Redirect to login page after logout
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
          class="px-4 py-2 cursor-pointer rounded-md text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-colors duration-200"
        >
          Add New Questionnaire
        </button>
        <button
          @click="logout"
          class="px-4 py-2 cursor-pointer rounded-md text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
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
                'px-3 py-1 text-sm rounded-full',
                sortKey === 'score' ? 'bg-blue-600 text-white' : 'bg-gray-200',
              ]"
            >
              Score
              <span v-if="sortKey === 'score'">{{ sortOrder === 0 ? ' ▲' : ' ▼' }}</span>
            </button>
            <button
              @click="toggleSort('name')"
              :class="[
                'px-3 py-1 text-sm rounded-full',
                sortKey === 'name' ? 'bg-blue-600 text-white' : 'bg-gray-200',
              ]"
            >
              Name
              <span v-if="sortKey === 'name'">{{ sortOrder === 0 ? ' ▲' : ' ▼' }}</span>
            </button>
            <button
              @click="toggleSort('location')"
              :class="[
                'px-3 py-1 text-sm rounded-full',
                sortKey === 'location' ? 'bg-blue-600 text-white' : 'bg-gray-200',
              ]"
            >
              Location
              <span v-if="sortKey === 'location'">{{ sortOrder === 0 ? ' ▲' : ' ▼' }}</span>
            </button>
            <button
              @click="toggleSort('type')"
              :class="[
                'px-3 py-1 text-sm rounded-full',
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
            class="px-5 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition-colors duration-200"
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
                <th scope="col" class="relative px-6 py-3">
                  <span class="sr-only">Edit</span>
                </th>
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
                  {{ q.lastUpdated }}
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
                  <button
                    @click="editQuestionnaire(q)"
                    class="text-indigo-600 hover:text-indigo-900 transition-colors duration-200"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
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
