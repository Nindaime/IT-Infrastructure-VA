<script setup>
import { ref, onMounted, onBeforeUnmount, computed, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import jsPDF from 'jspdf'
import { applyPlugin } from 'jspdf-autotable'
import Chart from 'chart.js/auto'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import { useAssessmentStore } from '@/stores/assessment'
import { useReportsStore } from '@/stores/reports'
import { useAuthStore } from '@/stores/auth'
import DownloadIcon from '@/components/icons/DownloadIcon.vue'
import BackIcon from '@/components/icons/BackIcon.vue'
import html2canvas from 'html2canvas'

// Apply the autotable plugin to the jsPDF constructor
applyPlugin(jsPDF)

const router = useRouter()
const route = useRoute()

// --- Store Initialization ---
const assessmentStore = useAssessmentStore()
const reportsStore = useReportsStore()

// --- State and Data ---
const reportData = ref(null)
const summary = ref('')
const isLoadingSummary = ref(true)
const isDownloading = ref(false)
let radarChartInstance = null
let pdfRadarChartInstance = null // Add instance tracker for the PDF chart
const authStore = useAuthStore()

// --- PDF Generation Refs ---
const fullReportForPdf = ref(null) // Ref to the hidden, full-report element for PDF generation

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
  if (score >= 80) return '#16a34a' // Tailwind green-600
  if (score >= 55) return '#ca8a04' // Tailwind yellow-600
  return '#dc2626' // Tailwind red-600
}

const goBack = () => {
  router.push('/dashboard')
}

// --- Charting ---
function createOrUpdateChart(data, canvasId = 'reportRadarChart') {
  const ctx = document.getElementById(canvasId)
  if (!ctx || !ctx.getContext) return

  // Destroy the correct chart instance before recreating
  if (canvasId === 'reportRadarChart' && radarChartInstance) {
    radarChartInstance.destroy()
  }
  if (canvasId === 'pdfRadarChart' && pdfRadarChartInstance) {
    pdfRadarChartInstance.destroy()
  }

  const { scores } = data
  // radarChartInstance = new Chart(ctx, {
  const chart = new Chart(ctx, {
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
      animation: canvasId === 'pdfRadarChart' ? false : undefined, // Disable animation for PDF capture
      // Add willReadFrequently hint for performance
      context: ctx.getContext('2d', { willReadFrequently: true }),
      maintainAspectRatio: false,
      scales: {
        r: {
          suggestedMin: 0,
          suggestedMax: 100,
          pointLabels: { font: { size: canvasId === 'pdfRadarChart' ? 18 : 14 } },
        },
      },
      plugins: { legend: { display: false } },
    },
  })

  // Only store the main chart instance.
  if (canvasId === 'reportRadarChart') {
    radarChartInstance = chart
  } else if (canvasId === 'pdfRadarChart') {
    pdfRadarChartInstance = chart
  }
}

/**
 * Creates a configuration object for html2canvas to handle modern CSS color functions.
 */
