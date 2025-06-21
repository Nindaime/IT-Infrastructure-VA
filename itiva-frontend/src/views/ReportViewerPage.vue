<!-- src/views/ReportViewerPage.vue -->
<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import Chart from 'chart.js/auto'; // Import Chart.js

// Initialize the route object to access route parameters
const route = useRoute();

// Reactive reference for the report data
const reportData = ref(null);
// Reactive reference for the business name
const businessName = ref('');

// Chart.js instance
let radarChart = null;

/**
 * Initializes or updates the radar chart with the given report data.
 * @param {object} data The report data containing category scores.
 */
function createOrUpdateChart(data) {
    const ctx = document.getElementById('radarChart');

    if (!ctx) {
        console.error("Canvas element 'radarChart' not found.");
        return;
    }

    if (radarChart) {
        // Destroy existing chart if it exists to prevent re-rendering issues
        radarChart.destroy();
    }

    const labels = ['Website Strength', 'Devices & Network', 'Compliance & Documentation', 'Cyber Security Implementations'];
    const scores = [data.ws, data.dn, data.cd, data.cs];

    radarChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Security Score (%)',
                data: scores,
                backgroundColor: 'rgba(59, 130, 246, 0.4)', // blue-500 with transparency
                borderColor: 'rgb(37, 99, 235)', // blue-600
                pointBackgroundColor: 'rgb(37, 99, 235)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(37, 99, 235)',
                borderWidth: 2,
                fill: true,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, // Allows the chart to fill its container
            scales: {
                r: {
                    angleLines: {
                        color: '#e2e8f0' // gray-200
                    },
                    grid: {
                        color: '#cbd5e1' // gray-300
                    },
                    pointLabels: {
                        font: {
                            size: 14,
                            weight: 'bold',
                            family: 'Inter, sans-serif'
                        },
                        color: '#374151' // gray-700
                    },
                    suggestedMin: 0,
                    suggestedMax: 100,
                    ticks: {
                        stepSize: 20,
                        backdropColor: 'transparent',
                        color: '#6b7280', // gray-500
                        font: {
                            family: 'Inter, sans-serif'
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false // Hide legend
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.raw}%`;
                        }
                    },
                    bodyFont: {
                        family: 'Inter, sans-serif'
                    },
                    titleFont: {
                        family: 'Inter, sans-serif'
                    }
                }
            }
        }
    });
}

/**
 * Parses the report data from route parameters when the component is mounted.
 * This function also handles the initial chart creation.
 */
onMounted(() => {
    if (route.params.report) {
        try {
            reportData.value = JSON.parse(route.params.report);
            businessName.value = route.params.name || 'Generated Report';
            if (reportData.value) {
                // Ensure canvas is rendered before creating chart
                setTimeout(() => {
                    createOrUpdateChart(reportData.value);
                }, 50); // Small delay to ensure canvas exists in DOM
            }
        } catch (e) {
            console.error('Error parsing report data:', e);
            reportData.value = null;
        }
    }
});

/**
 * Watch for changes in route parameters (specifically 'report' and 'name')
 * to update the report data and refresh the chart.
 */
watch(() => route.params, (newParams) => {
    if (newParams.report) {
        try {
            reportData.value = JSON.parse(newParams.report);
            businessName.value = newParams.name || 'Generated Report';
            if (reportData.value) {
                createOrUpdateChart(reportData.value);
            }
        } catch (e) {
            console.error('Error parsing report data on watch:', e);
            reportData.value = null;
        }
    }
}, { deep: true }); // Watch deeply for nested changes in params
</script>

<template>
    <div class="min-h-screen bg-gray-100 flex flex-col items-center p-6 font-sans">
        <div class="w-full max-w-6xl bg-white rounded-2xl shadow-xl p-8 md:p-12 my-8">
            <header class="text-center mb-10">
                <h1 class="text-4xl md:text-5xl font-extrabold text-blue-700 mb-4">
                    Vulnerability Assessment Report
                </h1>
                <p class="text-xl md:text-2xl text-gray-700 font-semibold mb-2">
                    For: <span class="text-blue-600">{{ businessName }}</span>
                </p>
                <p class="text-md text-gray-500">Date Generated: {{ new Date().toLocaleDateString() }}</p>
            </header>

            <div v-if="reportData" class="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <!-- Overall Score & Summary -->
                <section class="flex flex-col items-center justify-center bg-blue-50 rounded-xl p-8 shadow-inner">
                    <h2 class="text-2xl font-bold text-blue-800 mb-4">Overall Security Score</h2>
                    <p class="text-8xl font-extrabold"
                        :class="reportData.overall > 75 ? 'text-green-600' : reportData.overall > 50 ? 'text-yellow-600' : 'text-red-600'">
                        {{ reportData.overall }}
                    </p>
                    <p class="text-xl text-gray-600 mt-4 text-center">
                        This score reflects the overall health of your IT infrastructure's security.
                        A higher score indicates better resilience against vulnerabilities.
                    </p>
                </section>

                <!-- Radar Chart Section -->
                <section class="bg-gray-50 rounded-xl p-8 shadow-inner flex flex-col justify-center items-center">
                    <h2 class="text-2xl font-bold text-gray-800 mb-6">Security Posture Breakdown</h2>
                    <div class="relative h-80 w-full md:h-96">
                        <canvas id="radarChart"></canvas>
                    </div>
                    <p class="text-sm text-gray-500 mt-4 text-center">
                        This radar chart illustrates your performance across key security domains.
                    </p>
                </section>

                <!-- Detailed Category Scores -->
                <section class="lg:col-span-2 bg-white rounded-xl p-8 shadow-md border border-gray-200">
                    <h2 class="text-2xl font-bold text-gray-800 mb-6">Detailed Category Scores</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div class="bg-white rounded-lg shadow-sm p-5 text-center border border-gray-100">
                            <h3 class="text-lg font-semibold text-gray-700 mb-2">Website Strength</h3>
                            <p class="text-4xl font-extrabold"
                                :class="reportData.ws > 75 ? 'text-green-600' : reportData.ws > 50 ? 'text-yellow-600' : 'text-red-600'">
                                {{ reportData.ws }}%
                            </p>
                            <p class="text-sm text-gray-500 mt-2">
                                Assessment of your web application security, including SSL, updates, and headers.
                            </p>
                        </div>
                        <div class="bg-white rounded-lg shadow-sm p-5 text-center border border-gray-100">
                            <h3 class="text-lg font-semibold text-gray-700 mb-2">Devices & Network</h3>
                            <p class="text-4xl font-extrabold"
                                :class="reportData.dn > 75 ? 'text-green-600' : reportData.dn > 50 ? 'text-yellow-600' : 'text-red-600'">
                                {{ reportData.dn }}%
                            </p>
                            <p class="text-sm text-gray-500 mt-2">
                                Evaluation of device inventory, firewall configurations, and network security.
                            </p>
                        </div>
                        <div class="bg-white rounded-lg shadow-sm p-5 text-center border border-gray-100">
                            <h3 class="text-lg font-semibold text-gray-700 mb-2">Compliance & Documentation</h3>
                            <p class="text-4xl font-extrabold"
                                :class="reportData.cd > 75 ? 'text-green-600' : reportData.cd > 50 ? 'text-yellow-600' : 'text-red-600'">
                                {{ reportData.cd }}%
                            </p>
                            <p class="text-sm text-gray-500 mt-2">
                                Adherence to security policies, data handling regulations, and formal documentation.
                            </p>
                        </div>
                        <div class="bg-white rounded-lg shadow-sm p-5 text-center border border-gray-100">
                            <h3 class="text-lg font-semibold text-gray-700 mb-2">Cyber Security Implementations</h3>
                            <p class="text-4xl font-extrabold"
                                :class="reportData.cs > 75 ? 'text-green-600' : reportData.cs > 50 ? 'text-yellow-600' : 'text-red-600'">
                                {{ reportData.cs }}%
                            </p>
                            <p class="text-sm text-gray-500 mt-2">
                                Measures like IDS/IPS, access controls, and encryption across your systems.
                            </p>
                        </div>
                    </div>
                </section>

                <!-- Recommendations Section (Placeholder) -->
                <section class="lg:col-span-2 bg-blue-50 rounded-xl p-8 shadow-md border border-blue-200">
                    <h2 class="text-2xl font-bold text-blue-800 mb-6">Recommendations & Next Steps</h2>
                    <ul class="list-disc list-inside text-gray-700 space-y-3">
                        <li>Regularly update all software components, especially those exposed to the internet.</li>
                        <li>Implement a robust firewall solution and ensure it's actively monitored.</li>
                        <li>Develop and enforce a comprehensive information security policy across your organization.</li>
                        <li>Consider deploying an Intrusion Detection/Prevention System for real-time threat monitoring.</li>
                        <li>Review and strengthen access controls, adhering strictly to the principle of least privilege.</li>
                        <li>Schedule regular vulnerability assessments to track progress and identify new risks.</li>
                    </ul>
                    <button @click="$router.push('/dashboard')" class="mt-8 bg-blue-600 text-white font-semibold py-3 px-8 rounded-full hover:bg-blue-700 transition-transform transform hover:scale-105 shadow-md">
                        Back to Dashboard
                    </button>
                </section>
            </div>

            <div v-else class="text-center py-20 text-gray-500">
                <p class="text-xl mb-4">No report data available.</p>
                <p class="text-md">Please complete an assessment to view a report.</p>
                <button @click="$router.push('/questionnaire')" class="mt-8 bg-blue-600 text-white font-semibold py-3 px-8 rounded-full hover:bg-blue-700 transition-transform transform hover:scale-105 shadow-md">
                    Start New Assessment
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Add any custom styles specific to the ReportViewerPage here */
</style>