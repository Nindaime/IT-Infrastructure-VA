<!-- src/views/HomePage.vue -->
<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { mockRankings } from '@/api/mockData';

// Initialize the router for navigation
const router = useRouter();

// Reactive reference for the list of rankings
const rankings = ref(mockRankings);

// Reactive reference for the filter criterion ('ranking', 'location', or 'type')
const rankingFilter = ref('ranking');

// Reactive reference for the currently selected ranking item, initialized to the first item
const selectedRanking = ref(rankings.value[0]);

/**
 * Computed property to group rankings based on the selected filter.
 * If 'ranking' is selected, it returns the top 20 sorted by rank.
 * Otherwise, it groups by the specified key (location or type).
 * @returns {object} An object where keys are group names and values are arrays of ranking items.
 */
const groupedRankings = computed(() => {
    if (rankingFilter.value === 'ranking') {
        // Return top 20 rankings sorted by rank
        return { 'Top 20 Rankings': rankings.value.slice().sort((a, b) => a.rank - b.rank) };
    }
    // Group rankings by the selected filter key (location or type)
    const grouped = rankings.value.reduce((acc, rank) => {
        const key = rank[rankingFilter.value];
        if (!acc[key]) acc[key] = []; // Initialize array for new group if it doesn't exist
        acc[key].push(rank); // Add the current ranking item to its group
        return acc;
    }, {});
    // Sort the grouped object by keys alphabetically and return
    return Object.fromEntries(Object.entries(grouped).sort());
});

/**
 * Selects a ranking item to display its detailed report.
 * @param {object} item The ranking item to select.
 */
function selectRanking(item) {
    selectedRanking.value = item;
}

/**
 * Navigates the user to the login page.
 */
function navigateToLogin() {
    router.push('/login');
}

/**
 * Navigates the user to the report viewer page with the selected business's report.
 * @param {object} biz The business object whose report is to be viewed.
 */
function viewReport(biz) {
    // Navigate to the ReportViewerPage, passing the business report as payload
    router.push({ name: 'ReportViewerPage', params: { report: JSON.stringify(biz.report), name: biz.name } });
}
</script>