const getPdfCanvasOptions = () => ({
  scale: 2, // Use scale 2 for a good balance of quality and file size.
  useCORS: true,
  backgroundColor: '#ffffff',
  onclone: (clonedDoc) => {
    const style = clonedDoc.createElement('style')
    // This is a comprehensive style override to combat the "oklch" color parsing error.
    // It covers all known color classes used in the app and sets safe defaults.
    style.innerHTML = `
      /* --- Universal Resets for PDF --- */
      * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        color-adjust: exact !important;
        box-shadow: none !important;
      }
      body, html {
        background-color: #ffffff !important;
        color: #111827 !important; /* Default text to gray-900 */
      }

      /* --- Background Colors --- */
      .bg-white { background-color: #ffffff !important; }
      .bg-slate-800, .bg-gray-800 { background-color: #1f2937 !important; }
      .bg-gray-600 { background-color: #4b5563 !important; }
      .bg-gray-200 { background-color: #e5e7eb !important; }
      .bg-gray-100 { background-color: #f3f4f6 !important; }
      .bg-gray-50 { background-color: #f9fafb !important; }
      .bg-blue-600 { background-color: #2563eb !important; }
      .bg-blue-500 { background-color: #3b82f6 !important; }
      .bg-blue-100 { background-color: #dbeafe !important; }
      .bg-blue-50 { background-color: #eff6ff !important; }
      .bg-green-600 { background-color: #16a34a !important; }
      .bg-green-500 { background-color: #22c55e !important; }
      .bg-green-50 { background-color: #f0fdf4 !important; }
      .bg-yellow-500 { background-color: #eab308 !important; }
      .bg-yellow-100 { background-color: #fef9c3 !important; }
      .bg-yellow-50 { background-color: #fefce8 !important; }
      .bg-red-600 { background-color: #dc2626 !important; }
      .bg-red-500 { background-color: #ef4444 !important; }
      .bg-red-50 { background-color: #fef2f2 !important; }
      .bg-purple-50 { background-color: #f5f3ff !important; }

      /* --- Text Colors --- */
      .text-white { color: #ffffff !important; }
      .text-gray-900 { color: #111827 !important; }
      .text-gray-800 { color: #1f2937 !important; }
      .text-gray-700 { color: #374151 !important; }
      .text-gray-600 { color: #4b5563 !important; }
      .text-gray-500 { color: #6b7280 !important; }
      .text-gray-300 { color: #d1d5db !important; }
      .text-blue-800 { color: #1e40af !important; }
      .text-blue-700 { color: #1d4ed8 !important; }
      .text-blue-600 { color: #2563eb !important; }
      .text-green-800 { color: #166534 !important; }
      .text-green-600 { color: #16a34a !important; }
      .text-yellow-800 { color: #854d0e !important; }
      .text-yellow-600 { color: #ca8a04 !important; }
      .text-red-800 { color: #991b1b !important; }
      .text-red-600 { color: #dc2626 !important; }
      .text-red-500 { color: #ef4444 !important; }
      .text-purple-800 { color: #6b21a8 !important; }
      .text-emerald-600 { color: #059669 !important; }
      .text-orange-600 { color: #ea580c !important; }

      /* --- Border Colors --- */
      .border, .border-b, .border-t, .border-l, .border-r { border-color: #e5e7eb !important; }
      .border-gray-200 { border-color: #e5e7eb !important; }
      .border-gray-300 { border-color: #d1d5db !important; }
      .border-blue-600 { border-color: #2563eb !important; }
      .border-blue-500 { border-color: #3b82f6 !important; }
    `
    clonedDoc.head.appendChild(style)
  },
})

/**
 * Handles the PDF download process with manual pagination to prevent cut-off content.
 */
