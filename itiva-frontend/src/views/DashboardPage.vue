<!-- src/views/DashboardPage.vue -->
<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { mockRankings } from '@/api/mockData'; // Assuming mockRankings is needed here for user-specific data

// Initialize the router for navigation
const router = useRouter();

// Props received from the parent component (e.g., App.vue)
const props = defineProps({
    isLoggedIn: Boolean,
    isAdmin: Boolean,
    payload: Object // Used to pass data like a selected report or questionnaire ID
});

// Reactive state for the user's name
const userName = ref('John Doe'); // Replace with actual user name from backend later

// Reactive state for showing/hiding the welcome modal
const showWelcomeModal = ref(true);

// Mock user-specific reports (replace with actual data fetched from backend)
const userReports = ref([
    { id: 1, name: 'Q1 2024 IT Security Audit', date: '2024-03-15', score: 78, type: 'Full Assessment', report: mockRankings[4].report },
    { id: 2, name: 'Cloud Infrastructure Review', date: '2024-02-01', score: 85, type: 'Targeted Scan', report: mockRankings[1].report },
    { id: 3, name: 'Network Penetration Test', date: '2024-01-20', score: 62, type: 'Pen Test', report: mockRankings[13].report },
]);

// Reactive state for the currently selected report in the dashboard
const selectedReport = ref(userReports.value[0]);

/**
 * Handles viewing a specific report.
 * @param {object} report The report object to be viewed.
 */
function viewReport(report) {
    selectedReport.value = report;
    // Navigate to the ReportViewerPage, passing the report data
    router.push({ name: 'ReportViewerPage', params: { report: JSON.stringify(report.report), name: report.name } });
}

/**
 * Navigates to the QuestionnairePage to start a new assessment.
 */
function startNewAssessment() {
    router.push('/questionnaire');
}

/**
 * Navigates to the user's profile settings page.
 */
function goToSettings() {
    // Implement navigation to user settings
    console.log('Navigating to user settings');
}

/**
 * Logs out the user and navigates to the home page.
 */
function logout() {
    // This should ideally trigger an event to the parent App.vue to handle actual logout logic
    router.push('/'); // Navigate to home page
    console.log('User logged out');
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
                <router-link to="/" class="text-2xl font-extrabold text-blue-600">ITIVA</router-link>
            </div>
            <nav class="flex items-center space-x-4">
                <button @click="startNewAssessment" class="px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                    New Assessment
                </button>
                <button @click="goToSettings" class="p-2 rounded-full hover:bg-gray-200 transition-colors text-gray-600">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.368 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                </button>
                <button @click="logout" class="px-4 py-2 rounded-md text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors">
                    Logout
                </button>
            </nav>
        </header>

        <!-- Main Content Area -->
        <main class="container mx-auto px-6 py-8">
            <h1 class="text-3xl font-bold text-gray-900 mb-6">Welcome, {{ userName }}!</h1>

            <!-- Dashboard Overview Cards -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div class="bg-white rounded-lg shadow p-6 text-center">
                    <h3 class="text-xl font-semibold text-gray-700 mb-2">Total Assessments</h3>
                    <p class="text-5xl font-extrabold text-blue-600">{{ userReports.length }}</p>
                </div>
                <div class="bg-white rounded-lg shadow p-6 text-center">
                    <h3 class="text-xl font-semibold text-gray-700 mb-2">Average Score</h3>
                    <p class="text-5xl font-extrabold text-green-600">
                        {{ (userReports.reduce((sum, r) => sum + r.score, 0) / userReports.length).toFixed(1) }}
                    </p>
                </div>
                <div class="bg-white rounded-lg shadow p-6 text-center">
                    <h3 class="text-xl font-semibold text-gray-700 mb-2">Last Assessment Date</h3>
                    <p class="text-2xl font-bold text-gray-600">
                        {{ userReports.length > 0 ? userReports[0].date : 'N/A' }}
                    </p>
                </div>
            </div>

            <!-- Recent Reports Section -->
            <section class="bg-white rounded-lg shadow p-6 mb-8">
                <h2 class="text-2xl font-semibold text-gray-800 mb-4">Your Recent Reports</h2>
                <div v-if="userReports.length > 0" class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Report Name
                                </th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Score
                                </th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Type
                                </th>
                                <th scope="col" class="relative px-6 py-3">
                                    <span class="sr-only">View</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr v-for="report in userReports" :key="report.id">
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {{ report.name }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {{ report.date }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-bold"
                                    :class="report.score > 75 ? 'text-green-600' : report.score > 50 ? 'text-yellow-600' : 'text-red-600'">
                                    {{ report.score }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {{ report.type }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button @click="viewReport(report)" class="text-blue-600 hover:text-blue-900 transition-colors">
                                        View Report
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div v-else class="text-center py-8 text-gray-500">
                    <p class="mb-4">No reports found. Start a new assessment to see your vulnerability reports here!</p>
                    <button @click="startNewAssessment" class="bg-blue-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-blue-700 transition-colors">
                        Start New Assessment
                    </button>
                </div>
            </section>

            <!-- Quick Actions Section -->
            <section class="bg-white rounded-lg shadow p-6">
                <h2 class="text-2xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <button @click="startNewAssessment"
                        class="flex flex-col items-center justify-center p-6 bg-blue-50 rounded-lg shadow-sm hover:bg-blue-100 transition-colors duration-200">
                        <svg class="w-12 h-12 text-blue-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v16m8-8H4"></path></svg>
                        <span class="text-lg font-medium text-blue-800">Start New Assessment</span>
                    </button>
                    <button @click="goToSettings"
                        class="flex flex-col items-center justify-center p-6 bg-green-50 rounded-lg shadow-sm hover:bg-green-100 transition-colors duration-200">
                        <svg class="w-12 h-12 text-green-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.368 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        <span class="text-lg font-medium text-green-800">Manage Settings</span>
                    </button>
                    <button @click="logout"
                        class="flex flex-col items-center justify-center p-6 bg-red-50 rounded-lg shadow-sm hover:bg-red-100 transition-colors duration-200">
                        <svg class="w-12 h-12 text-red-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                        <span class="text-lg font-medium text-red-800">Logout</span>
                    </button>
                </div>
            </section>
        </main>

        <!-- Welcome Modal -->
        <div v-if="showWelcomeModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div class="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center relative transform transition-all duration-300 scale-100 opacity-100">
                <button @click="closeWelcomeModal" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
                <h3 class="text-3xl font-bold text-blue-600 mb-4">Welcome Back!</h3>
                <p class="text-gray-700 mb-6">
                    We're glad to see you again, {{ userName }}. Dive into your dashboard to manage your IT vulnerability assessments.
                </p>
                <button @click="closeWelcomeModal" class="bg-blue-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-blue-700 transition-colors">
                    Get Started
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