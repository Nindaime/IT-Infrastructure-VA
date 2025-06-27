<!-- src/views/EditQuestionnairePage.vue -->
<script setup>
import { ref, watch, computed, onMounted } from 'vue'
// import { useAuthStore } from '@/stores/auth' // Import the auth store
import { useRoute, useRouter } from 'vue-router'
import { fullQuestionnaireData } from '@/api/mockData' // Assuming mockQuestions contains default question structure

// Initialize the route and router for navigation and parameter access
const route = useRoute()
const router = useRouter()

// Props received from the parent, expecting a questionnaireId
const props = defineProps({
  payload: Object, // Expected to contain { questionnaireId: 'new' | existingId }
})

// Initialize the auth store
// const authStore = useAuthStore()

// Reactive state for the questionnaire being edited
const questionnaire = ref({
  id: null,
  name: '',
  status: 'Draft',
  questions: [], // Array to hold question objects
})

// Reactive state for managing the new question input form
const newQuestion = ref({
  category: '',
  text: '',
  options: ['', '', ''], // Start with 3 empty options
})

// Reactive state for displaying messages to the user (e.g., success, error)
const message = ref({ text: '', type: '' }) // type: 'success' or 'error'

// Reactive state for controlling the visibility of the "Add Option" button
const canAddOption = computed(() => {
  return newQuestion.value.options.length < 5 // Max 5 options per question
})

/**
 * Loads a questionnaire based on the ID from the route payload.
 * If 'new', initializes an empty questionnaire.
 * If an ID exists, attempts to load mock data.
 */
function loadQuestionnaire() {
  const qId = route.params.questionnaireId || props.payload?.questionnaireId
  if (qId && qId !== 'new') {
    // Simulate fetching an existing questionnaire
    // In a real app, this would be an API call to your Django backend
    const foundQ = {
      id: qId,
      name: `Custom Questionnaire ${qId}`,
      status: 'Draft',
      questions: fullQuestionnaireData.map((q) => ({ ...q, options: [...q.options] })), // Deep copy options
    }
    questionnaire.value = foundQ
    setMessage('Questionnaire loaded.', 'success')
  } else {
    // Initialize for a new questionnaire
    questionnaire.value = {
      id: null,
      name: '',
      status: 'Draft',
      questions: [],
    }
    setMessage('Creating new questionnaire.', 'info')
  }
}

/**
 * Adds a new empty option field to the new question form.
 */
function addOption() {
  if (canAddOption.value) {
    newQuestion.value.options.push('')
  }
}

/**
 * Removes an option field from the new question form at a specific index.
 * @param {number} index The index of the option to remove.
 */
function removeOption(index) {
  if (newQuestion.value.options.length > 1) {
    // Ensure at least one option remains
    newQuestion.value.options.splice(index, 1)
  }
}

/**
 * Adds the currently defined new question to the questionnaire.
 * Validates that category, text, and at least two non-empty options exist.
 */
function addQuestion() {
  const { category, text, options } = newQuestion.value
  const cleanedOptions = options.filter((opt) => opt.trim() !== '')

  if (!category.trim() || !text.trim() || cleanedOptions.length < 2) {
    setMessage(
      'Please fill in question category, text, and provide at least two valid options.',
      'error',
    )
    return
  }

  const newQ = {
    id:
      questionnaire.value.questions.length > 0
        ? Math.max(...questionnaire.value.questions.map((q) => q.id)) + 1
        : 1,
    category: category.trim(),
    text: text.trim(),
    options: cleanedOptions,
  }
  questionnaire.value.questions.push(newQ)
  resetNewQuestionForm()
  setMessage('Question added successfully!', 'success')
}

/**
 * Removes a question from the questionnaire based on its ID.
 * @param {number} questionId The ID of the question to remove.
 */
function removeQuestion(questionId) {
  questionnaire.value.questions = questionnaire.value.questions.filter((q) => q.id !== questionId)
  setMessage('Question removed.', 'info')
}

/**
 * Resets the new question form fields to their initial empty state.
 */
function resetNewQuestionForm() {
  newQuestion.value = {
    category: '',
    text: '',
    options: ['', '', ''],
  }
}

/**
 * Handles saving the questionnaire.
 * In a real application, this would send data to the backend.
 */
async function saveQuestionnaire() {
  if (!questionnaire.value.name.trim()) {
    setMessage('Questionnaire name cannot be empty.', 'error')
    return
  }
  if (questionnaire.value.questions.length === 0) {
    setMessage('Please add at least one question to the questionnaire.', 'error')
    return
  }

  // Simulate API call
  console.log('Saving questionnaire:', JSON.parse(JSON.stringify(questionnaire.value)))
  setMessage('Saving questionnaire...', 'info')

  try {
    await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate network delay

    // In a real app, integrate with Django backend here
    // e.g., await axios.post('/api/questionnaires/', questionnaire.value);

    setMessage('Questionnaire saved successfully!', 'success')
    // If it's a new questionnaire, you might get an ID back from the backend
    if (!questionnaire.value.id) {
      questionnaire.value.id = Math.floor(Math.random() * 1000) + 100 // Mock ID
    }
  } catch (error) {
    console.error('Error saving questionnaire:', error)
    setMessage('Failed to save questionnaire.', 'error')
  }
}

/**
 * Sets a message to be displayed to the user, with a timeout to clear it.
 * @param {string} text The message text.
 * @param {string} type The type of message ('success', 'error', 'info').
 */