<template>
    <div class="font-sans">
        <!-- Hero Section -->
        <div class="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 md:py-32 shadow-xl">
            <div class="container mx-auto px-6 text-center">
                <h1 class="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
                    Assess Your IT Vulnerabilities with <span class="text-yellow-300">AI-Powered</span> Precision
                </h1>
                <p class="text-lg md:text-xl max-w-3xl mx-auto mb-10 opacity-90">
                    ITIVA (IT Infrastructure Vulnerability Assessment) is an intelligent platform that helps businesses in the UK identify, analyze, and mitigate security risks across their digital infrastructure.
                </p>
                <button @click="navigateToLogin" class="bg-white text-blue-700 font-bold py-4 px-10 rounded-full text-lg hover:bg-gray-100 transition-transform transform hover:scale-105 shadow-2xl">
                    Start Your Free Assessment
                </button>
            </div>
        </div>

        <!-- UK's Most Secure Businesses Section -->
        <section id="rankings" class="py-20 bg-gray-50/70">
            <div class="container mx-auto px-6">
                <div class="text-center mb-12">
                    <h2 class="text-3xl md:text-4xl font-bold text-gray-800">UK's Most Secure Businesses</h2>
                    <p class="text-gray-600 mt-4 max-w-2xl mx-auto">Discover the top-ranked businesses based on their comprehensive ITIVA vulnerability score.</p>
                    <div class="mt-8 flex justify-center items-center flex-wrap gap-3">
                        <span class="text-gray-700 font-medium text-lg">Group by:</span>
                        <button @click="rankingFilter = 'ranking'"
                            :class="['px-6 py-2 rounded-full font-semibold transition-all duration-300',
                            rankingFilter === 'ranking' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-700 border border-gray-300']">
                            Ranking
                        </button>
                        <button @click="rankingFilter = 'location'"
                            :class="['px-6 py-2 rounded-full font-semibold transition-all duration-300',
                            rankingFilter === 'location' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-700 border border-gray-300']">
                            Location
                        </button>
                        <button @click="rankingFilter = 'type'"
                            :class="['px-6 py-2 rounded-full font-semibold transition-all duration-300',
                            rankingFilter === 'type' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-700 border border-gray-300']">
                            Business Type
                        </button>
                    </div>
                </div>

                <div class="bg-white rounded-2xl shadow-xl flex flex-col md:flex-row min-h-[600px] overflow-hidden">
                    <!-- Rankings List Sidebar -->
                    <div class="w-full md:w-2/5 border-b md:border-b-0 md:border-r border-gray-200 flex flex-col">
                        <div class="p-6 border-b border-gray-200">
                            <h3 class="text-xl font-bold text-gray-800">Business Rankings</h3>
                        </div>
                        <div class="overflow-y-auto custom-scrollbar flex-grow p-4">
                            <div v-for="(group, groupName) in groupedRankings" :key="groupName" class="mb-4 last:mb-0">
                                <h4 class="font-semibold text-sm text-blue-800 bg-blue-50 px-4 py-2 rounded-md mb-2 sticky top-0 z-10 shadow-sm">{{ groupName }}</h4>
                                <ul class="space-y-1">
                                    <li v-for="item in group" :key="item.rank" @click="selectRanking(item)"
                                        class="p-3 rounded-lg cursor-pointer flex items-center justify-between transition-all duration-200"
                                        :class="selectedRanking && selectedRanking.rank === item.rank ? 'bg-blue-100 shadow-sm border border-blue-200' : 'hover:bg-gray-50'">
                                        <div class="flex items-center truncate">
                                            <span class="font-bold text-gray-400 mr-3 w-6 text-center flex-shrink-0">{{ item.rank }}</span>
                                            <div class="truncate">
                                                <p class="font-bold text-gray-800 text-sm truncate">{{ item.name }}</p>
                                                <p class="text-xs text-gray-500 truncate">{{ item.location }} - {{ item.type }}</p>
                                            </div>
                                        </div>
                                        <span class="font-extrabold text-base flex-shrink-0 ml-2"
                                            :class="item.score > 75 ? 'text-green-600' : item.score > 50 ? 'text-yellow-600' : 'text-red-600'">
                                            {{ item.score }}
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <!-- Selected Business Report Summary -->
                    <div class="w-full md:w-3/5 p-8 flex flex-col justify-center bg-gray-50 rounded-r-2xl">
                        <div v-if="selectedRanking" class="text-center md:text-left">
                            <h2 class="text-4xl font-bold text-gray-800 mb-2">{{ selectedRanking.name }}</h2>
                            <p class="text-lg text-gray-500 mb-8">{{ selectedRanking.location }} - {{ selectedRanking.type }}</p>

                            <div class="flex flex-col items-center md:items-start mb-10">
                                <p class="text-sm text-gray-600 mb-2">Overall Security Score</p>
                                <p class="text-7xl font-extrabold mb-4"
                                    :class="selectedRanking.score > 75 ? 'text-green-600' : selectedRanking.score > 50 ? 'text-yellow-600' : 'text-red-600'">
                                    {{ selectedRanking.score }}
                                </p>
                                <button @click="viewReport(selectedRanking)"
                                    class="bg-blue-600 text-white font-semibold py-3 px-8 rounded-full text-md hover:bg-blue-700 transition-transform transform hover:scale-105 shadow-md">
                                    View Full Report
                                </button>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                                <div class="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                                    <svg class="w-8 h-8 text-blue-500 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h4l-1-1v-3.25m-6.096 1.408l-3.003-3.004C2.012 10.612 0 8.874 0 7c0-1.79 1.41-3.266 3-3.896c1.59-.63 3.23-1.004 4.5-.604c1.27.4 2.378 1.547 3 2.896M21 7c0 1.79-1.41 3.266-3 3.896c-1.59.63-3.23 1.004-4.5.604c-1.27-.4-2.378-1.547-3-2.896"></path></svg>
                                    <div>
                                        <p class="text-sm text-gray-600">Website Strength</p>
                                        <p class="text-xl font-bold" :class="selectedRanking.report.ws > 75 ? 'text-green-600' : selectedRanking.report.ws > 50 ? 'text-yellow-600' : 'text-red-600'">
                                            {{ selectedRanking.report.ws }}%
                                        </p>
                                    </div>
                                </div>
                                <div class="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                                    <svg class="w-8 h-8 text-blue-500 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0zM10 7v5h4"></path></svg>
                                    <div>
                                        <p class="text-sm text-gray-600">Devices & Network</p>
                                        <p class="text-xl font-bold" :class="selectedRanking.report.dn > 75 ? 'text-green-600' : selectedRanking.report.dn > 50 ? 'text-yellow-600' : 'text-red-600'">
                                            {{ selectedRanking.report.dn }}%
                                        </p>
                                    </div>
                                </div>
                                <div class="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                                    <svg class="w-8 h-8 text-blue-500 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                    <div>
                                        <p class="text-sm text-gray-600">Compliance & Documentation</p>
                                        <p class="text-xl font-bold" :class="selectedRanking.report.cd > 75 ? 'text-green-600' : selectedRanking.report.cd > 50 ? 'text-yellow-600' : 'text-red-600'">
                                            {{ selectedRanking.report.cd }}%
                                        </p>
                                    </div>
                                </div>
                                <div class="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                                    <svg class="w-8 h-8 text-blue-500 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c1.657 0 3 1.343 3 3v2a3 3 0 01-3 3m0-12c1.657 0 3 1.343 3 3v2a3 3 0 01-3 3m0-12a9 9 0 100 18A9 9 0 0012 8z"></path></svg>
                                    <div>
                                        <p class="text-sm text-gray-600">Cyber Security Implementations</p>
                                        <p class="text-xl font-bold" :class="selectedRanking.report.cs > 75 ? 'text-green-600' : selectedRanking.report.cs > 50 ? 'text-yellow-600' : 'text-red-600'">
                                            {{ selectedRanking.report.cs }}%
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-else class="text-center text-gray-500">
                            <p class="text-lg">Select a business from the list to view its security summary.</p>
                            <svg class="mx-auto mt-8 w-24 h-24 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 17v-4m0 0l-3-3m3 3h4m0 0l3-3m-3 3v4m0 0H9m0-10h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Placeholder for About Us Section -->
        <section id="about" class="py-20 bg-white">
            <div class="container mx-auto px-6 text-center">
                <h2 class="text-3xl md:text-4xl font-bold text-gray-800 mb-4">About ITIVA</h2>
                <p class="text-lg text-gray-600 max-w-3xl mx-auto">
                    ITIVA is committed to empowering businesses with the knowledge and tools to secure their digital presence. Our cutting-edge AI technology provides in-depth vulnerability assessments, helping you proactively manage and mitigate risks. Learn more about our mission and values.
                </p>
                <button @click="router.push('/about')" class="mt-8 bg-blue-500 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-600 transition-transform transform hover:scale-105 shadow-md">
                    Learn More
                </button>
            </div>
        </section>
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