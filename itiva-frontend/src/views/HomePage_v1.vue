<!-- src/views/HomePage.vue -->
<script setup>
import { ref, computed } from 'vue';
import { mockRankings } from '../api/mockData';
import ShieldCheckIcon from '../components/icons/ShieldCheckIcon.vue';
import ChartBarIcon from '../components/icons/ChartBarIcon.vue';
import DocumentTextIcon from '../components/icons/DocumentTextIcon.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const rankings = ref(mockRankings);
const rankingFilter = ref('ranking'); // 'ranking', 'location', or 'type'
const selectedRanking = ref(rankings.value[0]);

const groupedRankings = computed(() => {
    if (rankingFilter.value === 'ranking') {
        return { 'Top 20 Rankings': rankings.value.slice().sort((a, b) => a.rank - b.rank) };
    }
    const grouped = rankings.value.reduce((acc, rank) => {
        const key = rank[rankingFilter.value];
        if (!acc[key]) acc[key] = [];
        acc[key].push(rank);
        return acc;
    }, {});
    return Object.fromEntries(Object.entries(grouped).sort());
});

function selectRanking(item) {
    selectedRanking.value = item;
}

function navigateToLogin() {
  router.push('/login');
}
</script>
<template>
    <div>
        <!-- Hero Section -->
        <div class="bg-white">
            <div class="container mx-auto px-6 py-20 md:py-32 text-center">
                <h1 class="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-4">Assess Your IT Vulnerabilities with <span class="text-blue-600">AI-Powered</span> Precision</h1>
                <p class="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8">ITIVA (IT Infrastructure Vulnerability Assessment) is an intelligent platform that helps businesses in the UK identify, analyze, and mitigate security risks across their digital infrastructure.</p>
                <button @click="navigateToLogin" class="bg-blue-600 text-white font-bold py-4 px-8 rounded-lg text-lg hover:bg-blue-700 transition-transform transform hover:scale-105 shadow-xl">Start Your Free Assessment</button>
            </div>
        </div>
        <!-- Rankings Section -->
        <section id="rankings" class="py-20 bg-gray-50/70">
          <!-- ... ranking section template from original file ... -->
        </section>
        <!-- How it Works Section -->
        <section id="how-it-works" class="py-20 bg-white">
          <!-- ... how-it-works section template from original file ... -->
        </section>
        <!-- Features Section -->
        <section id="features" class="py-20 bg-gray-50/70">
          <!-- ... features section template from original file ... -->
        </section>
    </div>
</template>