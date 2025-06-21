<!-- src/views/DashboardPage.vue -->
<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { Radar } from 'vue-chartjs';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const router = useRouter();
const props = defineProps({ payload: Object });

const assessmentCompleted = ref(props.payload?.assessmentCompleted || true); // Default to true to show chart
const overallScore = ref(0);

const scores = { ws: 65, dn: 80, cd: 40, csi: 75 };
overallScore.value = Math.round((scores.ws + scores.dn + scores.cd + scores.csi) / 4);

const chartData = computed(() => ({
  labels: ['Website Strength', 'Devices & Network', 'Compliance', 'Cyber Security Impl.'],
  datasets: [{
    label: 'Your Vulnerability Score',
    data: [scores.ws, scores.dn, scores.cd, scores.csi],
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderColor: 'rgba(59, 130, 246, 1)',
    borderWidth: 2,
    pointBackgroundColor: 'rgba(59, 130, 246, 1)',
  }]
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: { r: { angleLines: { display: false }, suggestedMin: 0, suggestedMax: 100 } },
  plugins: { legend: { display: false } }
};
</script>
<template>
  <div class="bg-gray-100 py-12 px-6">
    <div class="container mx-auto">
        <h1 class="text-3xl font-bold text-gray-800 mb-8">User Dashboard</h1>
        <div v-if="!assessmentCompleted" class="text-center bg-white p-12 rounded-lg shadow-md">
            <h2 class="text-2xl font-bold mb-4">Welcome to ITIVA!</h2>
            <p class="text-gray-600 mb-8 max-w-lg mx-auto">Your first step to a more secure business starts here. Complete the vulnerability assessment to get your personalized security report and recommendations.</p>
            <button @click="router.push('/assessment')" class="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-blue-700 shadow-lg">Start Assessment Now</button>
        </div>
        <div v-if="assessmentCompleted" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2 bg-white p-8 rounded-lg shadow-md">
                <h2 class="text-2xl font-bold mb-6">Your Vulnerability Assessment Result</h2>
                <div class="max-w-md mx-auto h-80">
                  <Radar :data="chartData" :options="chartOptions" />
                </div>
            </div>
            <div class="space-y-8">
                <div class="bg-white p-6 rounded-lg shadow-md text-center">
                    <h3 class="text-lg font-medium text-gray-600">Overall Score</h3>
                    <p class="text-5xl font-extrabold text-green-600 my-2">{{ overallScore }}</p>
                    <p class="text-sm text-gray-500">A higher score indicates a stronger security posture.</p>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-md">
                    <h3 class="text-lg font-bold mb-4">Actions</h3>
                    <button @click="router.push('/assessment')" class="w-full text-center mb-4 bg-gray-100 text-gray-700 font-bold py-3 px-4 rounded-lg hover:bg-gray-200">Retake Assessment</button>
                    <button @click="router.push('/report')" class="w-full text-center bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700">View Report</button>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>
