<script setup>
import { ref, onMounted, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import Chart from 'chart.js/auto'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import { useAssessmentStore } from '@/stores/assessment'
import DownloadIcon from '@/components/icons/DownloadIcon.vue'
import BackIcon from '@/components/icons/BackIcon.vue'

const router = useRouter()

// --- State and Data ---
const reportData = ref(null)
const summary = ref('')
const isLoadingSummary = ref(true)
const isDownloading = ref(false)
let radarChartInstance = null
const assessmentStore = useAssessmentStore()

// --- Default/Mock Data Structure (matching the reference) ---
const defaultReport = {
  name: 'PeeploTech',
  scores: { ws: 65, dn: 80, cd: 40, csi: 75, overall: 65 },
  prioritizedRecs: [
    {
      rec: 'Implement a formal Incident Response Plan.',
      impact: '+15 pts',
      category: 'Compliance',
    },
    { rec: 'Enforce MFA on all critical systems.', impact: '+12 pts', category: 'Cyber Security' },
    {
      rec: 'Deploy a Web Application Firewall (WAF).',
      impact: '+10 pts',
      category: 'Website Strength',
    },
    {
      rec: 'Conduct regular user security training.',
      impact: '+8 pts',
      category: 'Cyber Security',
    },
  ],
}

const reportTitle = computed(() => {
  if (!reportData.value) return 'Vulnerability Assessment Report'
  // Use the name and type from the report data itself
  return `${reportData.value.type} Report`
})

const generatedDate = computed(() => {
  return new Date().toLocaleDateString()
})

// --- Logic from Reference ---
const generateSummary = async (data) => {
  isLoadingSummary.value = true
  // Simulate an AI call with a delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  const { name, scores, recommendations } = data
  const topRecText =
    recommendations.length > 0
      ? `focusing on areas like <b>${recommendations[0].category}</b>`
      : 'maintaining current security standards'

  const overview = `This executive summary provides a high-level overview of the IT infrastructure vulnerability assessment conducted for <b>${name}</b>. The overall security score of <b>${scores.overall}</b> places the organization in a position with foundational security measures in place but highlights critical areas requiring immediate attention to mitigate significant risks.`

  const breakdown = `The assessment reveals a notable strength in the <b>Devices & Network</b> category, scoring <b>${scores.dn}</b>. This indicates that core network security and device management protocols are relatively robust. However, this strength is contrasted by a considerable vulnerability in <b>Compliance Documentation</b>, which scored a low <b>${scores.cd}</b>. This represents a major compliance and operational risk.`

  const conclusion = `To bolster the overall security posture, it is imperative to prioritize the development and enforcement of comprehensive compliance documentation. Addressing the top recommendations, particularly ${topRecText}, will have the most significant positive impact on improving the organization's resilience against cyber threats.`

  summary.value = `${overview}<br><br>${breakdown}<br><br>${conclusion}`
  isLoadingSummary.value = false
}

const getScoreColor = (score) => {
  // Return hex codes for html2canvas compatibility
  if (score >= 75) return '#16a34a' // Tailwind green-600
  if (score > 50) return '#ca8a04' // Tailwind yellow-600
  return '#dc2626' // Tailwind red-600
}

const goBack = () => {
  router.push('/dashboard')
}

// --- Charting ---
function createOrUpdateChart(data) {
  const ctx = document.getElementById('reportRadarChart')
  if (!ctx || !ctx.getContext) return

  if (radarChartInstance) radarChartInstance.destroy()

  const { scores } = data
  radarChartInstance = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['Website', 'Network', 'Compliance', 'CyberSec'],
      datasets: [
        {
          data: [scores.ws, scores.dn, scores.cd, scores.csi],
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 2,
        },
      ],
    },
    options: {
      // Add willReadFrequently hint for performance
      context: ctx.getContext('2d', { willReadFrequently: true }),
      maintainAspectRatio: false,
      scales: { r: { suggestedMin: 0, suggestedMax: 100, pointLabels: { font: { size: 14 } } } },
      plugins: { legend: { display: false } },
    },
  })
}