function setMessage(text, type) {
  message.value = { text, type }
  setTimeout(() => {
    message.value = { text: '', type: '' } // Clear message after 3 seconds
  }, 3000)
}

/**
 * Navigates back to the admin dashboard.
 */
function backToDashboard() {
  router.push('/admin/dashboard')
}

// Load questionnaire data when the component mounts
onMounted(loadQuestionnaire)

// Watch for changes in route parameters (e.g., if navigating from 'new' to an existing ID)
watch(
  () => route.params.questionnaireId,
  () => {
    loadQuestionnaire()
  },
)
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex flex-col items-center p-6 font-sans">
    <div class="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-8 md:p-10 my-8">
      <header class="mb-8 text-center">
        <h1 class="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
          {{ questionnaire.id ? 'Edit Questionnaire' : 'Create New Questionnaire' }}
        </h1>
        <p class="text-md text-gray-600">Define and manage your assessment questions.</p>
      </header>

      <!-- Message Display -->
      <div
        v-if="message.text"
        :class="[
          'p-4 mb-6 rounded-lg text-white font-medium',
          message.type === 'success'
            ? 'bg-green-500'
            : message.type === 'error'
              ? 'bg-red-500'
              : 'bg-blue-500',
        ]"
      >
        {{ message.text }}
      </div>

      <!-- Questionnaire Details -->
      <section class="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
        <h2 class="text-2xl font-semibold text-gray-800 mb-4">Questionnaire Details</h2>
        <div class="mb-4">
          <label for="questionnaire-name" class="block text-sm font-medium text-gray-700 mb-1"
            >Questionnaire Name</label
          >
          <input
            type="text"
            id="questionnaire-name"
            v-model="questionnaire.name"
            class="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Annual IT Security Audit"
          />
        </div>
        <div class="mb-4">
          <label for="questionnaire-status" class="block text-sm font-medium text-gray-700 mb-1"
            >Status</label
          >
          <select
            id="questionnaire-status"
            v-model="questionnaire.status"
            class="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="Draft">Draft</option>
            <option value="Active">Active</option>
            <option value="Archived">Archived</option>
          </select>
        </div>
      </section>

      <!-- Current Questions List -->
      <section class="mb-8 p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
        <h2 class="text-2xl font-semibold text-gray-800 mb-4">
          Existing Questions ({{ questionnaire.questions.length }})
        </h2>
        <div
          v-if="questionnaire.questions.length > 0"
          class="space-y-4 custom-scrollbar max-h-80 overflow-y-auto pr-2"
        >
          <div
            v-for="q in questionnaire.questions"
            :key="q.id"
            class="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-start justify-between"
          >
            <div>
              <p class="text-sm font-medium text-blue-600 mb-1">{{ q.category }}</p>
              <p class="text-lg font-medium text-gray-800">{{ q.text }}</p>
              <ul class="text-sm text-gray-600 mt-2 list-disc list-inside">
                <li v-for="(option, idx) in q.options" :key="idx">{{ option }}</li>
              </ul>
            </div>
            <button
              @click="removeQuestion(q.id)"
              class="ml-4 p-2 rounded-full text-red-600 hover:bg-red-100 transition-colors"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                ></path>
              </svg>
            </button>
          </div>
        </div>
        <p v-else class="text-gray-500 text-center py-4">No questions added yet.</p>
      </section>

      <!-- Add New Question Form -->
      <section class="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
        <h2 class="text-2xl font-semibold text-blue-800 mb-4">Add New Question</h2>
        <div class="mb-4">
          <label for="new-question-category" class="block text-sm font-medium text-gray-700 mb-1"
            >Category</label
          >
          <input
            type="text"
            id="new-question-category"
            v-model="newQuestion.category"
            class="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Website Strength"
          />
        </div>
        <div class="mb-4">
          <label for="new-question-text" class="block text-sm font-medium text-gray-700 mb-1"
            >Question Text</label
          >
          <textarea
            id="new-question-text"
            v-model="newQuestion.text"
            rows="3"
            class="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Is your website traffic encrypted using a valid SSL/TLS certificate?"
          ></textarea>
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Options (at least 2)</label>
          <div
            v-for="(option, index) in newQuestion.options"
            :key="index"
            class="flex items-center mb-2"
          >
            <input
              type="text"
              v-model="newQuestion.options[index]"
              class="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              :placeholder="`Option ${index + 1}`"
            />
            <button
              v-if="newQuestion.options.length > 1"
              @click="removeOption(index)"
              class="ml-2 p-2 cursor-pointer rounded-full text-gray-500 hover:bg-gray-200 transition-colors"
            >
              <svg
                class="w-4 h-4"
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
          </div>
          <button
            @click="addOption"
            :disabled="!canAddOption"
            class="mt-2 px-4 py-2 cursor-pointer bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Add Option
          </button>
        </div>
        <button
          @click="addQuestion"
          class="w-full cursor-pointer py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition-colors"
        >
          Add Question to Questionnaire
        </button>
      </section>

      <!-- Action Buttons -->
      <div class="flex justify-between mt-8">
        <button
          @click="backToDashboard"
          class="px-6 py-3 cursor-pointer bg-gray-300 text-gray-800 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
        >
          Back to Dashboard
        </button>
        <button
          @click="saveQuestionnaire"
          class="px-8 py-3 cursor-pointer bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
        >
          Save Questionnaire
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom scrollbar for better aesthetics */
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f0f0f0; /* Light gray track */
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #a0a0a0; /* Darker gray thumb */
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #888; /* Even darker on hover */
}
</style>
