<!-- src/views/QuestionnairePage.vue -->
<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { fullQuestionnaireData } from '@/api/mockData' // Using the new detailed questionnaire data
import { useReportsStore } from '@/stores/reports' // Import the reports store
import { useAssessmentStore } from '@/stores/assessment' // Import the assessment store
import { useAuthStore } from '@/stores/auth' // Import the auth store
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'

const router = useRouter()
const route = useRoute()

// --- State Management ---
const questions = ref(fullQuestionnaireData)
const answers = ref(
  // Initialize answers object with empty strings for each question ID
  questions.value.reduce((acc, q) => {
    acc[q.id] = null
    return acc
  }, {}),
)
const currentQuestionIndex = ref(0)
const isLoading = ref(false)
const showSuccessModal = ref(false)
const showSwitchConfirmModal = ref(false)
const showReportNameModal = ref(false)
const newReportName = ref('')
const targetAssessmentType = ref('')

// Initialize the auth store
const authStore = useAuthStore()
const assessmentStore = useAssessmentStore()
const reportsStore = useReportsStore()

const assessmentType = ref('') // Will be set from route params

// Add original index to each question for robust progress calculation
const questionsWithIndex = ref(questions.value.map((q, index) => ({ ...q, originalIndex: index })))

// Define styles for each category progress bar for better visual distinction
const categoryStyles = {
  'Website Strength': { color: 'bg-blue-500' },
  'Devices & Network': { color: 'bg-green-500' },
  'Compliance & Documentation': { color: 'bg-purple-500' },
  'Cyber Security Implementations': { color: 'bg-red-500' },
}
const defaultCategoryStyle = { color: 'bg-gray-500' }

// --- Lifecycle Hooks ---
onMounted(() => {
  // Set the assessment type from the route parameter if it exists
  if (route.params.type) {
    assessmentType.value = route.params.type
    console.log('Assessment Type:', assessmentType.value)
  }
})

watch(
  () => route.params.type,
  (newType) => {
    if (newType && newType !== assessmentType.value) {
      assessmentType.value = newType
      resetState()
    }
  },
  { immediate: true }, // Ensure watcher runs on initial component mount
)

// --- Computed Properties ---
const currentQuestion = computed(() => questions.value[currentQuestionIndex.value])
const totalQuestions = computed(() => questions.value.length)
const isLastQuestion = computed(() => currentQuestionIndex.value === totalQuestions.value - 1)
const isFirstQuestion = computed(() => currentQuestionIndex.value === 0)

const questionsByCategory = computed(() => {
  // Group questions by category using the indexed list
  return questionsWithIndex.value.reduce((acc, question) => {
    if (!acc[question.category]) {
      acc[question.category] = []
    }
    acc[question.category].push(question)
    return acc
  }, {})
})

const categories = computed(() => Object.keys(questionsByCategory.value))

const pageTitle = computed(() => {
  // const baseTitle = 'IT Vulnerability Assessment'
  // const type = route.params.type
  // Construct the title like "IT Vulnerability Assessment (Full Assessment)"
  // return type ? `${baseTitle} (${type})` : baseTitle
  // Use the reactive assessmentType state, which is the single source of truth.
  return assessmentType.value || 'Standard ITIVA Assessment'
})

// --- Progress Bar Logic ---
function getCategoryProgress(categoryName) {
  const categoryQuestions = questionsByCategory.value[categoryName]
  // const categoryStartIndex = questions.value.findIndex((q) => q.category === categoryName)

  // if (currentQuestionIndex.value < categoryStartIndex) return 0

  // const categoryEndIndex = categoryStartIndex + categoryQuestions.length - 1
  // if (currentQuestionIndex.value >= categoryEndIndex) return 100

  // const questionsCompletedInCategory = currentQuestionIndex.value - categoryStartIndex + 1
  // return (questionsCompletedInCategory / categoryQuestions.length) * 100
  if (!categoryQuestions || categoryQuestions.length === 0) return 0

  // Count how many questions in this category have an index less than or equal to the current one.
  const questionsCompleted = categoryQuestions.filter(
    (q) => q.originalIndex <= currentQuestionIndex.value,
  ).length

  return (questionsCompleted / categoryQuestions.length) * 100
}

// --- Methods ---
/**
 * Generates a mock report object based on the user's answers.
 * This function calculates scores for each category and an overall score.
 * @returns {object} A report object with overall, ws, dn, cd, and cs scores.
 */
