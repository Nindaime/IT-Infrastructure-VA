// src/stores/assessment.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

// In a real app, you might fetch this from an API
const assessmentTypesData = [
  'Standard ITIVA Assessment',
  'Advanced Cloud Security Check',
  'GDPR Compliance Audit',
]

export const useAssessmentStore = defineStore('assessment', () => {
  const availableAssessments = ref(assessmentTypesData)
  const currentReport = ref(null)
  const currentReportName = ref('')
  const currentReportType = ref('')

  function setGeneratedReport(report, name, type) {
    currentReport.value = report
    currentReportName.value = name
    currentReportType.value = type
    // Persist to sessionStorage to survive a page refresh
    sessionStorage.setItem('lastReport', JSON.stringify({ report, name, type }))
  }

  // On store initialization, try to load the last report from sessionStorage
  const lastReportFromSession = sessionStorage.getItem('lastReport')
  if (lastReportFromSession) {
    try {
      const { report, name, type } = JSON.parse(lastReportFromSession)
      currentReport.value = report
      currentReportName.value = name
      currentReportType.value = type
    } catch (e) {
      console.error('Failed to parse lastReport from sessionStorage', e)
    }
  }

  return {
    availableAssessments,
    currentReport,
    currentReportName,
    currentReportType,
    setGeneratedReport,
  }
})