async function downloadReportAsPDF() {
  if (isDownloading.value) return
  isDownloading.value = true
  const sourceNode = fullReportForPdf.value

  // Store original width to restore it later
  const originalWidth = sourceNode.style.width

  try {
    if (!sourceNode) {
      console.error('PDF source element not found.')
      return
    }

    sourceNode.style.visibility = 'visible'
    // Set a fixed, wide width on the source element. This forces the browser to
    // render the content at a higher resolution, which results in much crisper
    // text in the final PDF after scaling. 1200px is a good balance.
    sourceNode.style.width = '1200px'
    sourceNode.style.display = 'block'

    createOrUpdateChart(reportData.value, 'pdfRadarChart')
    await nextTick()

    const pdf = new jsPDF({ orientation: 'p', unit: 'pt', format: 'a4' })
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const margin = 40

    // Set a default font family for the entire document
    // The 'sans-serif' style is not valid. Setting the font name to 'helvetica'
    // correctly selects the standard, built-in sans-serif font.
    pdf.setFont('helvetica')
    let y = 0

    // Helper to convert hex to RGB for jsPDF
    const hexToRgb = (hex) => {
      const r = parseInt(hex.slice(1, 3), 16)
      const g = parseInt(hex.slice(3, 5), 16)
      const b = parseInt(hex.slice(5, 7), 16)
      return [r, g, b]
    }

    function drawMixedStyleText(doc, segments, x, y, maxWidth, fontSize, lineHeightFactor) {
      let currentY = y
      doc.setFontSize(fontSize)
      doc.setLineHeightFactor(lineHeightFactor)
      const lineHeight = fontSize * lineHeightFactor
      const spaceWidth = doc.getStringUnitWidth(' ') * fontSize

      let line = [] // To hold words for the current line: { text: 'word', width: 10, bold: true }
      let lineWordsWidth = 0

      // Flatten all segments into a single array of word objects
      const allWords = []
      segments.forEach((segment) => {
        if (segment.text === '\n\n') {
          allWords.push({ text: '\n\n', bold: false })
          return
        }
        const words = segment.text.split(/\s+/)
        words.forEach((word) => {
          if (word) {
            allWords.push({ text: word, bold: segment.bold })
          }
        })
      })

      // Function to draw a single line of text, with or without justification
      const drawLine = (currentLine, justify) => {
        if (currentLine.length === 0) return

        const totalWordsWidth = currentLine.reduce((acc, word) => acc + word.width, 0)
        const totalSpaces = currentLine.length - 1
        let spaceBetweenWords = spaceWidth

        if (justify && totalSpaces > 0) {
          const remainingSpace = maxWidth - totalWordsWidth
          spaceBetweenWords = remainingSpace / totalSpaces
        }

        let currentX = x
        currentLine.forEach((word) => {
          doc.setFont(undefined, word.bold ? 'bold' : 'normal')
          doc.text(word.text, currentX, currentY)
          currentX += word.width + spaceBetweenWords
        })
        currentY += lineHeight
      }

      // Process all words, building and drawing lines
      allWords.forEach((wordObj) => {
        if (wordObj.text === '\n\n') {
          drawLine(line, false) // Draw the last line before paragraph break (no justify)
          currentY += lineHeight // Add extra space for paragraph break
          line = []
          lineWordsWidth = 0
          return
        }

        doc.setFont(undefined, wordObj.bold ? 'bold' : 'normal')
        const wordWidth = doc.getStringUnitWidth(wordObj.text) * fontSize

        // This is the crucial fix: Calculate the prospective width of the line *with* all spaces.
        const prospectiveLineWidth = lineWordsWidth + wordWidth + line.length * spaceWidth

        if (line.length > 0 && prospectiveLineWidth > maxWidth) {
          drawLine(line, false) // Draw the full line left-aligned
          line = []
          lineWordsWidth = 0
        }

        line.push({ text: wordObj.text, width: wordWidth, bold: wordObj.bold })
        lineWordsWidth += wordWidth
      })

      drawLine(line, false) // Draw the last remaining line (no justify)

      return currentY // Return the Y position for the *next* element
    }

    // --- 1. Manually construct the first page ---

    // Header
    const headerHeight = 100
    pdf.setFillColor('#1f2937') // slate-800
    pdf.rect(0, 0, pdfWidth, headerHeight, 'F')

    y = 38
    pdf.setFontSize(22)
    pdf.setFont(undefined, 'bold')
    pdf.setTextColor('#FFFFFF')
    pdf.text(reportTitle.value, margin, y)

    y += 22
    pdf.setFontSize(11)
    pdf.setFont(undefined, 'normal')
    pdf.setTextColor('#d1d5db') // gray-300

    // Manually construct the "Generated..." line to bold a part of it
    const generatedText = `Generated `
    const reportNameText = `${reportData.value.name} Report`
    const restOfText = ` on ${generatedDate.value} by ITIVA`
    pdf.text(generatedText, margin, y)
    const generatedTextWidth = pdf.getStringUnitWidth(generatedText) * pdf.getFontSize()
    pdf.setFont(undefined, 'bold')
    pdf.text(reportNameText, margin + generatedTextWidth, y)
    const reportNameWidth = pdf.getStringUnitWidth(reportNameText) * pdf.getFontSize()
    pdf.setFont(undefined, 'normal')
    pdf.text(restOfText, margin + generatedTextWidth + reportNameWidth, y)

    y += 18
    pdf.text(`For: ${authStore.currentUser?.companyName || 'Your Business'}`, margin, y)

    // Main Content
    y = headerHeight + 40

    // Executive Summary
    pdf.setFontSize(16)
    pdf.setFont(undefined, 'bold')
    pdf.setTextColor('#1f2937') // gray-800
    pdf.text('Executive Summary', margin, y)
    y += 30

    pdf.setTextColor('#4b5563') // gray-600
    const { name, scores, recommendations } = reportData.value
    const topRecText =
      recommendations.length > 0
        ? `${recommendations[0].category}`
        : 'maintaining current security standards'

    const summarySegments = [
      {
        text: 'This executive summary provides a high-level overview of the IT infrastructure vulnerability assessment conducted for ',
        bold: false,
      },
      { text: name, bold: true },
      { text: '. The overall security score of ', bold: false },
      { text: String(scores.overall), bold: true },
      {
        text: ' places the organization in a position with foundational security measures in place but highlights critical areas requiring immediate attention to mitigate significant risks.',
        bold: false,
      },
      { text: '\n\n', bold: false },
      { text: 'The assessment reveals a notable strength in the ', bold: false },
      { text: 'Devices & Network', bold: true },
      { text: ' category, scoring ', bold: false },
      { text: String(scores.dn), bold: true },
      {
        text: '. This indicates that core network security and device management protocols are relatively robust. However, this strength is contrasted by a considerable vulnerability in ',
        bold: false,
      },
      { text: 'Compliance Documentation', bold: true },
      { text: ', which scored a low ', bold: false },
      { text: String(scores.cd), bold: true },
      { text: '. This represents a major compliance and operational risk.', bold: false },
      { text: '\n\n', bold: false },
      {
        text: 'To bolster the overall security posture, it is imperative to prioritize the development and enforcement of comprehensive compliance documentation. Addressing the top recommendations, particularly focusing on areas like ',
        bold: false,
      },
      { text: topRecText, bold: true },
      {
        text: ", will have the most significant positive impact on improving the organization's resilience against cyber threats.",
        bold: false,
      },
    ]

    const finalSummaryY = drawMixedStyleText(
      pdf,
      summarySegments,
      margin,
      y,
      pdfWidth - margin * 2,
      11,
      1.6, // Increased line height for better readability
    )
    y = finalSummaryY + 20

    // Separator Line
    pdf.setDrawColor('#d1d5db') // Bolder gray-300
    pdf.setLineWidth(1.5)
    pdf.line(margin, y, pdfWidth - margin, y)
    y += 40

    // Score Breakdown & Radar Chart Section
    const sectionStartY = y
    const col1Width = (pdfWidth - margin * 2) / 2 - 20
    const col2X = margin + col1Width + 40

    pdf.setFontSize(14)
    pdf.setFont(undefined, 'bold')
    pdf.setTextColor('#1f2937')
    pdf.text('Score Breakdown', margin, y)
    y += 30

    // const scores = reportData.value.scores
    const scoreItems = [
      { label: 'Website Strength', score: scores.ws },
      { label: 'Devices & Network', score: scores.dn },
      { label: 'Compliance Documentation', score: scores.cd },
      { label: 'Cyber Security', score: scores.csi },
    ]

    pdf.setFontSize(11)
    scoreItems.forEach((item) => {
      pdf.setTextColor('#1f2937')
      pdf.setFont(undefined, 'bold')
      pdf.text(item.label, margin, y)
      const scoreColorRgb = hexToRgb(getScoreColor(item.score))
      pdf.setTextColor(scoreColorRgb[0], scoreColorRgb[1], scoreColorRgb[2])
      pdf.setFont(undefined, 'bold')
      pdf.text(String(item.score), margin + col1Width, y, { align: 'right' })
      pdf.setFont(undefined, 'normal')
      y += 25
    })

    y += 10
    pdf.setDrawColor('#d1d5db')
    pdf.setLineWidth(1.5)
    pdf.line(margin, y - 5, margin + col1Width, y - 5)
    pdf.setFontSize(12)
    pdf.setFont(undefined, 'bold')
    pdf.setTextColor('#1f2937')
    pdf.text('Overall Score', margin, y + 15)
    const overallScoreColorRgb = hexToRgb(getScoreColor(scores.overall))
    pdf.setTextColor(overallScoreColorRgb[0], overallScoreColorRgb[1], overallScoreColorRgb[2])
    pdf.setFontSize(14)
    pdf.text(String(scores.overall), margin + col1Width, y + 15, { align: 'right' })

    // Add final divider line
    const finalDividerY = Math.max(y + 30, sectionStartY + 160) // Ensure it's below content
    pdf.setDrawColor('#d1d5db')
    pdf.line(margin, finalDividerY, pdfWidth - margin, finalDividerY)

    // Radar Chart
    const chartCanvas = document.getElementById('pdfRadarChart')
    const chartImg = chartCanvas.toDataURL('image/png')
    const chartWidth = col1Width + 40 // Make chart slightly larger
    const chartHeight = (chartCanvas.height * chartWidth) / chartCanvas.width
    pdf.addImage(chartImg, 'PNG', col2X, sectionStartY - 10, chartWidth, chartHeight)

    // --- 2. Use jsPDF-AutoTable to generate the recommendations table ---
    if (reportData.value.recommendations && reportData.value.recommendations.length > 0) {
      pdf.addPage()
      pdf.autoTable({
        head: [['Recommendation', 'Category', 'Impact']],
        body: reportData.value.recommendations.map((rec) => [
          rec.text,
          rec.category,
          `+${rec.impactScore} pts`,
        ]),
        startY: margin,
        showHead: 'everyPage',
        styles: {
          fontSize: 11,
          cellPadding: { top: 10, right: 12, bottom: 6, left: 12 },
          valign: 'middle',
        },
        headStyles: {
          fillColor: '#f3f4f6',
          textColor: '#4b5563', // Black text color for headers
          fontStyle: 'bold',
          fontSize: 13,
        },
        columnStyles: {
          0: { cellWidth: 'auto', textColor: '#374151' }, // Recommendation col text is gray-700
          1: { halign: 'center', cellWidth: 120 }, // Center align Category column
          2: { halign: 'center', cellWidth: 80 }, // Center align Impact column
        },
        didParseCell: function (data) {
          // Center align the 'Category' header cell
          if (data.row.section === 'head' && data.column.index === 1) {
            data.cell.styles.halign = 'center'
          }
          // Style the 'Category' cells in the table body
          if (data.column.index === 1 && data.row.section === 'body') {
            data.cell.styles.fillColor = '#f3f4f6'
            data.cell.styles.textColor = '#4b5563' // Black text color
            data.cell.styles.fontStyle = 'bold'
          }
          // Style the 'Impact' cells in the table body
          if (data.column.index === 2 && data.row.section === 'body') {
            data.cell.styles.fontStyle = 'bold'
            data.cell.styles.textColor = '#16a34a'
          }
        },
      })
    }

    pdf.save(`ITIVA_Report_${reportData.value.name}.pdf`)
  } catch (error) {
    console.error('Failed to generate PDF:', error)
  } finally {
    // --- FIX: Ensure the source node is always hidden again ---
    if (sourceNode) {
      sourceNode.style.visibility = 'hidden'
      sourceNode.style.display = 'none'
      sourceNode.style.width = originalWidth // Restore original width
    }
    isDownloading.value = false
  }
}

