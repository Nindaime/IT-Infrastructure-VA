<!-- src/views/AdminDashboardPage.vue -->
<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { mockRankings, mockQuestions } from '@/api/mockData'; // Assuming these are still used for admin context

// Initialize the router for navigation
const router = useRouter();

// Props received from the parent component (e.g., App.vue)
const props = defineProps({
    isLoggedIn: Boolean,
    isAdmin: Boolean
});

// Reactive state for showing/hiding the welcome modal
const showWelcomeModal = ref(true);

// Mock data for admin dashboard
const totalUsers = ref(150);
const activeAssessments = ref(25);
const pendingApprovals = ref(5);

// Mock list of all businesses/clients (could be fetched from backend)
const businesses = ref(mockRankings.map(r => ({ ...r, id: r.rank, status: r.score > 70 ? 'Active' : 'Needs Attention' })));

// Mock list of questionnaires (editable by admin)
const questionnaires = ref([
    { id: 1, name: 'Standard ITIVA Assessment', questionsCount: mockQuestions.length, lastUpdated: '2024-05-01', status: 'Active' },
    { id: 2, name: 'Advanced Cloud Security Check', questionsCount: 15, lastUpdated: '2024-04-10', status: 'Active' },
    { id: 3, name: 'GDPR Compliance Audit', questionsCount: 10, lastUpdated: '2024-03-20', status: 'Draft' },
]);

// Reactive state for search and sort
const searchTerm = ref('');
const sortKey = ref('name'); // 'name', 'location', 'type', 'score'
const sortOrder = ref(1); // 1 for ascending, -1 for descending

// Computed property for filtered and sorted businesses
const filteredAndSortedBusinesses = computed(() => {
    let filtered = businesses.value;

    // Apply search filter
    if (searchTerm.value) {
        const lowerCaseSearchTerm = searchTerm.value.toLowerCase();
        filtered = filtered.filter(biz =>
            biz.name.toLowerCase().includes(lowerCaseSearchTerm) ||
            biz.location.toLowerCase().includes(lowerCaseSearchTerm) ||
            biz.type.toLowerCase().includes(lowerCaseSearchTerm)
        );
    }

    // Apply sorting
    return filtered.sort((a, b) => {
        let valA = a[sortKey.value];
        let valB = b[sortKey.value];

        // Handle string comparison
        if (typeof valA === 'string' && typeof valB === 'string') {
            return valA.localeCompare(valB) * sortOrder.value;
        }
        // Handle numeric comparison
        return (valA - valB) * sortOrder.value;
    });
});

/**
 * Toggles the sort order when a sort key is clicked.
 * @param {string} key The key to sort by.
 */
function toggleSort(key) {
    if (sortKey.value === key) {
        sortOrder.value *= -1; // Reverse order if same key clicked again
    } else {
        sortKey.value = key; // Set new sort key
        sortOrder.value = 1; // Default to ascending for new key
    }
}

/**
 * Navigates to the report viewer page for a specific business.
 * @param {object} biz The business object whose report is to be viewed.
 */
function viewReport(biz) {
    router.push({ name: 'ReportViewerPage', params: { report: JSON.stringify(biz.report), name: biz.name } });
}

/**
 * Navigates to the edit questionnaire page for a specific questionnaire.
 * @param {object} questionnaire The questionnaire object to be edited.
 */
function editQuestionnaire(questionnaire) {
    router.push({ name: 'EditQuestionnairePage', params: { questionnaireId: questionnaire.id } });
}

/**
 * Handles adding a new questionnaire.
 */
function addNewQuestionnaire() {
    router.push({ name: 'EditQuestionnairePage', params: { questionnaireId: 'new' } });
}

/**
 * Logs out the admin and navigates to the home page.
 */
function logout() {
    // This should ideally trigger an event to the parent App.vue to handle actual logout logic
    router.push('/'); // Navigate to home page
    console.log('Admin logged out');
}

/**
 * Closes the welcome modal.
 */
function closeWelcomeModal() {
    showWelcomeModal.value = false;
}
</script>