// --- PDF Download (Preserving the working version) ---
async function downloadReportAsPDF() {
  const reportElement = document.getElementById('report-content')
  if (!reportElement || isDownloading.value) return

  isDownloading.value = true
  document.body.classList.add('pdf-capture-active')
  await nextTick()
  try {
    const canvas = await html2canvas(reportElement, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      onclone: (clonedDoc) => {
        // This callback allows us to modify the cloned document before it's rendered.
        // We inject a style block to override Tailwind's modern color functions (like oklch)
        // with basic hex codes that html2canvas can parse reliably.
        // Also hide buttons and apply table styling for PDF.
        const style = clonedDoc.createElement('style')
        style.innerHTML = `
          /* Make the off-screen elements visible and part of the layout for the PDF */
          .pdf-only { display: table-row-group !important; position: static !important; visibility: visible !important; }
          .pdf-hide { display: none !important; } /* Hide buttons during PDF capture */
            /* Enforce consistent table layout for the PDF */
          table { table-layout: fixed !important; width: 100% !important; }
          table th:first-child, table td:first-child { width: 60% !important; }
          table th:nth-child(2), table td:nth-child(2) { width: 25% !important; }
          table th:last-child, table td:last-child { width: 15% !important; }
          th, td { word-wrap: break-word; }
          tr { page-break-inside: avoid !important; } /* Attempt to prevent rows from splitting */
          .bg-slate-800 { background-color: #1e293b !important; }
          .text-gray-300 { color: #d1d5db !important; }
          .bg-gray-600 { background-color: #4b5563 !important; }
          .bg-blue-600 { background-color: #2563eb !important; }
          .text-gray-800 { color: #1f2937 !important; }
          .border-blue-600 { border-color: #2563eb !important; }
          .text-gray-600 { color: #4b5563 !important; }
          .bg-gray-100 { background-color: #f3f4f6 !important; }
          .text-gray-700 { color: #374151 !important; }
          .bg-gray-200 { background-color: #e5e7eb !important; } /* For table header */
          .bg-gray-500 { background-color: #6b7280 !important; } /* For category tags */
          .text-red-600 { color: #dc2626 !important; }
        `
        clonedDoc.head.appendChild(style)
      },
    })
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' })
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const imgProps = pdf.getImageProperties(imgData)
    const imgHeight = (imgProps.height * pdfWidth) / imgProps.width
    let position = 0
    let heightLeft = imgHeight

    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight)
    heightLeft -= pdf.internal.pageSize.getHeight()

    while (heightLeft > 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight)
      heightLeft -= pdf.internal.pageSize.getHeight()
    }
    const fileName = `ITIVA_Report_${reportData.value.name || 'General'}.pdf`
    pdf.save(fileName)
  } catch (error) {
    console.error('Error generating PDF:', error)
  } finally {
    isDownloading.value = false
    document.body.classList.remove('pdf-capture-active')
  }
}

// --- Lifecycle ---
onMounted(() => {
  // Logic to use route query or fallback to default data
  const reportFromStore = assessmentStore.currentReport

  if (reportFromStore) {
    reportData.value = {
      name: assessmentStore.currentReportName,
      type: assessmentStore.currentReportType,
      scores: {
        ws: reportFromStore.ws,
        dn: reportFromStore.dn,
        cd: reportFromStore.cd,
        csi: reportFromStore.cs, // Map cs to csi for the chart
        overall: reportFromStore.overall,
      },
      // Use the generated recommendations directly
      // FIX: Ensure recommendations is always an array to prevent render errors.
      recommendations: reportFromStore.recommendations || [],
    }
  } else {
    // Fallback to default data if no report is in the store
    reportData.value = {
      name: defaultReport.name,
      type: 'Default Assessment',
      scores: defaultReport.scores,
      // Ensure recommendations is always an array
      recommendations:
        defaultReport.prioritizedRecs?.map((r) => ({
          text: r.rec,
          category: r.category,
          impactScore: parseInt(r.impact),
        })) || [],
    }
  }

  nextTick(() => {
    if (reportData.value) {
      generateSummary(reportData.value)
      createOrUpdateChart(reportData.value)
    }
  })
})
</script>

