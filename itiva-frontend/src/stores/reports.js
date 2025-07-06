/**
 * @file src/stores/reports.js
 * @description Manages the persistent storage and retrieval of all user-generated
 * reports and saved drafts. This store handles the main list of reports displayed
 * on the dashboard and provides actions to add, update, and delete them.
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from './auth'
import { v4 as uuidv4 } from 'uuid'
import { safeStorage } from '@/utils/errorHandler'
import { validateReportData, validateRequiredFields } from '@/utils/testUtils'

export const useReportsStore = defineStore('reports', () => {
  // --- State ---
  // These now hold ALL reports for ALL users. Filtering happens in getters.
  const allCompletedReports = ref([])
  const allDraftReports = ref([])

  // Load reports from localStorage
  const loadReportsFromStorage = () => {
    try {
      const storedCompleted = safeStorage.getItem('reports-completed', [])
      const storedDrafts = safeStorage.getItem('reports-drafts', [])

      if (Array.isArray(storedCompleted)) {
        allCompletedReports.value = storedCompleted
      }

      if (Array.isArray(storedDrafts)) {
        allDraftReports.value = storedDrafts
      }
    } catch (error) {
      console.error('Error loading reports from storage:', error)
    }
  }

  // Save reports to localStorage
  const saveReportsToStorage = () => {
    try {
      safeStorage.setItem('reports-completed', allCompletedReports.value)
      safeStorage.setItem('reports-drafts', allDraftReports.value)
    } catch (error) {
      console.error('Error saving reports to storage:', error)
    }
  }

  // --- Computed Properties (Getters) ---
  // These are now dynamic and only return data for the logged-in user.

  const completedReports = computed(() => {
    // Get the current user's ID. If no user is logged in, this will be undefined.
    const currentAuthStore = useAuthStore()
    const currentUserId = currentAuthStore.currentUser?.id
    if (!currentUserId) return [] // Return an empty array if no user is logged in.
    // Filter the global list to get reports only for the current user.
    return allCompletedReports.value.filter((report) => report.userId === currentUserId)
  })

  const draftReports = computed(() => {
    // Get the current user's ID.
    const currentAuthStore = useAuthStore()
    const currentUserId = currentAuthStore.currentUser?.id
    if (!currentUserId) return [] // Return an empty array if no user is logged in.
    // Filter the global list to get drafts only for the current user.
    return allDraftReports.value.filter((draft) => draft.userId === currentUserId)
  })

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

  // --- Actions ---
  /**
   * Adds a new completed report for the current user.
   * @param {object} reportData - The report object, without userId.
   */
  const addReport = (reportData) => {
    const authStore = useAuthStore()
    // Ensure the user is logged in before adding a report.
    // This will ensure that only authenticated users can add reports.
    // This is a critical security measure to prevent unauthorized report creation.
    // If the user is not logged in, we throw an error.
    // This prevents unauthorized users from adding reports.

    // FIX: Check for currentUser.id, not a non-existent userId property.

    if (!authStore.currentUser?.id) throw new Error('User must be logged in to add a report.')

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

    const newReport = {
      ...reportData,
      id: uuidv4(), // Ensure unique ID for the report
      userId: authStore.currentUser.id, // Associate with the current user's ID
      createdAt: new Date().toISOString(),
    }
    allCompletedReports.value.push(newReport)
    saveReportsToStorage()
    return newReport
  }

  /**
   * Intelligent action to either add a new draft or update an existing one.
   * This is the primary method for saving progress to the user's main draft list.
   * @param {object} draftData The complete draft object from the assessment store.
   */
  const saveOrUpdateDraft = (draftData) => {
    try {
      const authStore = useAuthStore()
      // Ensure the user is logged in before saving a draft.
      // FIX: Check for currentUser.id
      if (!authStore.currentUser?.id) throw new Error('User must be logged in to save a draft.')

      validateRequiredFields(draftData, ['id', 'name', 'date', 'type', 'questions', 'answers'])

      // Check if a draft with the same *ID* already exists in our list.
      const draftIndex = allDraftReports.value.findIndex((d) => d.id === draftData.id)

      if (draftIndex !== -1) {
        // --- UPDATE PATH ---
        // A draft with this ID exists, so we update it in place.
        const existingNameConflict = draftReports.value.find(
          (d) => d.name === draftData.name && d.id !== draftData.id,
        )
        if (existingNameConflict) throw new Error('Another draft with this name already exists.')

        allDraftReports.value[draftIndex] = {
          ...allDraftReports.value[draftIndex],
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
          id: draftData.id || uuidv4(),
          userId: authStore.currentUser.id,
          createdAt: new Date().toISOString(),
          lastModified: new Date().toISOString(),
        }
        allDraftReports.value.push(newDraft)
        saveReportsToStorage()
        return { success: true, draft: newDraft, operation: 'added' }
      }
    } catch (error) {
      console.error('Error in saveOrUpdateDraft:', error)
      throw error
    }
  }

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

  /**
   * Deletes a report or a draft for the current user.
   * @param {string} reportId - The ID of the report/draft to delete.
   */
  const deleteReport = (reportId) => {
    const authStore = useAuthStore()
    if (!authStore.currentUser?.id) throw new Error('Authentication required.')

    // Check and remove from completed reports
    let index = allCompletedReports.value.findIndex(
      (r) => r.id === reportId && r.userId === authStore.currentUser.id,
    )
    if (index !== -1) {
      allCompletedReports.value.splice(index, 1)
      saveReportsToStorage()
      return { success: true, type: 'completed' }
    }

    // Check and remove from drafts
    index = allDraftReports.value.findIndex(
      (d) => d.id === reportId && d.userId === authStore.currentUser.id,
    )
    if (index !== -1) {
      allDraftReports.value.splice(index, 1)
      saveReportsToStorage()
      return { success: true, type: 'draft' }
    }

    // Instead of throwing an error, which breaks the submission flow,
    // we can just log a warning. This is an expected and normal scenario when a user
    // completes a new assessment that was never saved to the main draft list.
    console.warn(
      `Attempted to delete report/draft with ID '${reportId}', but it was not found. This is normal for new assessments.`,
    )
    return { success: false, message: 'Report not found' } // Return a non-error state
  }

  const getReportById = (reportId) => {
    try {
      const authStore = useAuthStore()
      const currentUserId = authStore.currentUser?.id

      if (!reportId) {
        // throw new Error('Report ID is required')
        console.error('getReportById called without a reportId.')
        return null
      }

      // Search in all completed reports first
      const completedReport = allCompletedReports.value.find((r) => r.id === reportId)
      if (completedReport) {
        // Security check: ensure the report belongs to the current user
        if (completedReport.userId === currentUserId) {
          return { ...completedReport, isDraft: false }
        }
      }

      // Search in draft reports
      const draftReport = allDraftReports.value.find((r) => r.id === reportId)
      if (draftReport) {
        // Security check for drafts
        if (draftReport.userId === currentUserId) {
          return { ...draftReport, isDraft: true }
        }
      }

      // If not found in either or user does not have permission, return null
      return null // Explicitly return null if no report is found or accessible
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

      return draftReports.value.find((d) => d.id === draftId)
    } catch (error) {
      console.error('Error getting draft by ID:', error)
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
      allCompletedReports.value = []
      allDraftReports.value = []
      saveReportsToStorage()
      return { success: true }
    } catch (error) {
      console.error('Error clearing all reports:', error)
      throw error
    }
  }

  // Initial load from storage when the store is created
  loadReportsFromStorage()

  return {
    // State
    completedReports,
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