<template>
    <div class="min-h-screen bg-gray-100 font-sans">
        <!-- Top Navigation / Header -->
        <header class="bg-white shadow-sm py-4 px-6 flex justify-between items-center sticky top-0 z-20">
            <div class="flex items-center">
                <router-link to="/" class="text-2xl font-extrabold text-blue-600">ITIVA Admin</router-link>
            </div>
            <nav class="flex items-center space-x-4">
                <button @click="addNewQuestionnaire" class="px-4 py-2 rounded-md text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-colors">
                    Add New Questionnaire
                </button>
                <button @click="logout" class="px-4 py-2 rounded-md text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors">
                    Logout
                </button>
            </nav>
        </header>

        <!-- Main Content Area -->
        <main class="container mx-auto px-6 py-8">
            <h1 class="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

            <!-- Overview Cards -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div class="bg-white rounded-lg shadow p-6 text-center">
                    <h3 class="text-xl font-semibold text-gray-700 mb-2">Total Users</h3>
                    <p class="text-5xl font-extrabold text-blue-600">{{ totalUsers }}</p>
                </div>
                <div class="bg-white rounded-lg shadow p-6 text-center">
                    <h3 class="text-xl font-semibold text-gray-700 mb-2">Active Assessments</h3>
                    <p class="text-5xl font-extrabold text-purple-600">{{ activeAssessments }}</p>
                </div>
                <div class="bg-white rounded-lg shadow p-6 text-center">
                    <h3 class="text-xl font-semibold text-gray-700 mb-2">Pending Approvals</h3>
                    <p class="text-5xl font-extrabold text-yellow-600">{{ pendingApprovals }}</p>
                </div>
            </div>

            <!-- Business Management Section -->
            <section class="bg-white rounded-lg shadow p-6 mb-8">
                <h2 class="text-2xl font-semibold text-gray-800 mb-4">Business Management</h2>
                <div class="mb-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <input type="text" v-model="searchTerm" placeholder="Search businesses..."
                        class="w-full sm:w-1/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                    <div class="flex items-center flex-wrap gap-2">
                        <span class="mr-2 text-sm font-medium">Sort by:</span>
                        <button @click="toggleSort('name')" :class="['px-3 py-1 text-sm rounded-full', sortKey === 'name' ? 'bg-blue-600 text-white' : 'bg-gray-200']">
                            Name
                            <span v-if="sortKey === 'name'">{{ sortOrder === 1 ? ' ▲' : ' ▼' }}</span>
                        </button>
                        <button @click="toggleSort('location')" :class="['px-3 py-1 text-sm rounded-full', sortKey === 'location' ? 'bg-blue-600 text-white' : 'bg-gray-200']">
                            Location
                            <span v-if="sortKey === 'location'">{{ sortOrder === 1 ? ' ▲' : ' ▼' }}</span>
                        </button>
                        <button @click="toggleSort('type')" :class="['px-3 py-1 text-sm rounded-full', sortKey === 'type' ? 'bg-blue-600 text-white' : 'bg-gray-200']">
                            Type
                            <span v-if="sortKey === 'type'">{{ sortOrder === 1 ? ' ▲' : ' ▼' }}</span>
                        </button>
                        <button @click="toggleSort('score')" :class="['px-3 py-1 text-sm rounded-full', sortKey === 'score' ? 'bg-blue-600 text-white' : 'bg-gray-200']">
                            Score
                            <span v-if="sortKey === 'score'">{{ sortOrder === 1 ? ' ▲' : ' ▼' }}</span>
                        </button>
                    </div>
                </div>
                <div class="h-96 overflow-y-auto custom-scrollbar">
                    <ul class="space-y-3">
                        <li v-for="biz in filteredAndSortedBusinesses" :key="biz.rank" @click="viewReport(biz)"
                            class="p-4 rounded-lg hover:bg-gray-50 cursor-pointer flex items-center justify-between border border-gray-200 transition-colors duration-200">
                            <div class="flex items-center">
                                <span class="font-bold text-gray-400 mr-4 w-6 text-center">{{ biz.rank }}</span>
                                <div>
                                    <p class="font-bold text-gray-900 text-lg">{{ biz.name }}</p>
                                    <p class="text-sm text-gray-600">{{ biz.location }} - {{ biz.type }}</p>
                                </div>
                            </div>
                            <div class="flex items-center space-x-4">
                                <span class="font-extrabold text-xl"
                                    :class="biz.score > 75 ? 'text-green-600' : biz.score > 50 ? 'text-yellow-600' : 'text-red-600'">
                                    {{ biz.score }}
                                </span>
                                <span :class="['px-3 py-1 text-xs font-semibold rounded-full',
                                    biz.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800']">
                                    {{ biz.status }}
                                </span>
                            </div>
                        </li>
                    </ul>
                </div>
            </section>

            <!-- Questionnaire Management Section -->
            <section class="bg-white rounded-lg shadow p-6">
                <h2 class="text-2xl font-semibold text-gray-800 mb-4">Questionnaire Management</h2>
                <div class="mb-4">
                    <button @click="addNewQuestionnaire"
                        class="px-5 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition-colors">
                        Create New Questionnaire
                    </button>
                </div>
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Questions
                                </th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Last Updated
                                </th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                                    <span :class="['px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                                        q.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800']">
                                        {{ q.status }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button @click="editQuestionnaire(q)" class="text-indigo-600 hover:text-indigo-900 transition-colors">
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </main>

        <!-- Welcome Modal -->
        <div v-if="showWelcomeModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div class="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center relative transform transition-all duration-300 scale-100 opacity-100">
                <button @click="closeWelcomeModal" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
                <h3 class="text-3xl font-bold text-blue-600 mb-4">Admin Access Granted!</h3>
                <p class="text-gray-700 mb-6">
                    Manage users, businesses, and questionnaires from this powerful dashboard.
                </p>
                <button @click="closeWelcomeModal" class="bg-blue-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-blue-700 transition-colors">
                    Continue
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