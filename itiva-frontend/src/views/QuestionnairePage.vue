<!-- src/views/QuestionnairePage.vue -->
<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { mockQuestions } from '@/api/mockData';

// Initialize the router for navigation
const router = useRouter();

// Props received from the parent component (e.g., App.vue)
const props = defineProps({
    payload: Object // Expects { questionnaireId: ..., businessName: ... }
});

// Reactive state for the list of questions
const questions = ref(mockQuestions);

// Reactive state to store user's answers.
// Initialized with empty strings for each question ID.
const answers = ref(
    questions.value.reduce((acc, q) => {
        acc[q.id] = ''; // Initialize answer for each question
        return acc;
    }, {})
);

// Reactive state for tracking the current question index
const currentQuestionIndex = ref(0);

// Reactive state to show loading indicator during assessment submission
const isLoading = ref(false);

// Reactive state to show submission success message
const showSuccessModal = ref(false);

// Computed property to get the current question being displayed
const currentQuestion = computed(() => {
    return questions.value[currentQuestionIndex.value];
});

// Computed property to check if all questions have been answered
const allQuestionsAnswered = computed(() => {
    return Object.values(answers.value).every(answer => answer !== '');
});

// Computed property to check if it's the first question
const isFirstQuestion = computed(() => currentQuestionIndex.value === 0);

// Computed property to check if it's the last question
const isLastQuestion = computed(() => currentQuestionIndex.value === questions.value.length - 1);

/**
 * Moves to the next question in the questionnaire.
 */
function nextQuestion() {
    if (currentQuestionIndex.value < questions.value.length - 1) {
        currentQuestionIndex.value++;
    }
}

/**
 * Moves to the previous question in the questionnaire.
 */
function prevQuestion() {
    if (currentQuestionIndex.value > 0) {
        currentQuestionIndex.value--;
    }
}

/**
 * Handles the submission of the questionnaire.
 * Simulates an API call and then navigates to the report viewer page.
 */
async function submitAssessment() {
    if (!allQuestionsAnswered.value) {
        // In a real app, you might show a more user-friendly message
        console.warn('Please answer all questions before submitting.');
        return;
    }

    isLoading.value = true;
    try {
        // Simulate an API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // In a real application, you would send 'answers.value' to your Django backend
        // and receive a generated report. For now, we'll use a mock report.
        console.log('Assessment Submitted:', answers.value);

        // Simulate a generated report
        const simulatedReport = {
            overall: Math.floor(Math.random() * 40) + 50, // Score between 50-90
            ws: Math.floor(Math.random() * 30) + 60,
            dn: Math.floor(Math.random() * 30) + 60,
            cd: Math.floor(Math.random() * 30) + 60,
            cs: Math.floor(Math.random() * 30) + 60,
        };

        showSuccessModal.value = true; // Show success modal

        // After a short delay, navigate to the report viewer
        setTimeout(() => {
            router.push({
                name: 'ReportViewerPage',
                params: {
                    report: JSON.stringify(simulatedReport),
                    name: props.payload?.businessName || 'Your Business'
                }
            });
            showSuccessModal.value = false;
        }, 2000); // Wait 2 seconds to show the modal before navigating

    } catch (error) {
        console.error('Error submitting assessment:', error);
        // Handle error (e.g., show error message to user)
    } finally {
        isLoading.value = false;
    }
}

/**
 * Closes the success modal.
 */
function closeSuccessModal() {
    showSuccessModal.value = false;
}
</script>

<template>
    <div class="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6 font-sans">
        <div class="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <h1 class="text-3xl md:text-4xl font-bold text-center text-blue-700 mb-8">
                IT Vulnerability Assessment Questionnaire
            </h1>

            <div v-if="currentQuestion" class="mb-8">
                <p class="text-lg text-gray-600 mb-2 text-center">
                    Question {{ currentQuestionIndex + 1 }} of {{ questions.length }}
                </p>
                <div class="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                    <div class="bg-blue-600 h-2.5 rounded-full"
                        :style="{ width: ((currentQuestionIndex + 1) / questions.length) * 100 + '%' }"></div>
                </div>

                <h2 class="text-2xl font-semibold text-gray-800 mb-6 text-center">
                    {{ currentQuestion.text }}
                </h2>

                <div class="space-y-4">
                    <div v-for="(option, index) in currentQuestion.options" :key="index"
                        class="relative flex items-center bg-gray-50 p-4 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors duration-200">
                        <input :id="`question-${currentQuestion.id}-option-${index}`"
                               :name="`question-${currentQuestion.id}`"
                               type="radio"
                               :value="option"
                               v-model="answers[currentQuestion.id]"
                               class="focus:ring-blue-500 h-5 w-5 text-blue-600 border-gray-300 cursor-pointer">
                        <label :for="`question-${currentQuestion.id}-option-${index}`" class="ml-3 block text-base font-medium text-gray-800 flex-grow cursor-pointer">
                            {{ option }}
                        </label>
                    </div>
                </div>
            </div>

            <div class="flex justify-between mt-10">
                <button @click="prevQuestion" :disabled="isFirstQuestion"
                    class="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg font-semibold hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200">
                    Previous
                </button>

                <button v-if="!isLastQuestion" @click="nextQuestion"
                    class="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200">
                    Next
                </button>

                <button v-else @click="submitAssessment" :disabled="isLoading || !allQuestionsAnswered"
                    class="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200">
                    <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {{ isLoading ? 'Submitting...' : 'Submit Assessment' }}
                </button>
            </div>
        </div>

        <!-- Success Modal -->
        <div v-if="showSuccessModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div class="bg-white rounded-lg shadow-xl p-8 max-w-sm w-full text-center relative transform transition-all duration-300 scale-100 opacity-100">
                <h3 class="text-3xl font-bold text-green-600 mb-4">Assessment Complete!</h3>
                <p class="text-gray-700 mb-6">
                    Your assessment has been successfully submitted. Redirecting to your report...
                </p>
                <svg class="mx-auto h-20 w-20 text-green-500 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Scoped styles specific to QuestionnairePage */
/* Add any custom styles here if needed, beyond Tailwind CSS */
</style>