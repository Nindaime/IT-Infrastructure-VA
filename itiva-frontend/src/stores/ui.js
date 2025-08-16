import { ref, watchEffect } from 'vue'
import { defineStore } from 'pinia'
import { safeStorage } from '@/utils/errorHandler'

/**
 * @description UI store for managing global UI state.
 */
export const useUiStore = defineStore('ui', () => {
  // --- Theme Management ---
  // Default to 'light' if nothing stored
  const theme = ref(safeStorage.getItem('app-theme', 'light'))

  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    safeStorage.setItem('app-theme', theme.value)
  }

  // --- Scroll Container Management ---
  const mainScrollContainer = ref(null)
  function setMainScrollContainer(element) {
    mainScrollContainer.value = element
  }

  return {
    // Theme
    theme,
    toggleTheme,
    // Scroll Container
    mainScrollContainer,
    setMainScrollContainer,
  }
})