function generateReportFromAnswers() {
  const allRecommendations = []
  const categoryResults = {}

  console.log('--- Generating Report from Answers ---')

  // Group questions by category first
  const questionsByCategory = questions.value.reduce((acc, q) => {
    if (!acc[q.category]) acc[q.category] = []
    acc[q.category].push(q)
    return acc
  }, {})

  // Process each category
  for (const categoryName in questionsByCategory) {
    const categoryQuestions = questionsByCategory[categoryName]
    const questionCount = categoryQuestions.length
    if (questionCount === 0) continue

    const maxImpactPerQuestion = 100 / questionCount
    let categoryTotalScore = 0

    console.log(
      `Processing category: "${categoryName}" with ${questionCount} questions. Max impact/q: ${maxImpactPerQuestion.toFixed(2)}`,
    )

    categoryQuestions.forEach((q) => {
      const selectedOption = answers.value[q.id]
      let questionScore = 0 // Default score if no valid answer
      const impactValue = selectedOption ? parseFloat(selectedOption.score) : NaN

      // Check if the parsed impact is a valid number
      if (!isNaN(impactValue)) {
        // Normalize impact from [-2, 2] range to [0, 1] range
        const normalizedImpact = (impactValue + 2) / 4
        questionScore = normalizedImpact * maxImpactPerQuestion

        // If the answer is not perfect, generate a recommendation
        if (impactValue < 2) {
          allRecommendations.push({
            text: selectedOption.recommendation,
            category: q.category,
            // The impact is the potential score gain
            impactScore: Math.round(maxImpactPerQuestion - questionScore),
          })
        }
      }
      categoryTotalScore += questionScore
    })

    categoryResults[categoryName] = Math.round(categoryTotalScore)
  }

  // Sort recommendations by the highest impact (most points lost) and take the top 3
  const fullRecommendations = allRecommendations.sort((a, b) => b.impactScore - a.impactScore)

  const ws = categoryResults['Website Strength'] || 0
  const dn = categoryResults['Devices & Network'] || 0
  const cd = categoryResults['Compliance Documentation'] || 0
  const cs = categoryResults['Cyber Security Implementations'] || 0
  const overall = Math.round((ws + dn + cd + cs) / 4)

  return { overall, ws, dn, cd, cs, recommendations: fullRecommendations }
}

function resetState() {
  currentQuestionIndex.value = 0
  answers.value = questions.value.reduce((acc, q) => {
    acc[q.id] = null
    return acc
  }, {})
  // Reset other relevant state if any
}

function nextQuestion() {
  if (!isLastQuestion.value) {
    currentQuestionIndex.value++
  }
}

function prevQuestion() {
  if (!isFirstQuestion.value) {
    currentQuestionIndex.value--
  }
}

function selectAnswer(option) {
  answers.value[currentQuestion.value.id] = option // option is now an object
  setTimeout(() => {
    if (!isLastQuestion.value) {
      nextQuestion()
    }
  }, 300)
}

function submitAssessment() {
  // First, show the modal to get the report name
  showReportNameModal.value = true
}

async function handleReportNameSubmission() {
  if (!newReportName.value.trim()) {
    // Optionally, show an error message if the name is empty
    alert('Please enter a name for your report.')
    return
  }

  const reportName = newReportName.value.trim()
  showReportNameModal.value = false

  // Show loading/success modal
  isLoading.value = true
  await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate processing
  isLoading.value = false
  showSuccessModal.value = true

  // Generate report and update stores
  const report = generateReportFromAnswers()
  assessmentStore.setGeneratedReport(report, reportName, assessmentType.value)
  reportsStore.addReport({
    name: reportName,
    date: new Date().toISOString().split('T')[0],
    type: assessmentType.value,
    score: report.overall,
    report: report,
  })

  // Wait for success modal to be visible, then navigate
  await new Promise((resolve) => setTimeout(resolve, 2000))
  router.push({ name: 'ReportViewerPage' })
}

function promptSwitchAssessment(type) {
  if (type !== assessmentType.value) {
    targetAssessmentType.value = type
    showSwitchConfirmModal.value = true
  }
}

function executeSwitchAssessment() {
  showSwitchConfirmModal.value = false
  router.push({ name: 'questionnaire', params: { type: targetAssessmentType.value } })
  console.log('Switching to:', targetAssessmentType.value)
}

function cancelSwitch() {
  showSwitchConfirmModal.value = false
}
</script>