<template>
  <div class="bg-gray-100 min-h-screen font-sans">
    <AppHeader :is-logged-in="true" :show-new-assessment="false" />

    <div class="container mx-auto p-4 md:p-8">
      <div id="report-content" class="max-w-4xl mx-auto bg-white shadow-2xl rounded-lg">
        <template v-if="reportData">
          <header
            class="bg-slate-800 text-white p-6 rounded-t-lg flex justify-between items-center"
          >
            <div>
              <h1 class="text-2xl font-bold">{{ reportTitle }}</h1>
              <p class="text-sm text-gray-300">Generated on {{ generatedDate }} by ITIVA</p>
              <p class="text-sm text-gray-300">For: {{ reportData.name }}</p>
            </div>
            <div class="flex items-center space-x-4">
              <button
                @click="goBack"
                class="flex cursor-pointer items-center space-x-2 px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700 transition pdf-hide"
              >
                <BackIcon />
                <span>Back</span>
              </button>
              <button
                @click="downloadReportAsPDF"
                :disabled="isDownloading"
                class="flex cursor-pointer items-center space-x-2 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 pdf-hide"
              >
                <DownloadIcon />
                <span>{{ isDownloading ? '...' : 'Download' }}</span>
              </button>
            </div>
          </header>

          <main class="p-8">
            <section class="mb-8 pb-8 border-b">
              <h2 class="text-xl font-bold text-gray-800 mb-4">Executive Summary</h2>
              <div
                v-if="isLoadingSummary"
                class="flex items-center space-x-3 bg-gray-100 p-4 rounded-lg"
              >
                <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                <p>AI is analyzing the results...</p>
              </div>
              <p v-else class="text-gray-600 leading-relaxed" v-html="summary"></p>
            </section>

            <section class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 pb-8 border-b">
              <div>
                <h2 class="text-xl font-bold text-gray-800 mb-4">Score Breakdown</h2>
                <div class="space-y-4">
                  <div class="flex justify-between items-center">
                    <span class="font-medium">Website Strength</span>
                    <span
                      class="font-bold text-lg"
                      :style="{ color: getScoreColor(reportData.scores.ws) }"
                      >{{ reportData.scores.ws }}</span
                    >
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="font-medium">Devices & Network</span>
                    <span
                      class="font-bold text-lg"
                      :style="{ color: getScoreColor(reportData.scores.dn) }"
                      >{{ reportData.scores.dn }}</span
                    >
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="font-medium">Compliance Documentation</span>
                    <span
                      class="font-bold text-lg"
                      :style="{ color: getScoreColor(reportData.scores.cd) }"
                      >{{ reportData.scores.cd }}</span
                    >
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="font-medium">Cyber Security</span>
                    <span
                      class="font-bold text-lg"
                      :style="{ color: getScoreColor(reportData.scores.csi) }"
                      >{{ reportData.scores.csi }}</span
                    >
                  </div>
                  <div class="border-t pt-4 mt-4 flex justify-between items-center">
                    <span class="font-bold text-lg">Overall Score</span>
                    <span
                      class="font-extrabold text-2xl"
                      :style="{ color: getScoreColor(reportData.scores.overall) }"
                      >{{ reportData.scores.overall }}</span
                    >
                  </div>
                </div>
              </div>
              <div class="w-full h-64 md:h-auto">
                <canvas id="reportRadarChart"></canvas>
              </div>
            </section>

            <!-- Watch this section for recommendations -->
            <!-- <section v-if="reportData.recommendations && reportData.recommendations.length > 0"> -->
            <section v-if="reportData.recommendations">
              <h2 class="text-xl font-bold text-gray-800 mb-4">Prioritized Recommendations</h2>
              <div class="overflow-x-auto">
                <table class="min-w-full bg-white">
                  <thead class="bg-gray-100">
                    <tr>
                      <th class="py-3 px-4 text-left text-sm font-bold text-gray-600 w-2/3">
                        Recommendation
                      </th>
                      <th class="py-3 px-4 text-center text-sm font-bold text-gray-600 w-1/6">
                        Category
                      </th>
                      <th class="py-3 px-4 text-center text-sm font-bold text-gray-600 w-24">
                        Impact
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(rec, index) in reportData.recommendations.slice(0, 3)"
                      :key="index"
                      class="border-b"
                      :class="{ 'pdf-only': index >= 3 }"
                    >
                      <td class="py-3 px-4 text-gray-700">{{ rec.text }}</td>
                      <td
                        class="py-3 px-4 bg-gray-100 text-center text-sm font-medium text-gray-800"
                      >
                        {{ rec.category }}
                      </td>
                      <td class="py-3 px-4 font-bold text-red-600 text-center">
                        +{{ rec.impactScore }} pts
                      </td>
                    </tr>
                  </tbody>
                  <!-- Hidden rows for PDF download -->
                  <tbody class="pdf-only">
                    <tr
                      v-for="(rec, index) in reportData.recommendations.slice(3)"
                      :key="`pdf-${index}`"
                      class="border-b"
                      style="page-break-inside: avoid"
                    >
                      <td class="py-3 px-4 text-gray-700">{{ rec.text }}</td>
                      <td
                        class="py-3 px-4 bg-gray-100 text-center text-sm font-medium text-gray-800"
                      >
                        {{ rec.category }}
                      </td>
                      <td class="py-3 px-4 font-bold text-red-600 text-center">
                        +{{ rec.impactScore }} pts
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </main>
        </template>
        <div v-else class="p-8 text-center text-gray-500">
          <p>Loading report data...</p>
        </div>
      </div>
    </div>
    <AppFooter />
  </div>
</template>

<style>
/* Global style for cleaner PDF captures */
body.pdf-capture-active {
  background-color: #ffffff; /* Ensure body background is white for capture */
}
body.pdf-capture-active .shadow-lg,
body.pdf-capture-active .shadow-xl,
body.pdf-capture-active .shadow-2xl {
  box-shadow: none !important;
}
/* Hide elements from the screen that should only appear in the PDF */
.pdf-only {
  /* This technique keeps the element in the DOM for layout calculation
     but makes it invisible and non-interactive on the screen. */
  position: absolute;
  left: -9999px;
  top: -9999px;
  visibility: hidden;
}
</style>
