// src/stores/reports.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { generateMockReport } from '@/utils/reportGenerator'

// Initial mock data for reports, used if nothing is in sessionStorage
const reportsWithTargets = [
  {
    id: 1,
    name: 'Q1 2024 IT Security Audit',
    date: '2024-03-15',
    type: 'Standard ITIVA Assessment',
    targetScores: { ws: 78, dn: 85, cd: 60, cs: 90 },
  },
  {
    id: 2,
    name: 'Cloud Infrastructure Review',
    date: '2024-02-01',
    type: 'Advanced Cloud Security Check',
    targetScores: { ws: 92, dn: 88, cd: 75, cs: 85 },
  },
  {
    id: 3,
    name: 'Network Penetration Test',
    date: '2024-01-20',
    type: 'GDPR Compliance Audit',
    targetScores: { ws: 65, dn: 70, cd: 55, cs: 62 },
  },
]

const initialReports = reportsWithTargets.map((r) => {
  const generatedReport = generateMockReport(r.targetScores)
  return {
    ...r,
    score: generatedReport.overall,
    report: generatedReport,
  }
})

export const useReportsStore = defineStore('reports', () => {
  const userReports = ref([])

  function _saveToSession() {
    sessionStorage.setItem('userReports', JSON.stringify(userReports.value))
  }

  function addReport(reportDetails) {
    const existingReportIndex = userReports.value.findIndex((r) => r.type === reportDetails.type)

    if (existingReportIndex !== -1) {
      // Overwrite existing report of the same type
      userReports.value[existingReportIndex] = {
        ...userReports.value[existingReportIndex], // Keep old ID
        ...reportDetails,
      }
    } else {
      // Add as a new report
      const newId =
        userReports.value.length > 0 ? Math.max(...userReports.value.map((r) => r.id)) + 1 : 1
      userReports.value.unshift({ id: newId, ...reportDetails })
    }
    _saveToSession()
  }

  function deleteReport(reportId) {
    userReports.value = userReports.value.filter((report) => report.id !== reportId)
    _saveToSession()
  }

  // Initialize state from sessionStorage or with initial data
  const storedReports = sessionStorage.getItem('userReports')
  if (storedReports) {
    try {
      userReports.value = JSON.parse(storedReports)
    } catch (e) {
      userReports.value = initialReports
    }
  } else {
    userReports.value = initialReports
  }

  return { userReports, addReport, deleteReport }
})