<template>
  <div class="flex flex-col min-h-screen bg-gray-100">
    <!-- The unified header is used here, with 'New Assessment' hidden -->
    <AppHeader
      :user-name="authStore.userName"
      :show-new-assessment="false"
      :assessment-type="assessmentType"
      :show-assessment-type-menu="true"
      @change-assessment="promptSwitchAssessment"
    />

    <main class="flex-grow flex items-center justify-center p-4">
      <div class="w-full max-w-3xl bg-white rounded-2xl shadow-2xl p-6 md:p-10 my-8">
        <!-- Header Section -->
        <div class="text-center mb-8">
          <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 break-words">
            {{ pageTitle }}
          </h1>
          <p class="text-gray-500 mt-2">
            Question {{ currentQuestionIndex + 1 }} of {{ totalQuestions }}
          </p>
        </div>

        <!-- Segmented Progress Bar -->
        <div class="mb-10">
          <div class="flex w-full h-3 rounded-full overflow-hidden bg-gray-200">
            <div
              v-for="category in categories"
              :key="category"
              class="h-full"
              :style="{
                width: (questionsByCategory[category].length / totalQuestions) * 100 + '%',
              }"
            >
              <div
                class="h-full transition-all duration-500 ease-out"
                :class="(categoryStyles[category] || defaultCategoryStyle).color"
                :style="{ width: `${getCategoryProgress(category)}%` }"
              ></div>
            </div>
          </div>
          <div class="flex justify-between mt-2 text-xs font-semibold text-gray-500">
            <span
              v-for="category in categories"
              :key="`label-${category}`"
              class="flex-1 text-center px-1"
            >
              {{ category }}
            </span>
          </div>
        </div>

        <!-- Questionnaire Container -->
        <div class="relative pr-2">
          <transition name="fade" mode="out-in">
            <div :key="currentQuestion.id">
              <h2 class="text-xl md:text-2xl font-semibold text-gray-700 mb-6 leading-tight">
                {{ currentQuestion.text }}
              </h2>
              <div class="space-y-4">
                <button
                  v-for="option in currentQuestion.options"
                  :key="option.text"
                  @click="selectAnswer(option)"
                  class="w-full cursor-pointer text-left p-4 border-2 rounded-lg text-gray-700 transition-all duration-200 flex items-center justify-between"
                  :class="{
                    'bg-blue-100 border-blue-500 shadow-md': answers[currentQuestion.id] === option,
                    'hover:bg-gray-100 hover:border-gray-400 border-gray-300':
                      answers[currentQuestion.id] !== option,
                  }"
                >
                  <span class="flex-1 mr-4">{{ option.text }}</span>
                  <div class="relative group flex-shrink-0">
                    <svg
                      class="w-6 h-6 text-gray-400 group-hover:text-blue-600 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    <div
                      class="absolute bottom-full right-0 mb-2 w-72 p-3 text-sm text-white bg-gray-800 rounded-lg opacity-0 group-hover:opacity-95 transition-opacity duration-300 pointer-events-none z-10"
                    >
                      {{ option.explanation }}
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </transition>
        </div>

        <!-- Navigation Buttons -->
        <div class="flex justify-between items-center mt-8 pt-6 border-t">
          <button
            @click="prevQuestion"
            :disabled="isFirstQuestion"
            class="px-6 py-2 cursor-pointer font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          <button
            v-if="!isLastQuestion"
            @click="nextQuestion"
            class="px-6 py-2 cursor-pointer font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
          >
            Next
          </button>

          <button
            v-if="isLastQuestion"
            @click="submitAssessment"
            class="px-6 py-2 cursor-pointer font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
          >
            Submit Assessment
          </button>
        </div>
      </div>
    </main>

    <!-- Success Modal -->
    <transition name="fade">
      <div
        v-if="showSuccessModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      >
        <div class="bg-white rounded-lg shadow-xl p-8 max-w-sm w-full text-center">
          <h3 class="text-2xl font-bold text-green-600 mb-4">Assessment Complete!</h3>
          <p class="text-gray-700 mb-6">
            Your report is being generated. Redirecting to your report...
          </p>
        </div>
      </div>
    </transition>

    <!-- Report Name Modal -->
    <transition name="fade">
      <div
        v-if="showReportNameModal"
        class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50"
      >
        <div class="bg-white rounded-lg shadow-xl p-6 max-w-md w-full relative">
          <h3 class="text-xl font-bold text-gray-800 mb-4">Name Your Report</h3>
          <p class="text-gray-600 mb-6">
            Please provide a name for this assessment report to easily identify it later.
          </p>
          <form @submit.prevent="handleReportNameSubmission">
            <input
              type="text"
              v-model="newReportName"
              placeholder="e.g., Q2 Security Audit"
              maxlength="30"
              class="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 mb-6"
              required
            />
            <div class="flex justify-end space-x-4">
              <button
                type="button"
                @click="showReportNameModal = false"
                class="px-6 py-2 cursor-pointer font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="px-6 py-2 cursor-pointer font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
              >
                Generate Report
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>

    <!-- Switch Confirmation Modal -->
    <transition name="fade">
      <div
        v-if="showSwitchConfirmModal"
        class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50"
      >
        <div class="bg-white rounded-lg shadow-xl p-6 max-w-md w-full relative">
          <button
            @click="cancelSwitch"
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
          <h3 class="text-xl font-bold text-gray-800 mb-4">Switch Assessment?</h3>
          <p class="text-gray-600 mb-6">
            You are about to switch to a different assessment. Your current progress will be lost.
            Are you sure?
          </p>
          <div class="flex justify-end space-x-4">
            <button
              @click="cancelSwitch"
              class="px-6 py-2 cursor-pointer font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="executeSwitchAssessment"
              class="px-6 py-2 cursor-pointer font-semibold text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
            >
              Yes, Switch
            </button>
          </div>
        </div>
      </div>
    </transition>

    <AppFooter />
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

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #a8a8a8;
  border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #888;
}
</style>