// --- Lifecycle ---
onMounted(() => {
  // Fetch the report ID from the route parameters.
  const reportId = route.params.reportId
  // Fetch the full report object directly from the reportsStore using its ID.
  const fullReportObject = reportsStore.getReportById(reportId)

  // // --- DEBUGGING LOG ---
  // console.log('--- ReportViewerPage: Data Fetch ---')
  // console.log('Report ID from URL:', reportId)
  // console.log(
  //   'Full Report Object from store (fullReportObject):',
  //   JSON.parse(JSON.stringify(fullReportObject)),
  // )
  // if (fullReportObject) {
  //   console.log('Report Content (fullReportObject.report):', fullReportObject.report)
  //   console.log('Properties of report content:', Object.keys(fullReportObject.report || {}))
  // }
  // console.log('------------------------------------')
  // // --- END DEBUGGING LOG ---

  // Check if a valid report was found.
  if (fullReportObject && fullReportObject.report) {
    const reportContent = fullReportObject.report
    reportData.value = {
      name: fullReportObject.name,
      type: fullReportObject.type,
      scores: {
        ws: reportContent.ws,
        dn: reportContent.dn,
        cd: reportContent.cd,
        csi: reportContent.cs, // Map cs to csi for the chart
        overall: reportContent.overall,
      },
      // Use the generated recommendations directly
      // FIX: Ensure recommendations is always an array to prevent render errors.
      recommendations: reportContent.recommendations || [],
    }
  } else {
    console.error(`Report with ID "${reportId}" not found. Displaying default data.`)
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
              <p class="text-sm text-gray-300">
                Generated
                <span class="font-bold text-white">{{ reportData.name }} Report</span> on
                {{ generatedDate }} by ITIVA
              </p>
              <p class="text-sm text-gray-300">
                For: {{ authStore.currentUser?.companyName || 'Your Business' }}
              </p>
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
                      <td class="py-3 px-4 font-bold text-green-600 text-center">
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

    <!-- Hidden full report for PDF generation -->
    <div class="pdf-only" ref="fullReportForPdf">
      <div v-if="reportData" class="bg-white">
        <div id="pdf-static-content">
          <header class="bg-slate-800 text-white p-12">
            <h1 class="text-5xl font-bold mb-3">{{ reportTitle }}</h1>
            <p class="text-xl text-gray-300">
              Generated
              <span class="font-bold text-white">{{ reportData.name }} Report</span> on
              {{ generatedDate }} by ITIVA
            </p>
            <p class="text-xl text-gray-300">
              For: {{ authStore.currentUser?.companyName || 'Your Business' }}
            </p>
          </header>
          <main class="p-12">
            <section class="mb-8 pb-8 border-b">
              <h2 class="text-4xl font-bold text-gray-800 mb-6">Executive Summary</h2>
              <p class="text-2xl text-gray-600 leading-relaxed" v-html="summary"></p>
            </section>
            <section class="grid grid-cols-1 md:grid-cols-2 gap-12 mb-8 pb-8 border-b items-center">
              <div>
                <h2 class="text-3xl font-bold text-gray-800 mb-6">Score Breakdown</h2>
                <div class="space-y-4">
                  <div class="flex justify-between items-center">
                    <span class="font-medium text-2xl">Website Strength</span>
                    <span
                      class="font-bold text-3xl"
                      :style="{ color: getScoreColor(reportData.scores.ws) }"
                      >{{ reportData.scores.ws }}</span
                    >
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="font-medium text-2xl">Devices & Network</span>
                    <span
                      class="font-bold text-3xl"
                      :style="{ color: getScoreColor(reportData.scores.dn) }"
                      >{{ reportData.scores.dn }}</span
                    >
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="font-medium text-2xl">Compliance Documentation</span>
                    <span
                      class="font-bold text-3xl"
                      :style="{ color: getScoreColor(reportData.scores.cd) }"
                      >{{ reportData.scores.cd }}</span
                    >
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="font-medium text-2xl">Cyber Security</span>
                    <span
                      class="font-bold text-3xl"
                      :style="{ color: getScoreColor(reportData.scores.csi) }"
                      >{{ reportData.scores.csi }}</span
                    >
                  </div>
                  <div class="border-t pt-4 mt-4 flex justify-between items-center">
                    <span class="font-bold text-2xl">Overall Score</span
                    ><span
                      class="font-bold text-4xl"
                      :style="{ color: getScoreColor(reportData.scores.overall) }"
                      >{{ reportData.scores.overall }}</span
                    >
                  </div>
                </div>
              </div>
              <div class="w-full h-64 md:h-auto">
                <canvas id="pdfRadarChart"></canvas>
              </div>
            </section>
          </main>
        </div>
        <table id="pdf-recommendations-table" class="min-w-full bg-white">
          <thead class="bg-gray-100">
            <tr>
              <th class="py-5 px-8 text-left text-2xl font-bold text-gray-600 w-2/3">
                Recommendation
              </th>
              <th class="py-5 px-8 text-center text-2xl font-bold text-gray-600 w-1/6">Category</th>
              <th class="py-5 px-8 text-center text-2xl font-bold text-gray-600 w-24">Impact</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="rec in reportData.recommendations" :key="rec.text" class="border-b">
              <td class="py-5 px-8 text-2xl text-gray-700">{{ rec.text }}</td>
              <td class="py-5 px-8 bg-gray-100 text-center text-2xl font-medium text-gray-800">
                {{ rec.category }}
              </td>
              <td class="py-5 px-8 font-bold text-2xl text-green-600 text-center">
                +{{ rec.impactScore }} pts
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
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
