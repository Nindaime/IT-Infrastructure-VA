/**
 * @file src/stores/reports.js
 * @description Manages the persistent storage and retrieval of all user-generated
 * reports and saved drafts. This store handles the main list of reports displayed
 * on the dashboard and provides actions to add, update, and delete them.
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { safeStorage } from '@/utils/errorHandler'
import { validateReportData, validateRequiredFields } from '@/utils/testUtils'
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
    status: 'completed', // All initial reports are completed
    isDraft: false,
  }
})

export const useReportsStore = defineStore('reports', () => {
  // State
  const completedReports = ref([])
  const draftReports = ref([])

  // Load reports from localStorage
  const loadReportsFromStorage = () => {
    try {
      const storedCompleted = safeStorage.getItem('reports-completed', [])
      const storedDrafts = safeStorage.getItem('reports-drafts', [])

      if (Array.isArray(storedCompleted)) {
        completedReports.value = storedCompleted
      }

      if (Array.isArray(storedDrafts)) {
        draftReports.value = storedDrafts
      }
    } catch (error) {
      console.error('Error loading reports from storage:', error)
    }
  }

  // Save reports to localStorage
  const saveReportsToStorage = () => {
    try {
      safeStorage.setItem('reports-completed', completedReports.value)
      safeStorage.setItem('reports-drafts', draftReports.value)
      return true
    } catch (error) {
      console.error('Error saving reports to storage:', error)
      return false
    }
  }

  // Initialize store
  loadReportsFromStorage()

  // Computed properties
  const userReports = computed(() => {
    try {
      const allReports = [
        ...completedReports.value.map((report) => ({ ...report, isDraft: false })),
        ...draftReports.value.map((report) => ({ ...report, isDraft: true })),
      ]

      // Sort by date (newest first)
      return allReports.sort((a, b) => new Date(b.date) - new Date(a.date))
    } catch (error) {
      console.error('Error computing user reports:', error)
      return []
    }
  })

  const hasDrafts = computed(() => {
    return draftReports.value.length > 0
  })

  const totalReports = computed(() => {
    return completedReports.value.length + draftReports.value.length
  })

  const averageScore = computed(() => {
    try {
      if (completedReports.value.length === 0) {
        return 0
      }

      const totalScore = completedReports.value.reduce((sum, report) => {
        return sum + (report.score || 0)
      }, 0)

      return Math.round(totalScore / completedReports.value.length)
    } catch (error) {
      console.error('Error computing average score:', error)
      return 0
    }
  })

  // Actions
  const addReport = (reportData) => {
    try {
      // Validate required fields
      validateRequiredFields(reportData, ['name', 'date', 'type', 'score', 'report'])

      // Validate report data structure
      const validation = validateReportData(reportData)
      if (!validation.isValid) {
        throw new Error(`Report validation failed: ${validation.errors.join(', ')}`)
      }

      // Check if report with same name already exists
      const existingReport = completedReports.value.find((r) => r.name === reportData.name)
      if (existingReport) {
        throw new Error('A report with this name already exists')
      }

      // Create new report
      const newReport = {
        id: `report-${Date.now()}`,
        name: reportData.name,
        date: reportData.date,
        type: reportData.type,
        score: reportData.score,
        report: reportData.report,
        createdAt: new Date().toISOString(),
      }

      // Add to store
      completedReports.value.push(newReport)

      // Save to storage
      saveReportsToStorage()

      return { success: true, report: newReport }
    } catch (error) {
      console.error('Error adding report:', error)
      throw error
    }
  }

  /**
   * Intelligent action to either add a new draft or update an existing one.
   * This is the primary method for saving progress to the user's main draft list.
   * @param {object} draftData The complete draft object from the assessment store.
   */
  const saveOrUpdateDraft = (draftData) => {
    try {
      validateRequiredFields(draftData, ['id', 'name', 'date', 'type', 'questions', 'answers'])

      // Check if a draft with the same *ID* already exists in our list.
      const draftIndex = draftReports.value.findIndex((d) => d.id === draftData.id)

      if (draftIndex !== -1) {
        // --- UPDATE PATH ---
        // A draft with this ID exists, so we update it in place.
        const existingNameConflict = draftReports.value.find(
          (d) => d.name === draftData.name && d.id !== draftData.id,
        )
        if (existingNameConflict) throw new Error('Another draft with this name already exists.')

        draftReports.value[draftIndex] = {
          ...draftReports.value[draftIndex],
          ...draftData,
          lastModified: new Date().toISOString(),
        }
        saveReportsToStorage()
        return { success: true, draft: draftReports.value[draftIndex], operation: 'updated' }
      } else {
        // --- ADD PATH ---
        // No draft with this ID exists. This is a new assessment being saved for the first time.
        // We must ensure the chosen name is unique before adding.
        if (draftReports.value.find((d) => d.name === draftData.name))
          throw new Error('A draft with this name already exists.')

        const newDraft = {
          ...draftData,
          createdAt: new Date().toISOString(),
          lastModified: new Date().toISOString(),
        }
        draftReports.value.push(newDraft)
        saveReportsToStorage()
        return { success: true, draft: newDraft, operation: 'added' }
      }
    } catch (error) {
      console.error('Error in saveOrUpdateDraft:', error)
      throw error
    }
  }

  // const addDraftReport = (draftData) => {
  //   try {
  //     // Validate required fields
  //     validateRequiredFields(draftData, ['name', 'date', 'type'])

  //     // Check if draft with same name already exists
  //     const existingDraft = draftReports.value.find((d) => d.name === draftData.name)
  //     if (existingDraft) {
  //       throw new Error('A draft with this name already exists')
  //     }

  //     // Create new draft report
  //     const newDraft = {
  //       id: `draft-${Date.now()}`,
  //       name: draftData.name,
  //       date: draftData.date,
  //       type: draftData.type,
  //       lastModified: draftData.lastModified || new Date().toISOString(),
  //       createdAt: new Date().toISOString(),
  //     }

  //     // Add to store
  //     draftReports.value.push(newDraft)

  //     // Save to storage
  //     saveReportsToStorage()

  //     return { success: true, draft: newDraft }
  //   } catch (error) {
  //     console.error('Error adding draft report:', error)
  //     throw error
  //   }
  // }

  // const updateDraftReport = (draftId, updates) => {
  //   try {
  //     if (!draftId) {
  //       throw new Error('Draft ID is required')
  //     }

  //     // Find draft index
  //     const draftIndex = draftReports.value.findIndex((d) => d.id === draftId)
  //     if (draftIndex === -1) {
  //       throw new Error('Draft not found')
  //     }

  //     // Validate updates
  //     if (updates.name) {
  //       const existingDraft = draftReports.value.find(
  //         (d) => d.name === updates.name && d.id !== draftId,
  //       )
  //       if (existingDraft) {
  //         throw new Error('A draft with this name already exists')
  //       }
  //     }

  //     // Apply updates
  //     draftReports.value[draftIndex] = {
  //       ...draftReports.value[draftIndex],
  //       ...updates,
  //       lastModified: new Date().toISOString(),
  //     }

  //     // Save to storage
  //     saveReportsToStorage()

  //     return { success: true, draft: draftReports.value[draftIndex] }
  //   } catch (error) {
  //     console.error('Error updating draft report:', error)
  //     throw error
  //   }
  // }

  const completeDraftReport = (draftId, reportData) => {
    try {
      if (!draftId) {
        throw new Error('Draft ID is required')
      }

      // Validate report data
      const validation = validateReportData(reportData)
      if (!validation.isValid) {
        throw new Error(`Report validation failed: ${validation.errors.join(', ')}`)
      }

      // Find draft index
      const draftIndex = draftReports.value.findIndex((d) => d.id === draftId)
      if (draftIndex === -1) {
        throw new Error('Draft not found')
      }

      // Create completed report
      const completedReport = {
        id: `report-${Date.now()}`,
        name: reportData.name,
        date: reportData.date,
        type: reportData.type,
        score: reportData.score,
        report: reportData.report,
        createdAt: new Date().toISOString(),
        completedFromDraft: draftId,
      }

      // Add to completed reports
      completedReports.value.push(completedReport)

      // Remove from draft reports
      draftReports.value.splice(draftIndex, 1)

      // Save to storage
      saveReportsToStorage()

      return { success: true, report: completedReport }
    } catch (error) {
      console.error('Error completing draft report:', error)
      throw error
    }
  }

  const deleteReport = (reportId) => {
    try {
      if (!reportId) {
        throw new Error('Report ID is required')
      }

      // Try to find in completed reports
      let reportIndex = completedReports.value.findIndex((r) => r.id === reportId)
      if (reportIndex !== -1) {
        completedReports.value.splice(reportIndex, 1)
        saveReportsToStorage()
        return { success: true, type: 'completed' }
      }

      // Try to find in draft reports
      reportIndex = draftReports.value.findIndex((r) => r.id === reportId)
      if (reportIndex !== -1) {
        draftReports.value.splice(reportIndex, 1)
        saveReportsToStorage()
        return { success: true, type: 'draft' }
      }

      // *** FIX: Instead of throwing an error, handle the "not found" case gracefully. ***
      // This is expected when completing a new assessment that was never saved as a named draft.
      console.warn(`Attempted to delete report with ID '${reportId}', but it was not found.`)
      return { success: false, message: 'Report not found' }
    } catch (error) {
      // Re-throw any other unexpected errors.
      console.error('Error deleting report:', error)
      throw error
    }
  }

  const getReportById = (reportId) => {
    try {
      if (!reportId) {
        throw new Error('Report ID is required')
      }

      // Search in completed reports
      const completedReport = completedReports.value.find((r) => r.id === reportId)
      if (completedReport) {
        return { ...completedReport, isDraft: false }
      }

      // Search in draft reports
      const draftReport = draftReports.value.find((r) => r.id === reportId)
      if (draftReport) {
        return { ...draftReport, isDraft: true }
      }

      return null
    } catch (error) {
      console.error('Error getting report by ID:', error)
      return null
    }
  }

  const getDraftById = (draftId) => {
    try {
      if (!draftId) {
        throw new Error('Draft ID is required')
      }

      return draftReports.value.find((d) => d.id === draftId) || null
    } catch (error) {
      console.error('Error getting draft by ID:', error)
      return null
    }
  }

  const getLatestDraftByType = (type) => {
    try {
      if (!type) {
        throw new Error('Type is required')
      }

      const draftsOfType = draftReports.value
        .filter((d) => d.type === type)
        .sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified))

      return draftsOfType[0] || null
    } catch (error) {
      console.error('Error getting latest draft by type:', error)
      return null
    }
  }

  const getReportsByType = (type) => {
    try {
      if (!type) {
        throw new Error('Type is required')
      }

      return completedReports.value.filter((r) => r.type === type)
    } catch (error) {
      console.error('Error getting reports by type:', error)
      return []
    }
  }

  const getReportsByDateRange = (startDate, endDate) => {
    try {
      if (!startDate || !endDate) {
        throw new Error('Start date and end date are required')
      }

      const start = new Date(startDate)
      const end = new Date(endDate)

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new Error('Invalid date format')
      }

      return completedReports.value.filter((report) => {
        const reportDate = new Date(report.date)
        return reportDate >= start && reportDate <= end
      })
    } catch (error) {
      console.error('Error getting reports by date range:', error)
      return []
    }
  }

  const clearAllReports = () => {
    try {
      completedReports.value = []
      draftReports.value = []
      saveReportsToStorage()
      return { success: true }
    } catch (error) {
      console.error('Error clearing all reports:', error)
      throw error
    }
  }

  return {
    // State
    completedReports,
    initialReports,
    draftReports,

    // Computed
    userReports,
    hasDrafts,
    totalReports,
    averageScore,

    // Actions
    addReport,
    saveOrUpdateDraft,
    // addDraftReport,
    // updateDraftReport,
    completeDraftReport,
    deleteReport,
    getReportById,
    getDraftById,
    getLatestDraftByType,
    getReportsByType,
    getReportsByDateRange,
    clearAllReports,

    // Storage methods
    loadReportsFromStorage,
    saveReportsToStorage,
  }
})
