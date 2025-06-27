// src/stores/auth.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const isLoggedIn = ref(false)
  const isAdmin = ref(false)
  const userName = ref('Guest')

  // Action to set login state
  function setLoginState(loggedIn, admin, name) {
    isLoggedIn.value = loggedIn
    isAdmin.value = admin
    userName.value = name
    // For persistence across refreshes (in a real app, this would be a token)
    sessionStorage.setItem(
      'authState',
      JSON.stringify({ isLoggedIn: loggedIn, isAdmin: admin, userName: name }),
    )
  }

  // Action to log out
  function logout() {
    isLoggedIn.value = false
    isAdmin.value = false
    userName.value = 'Guest'
    sessionStorage.removeItem('authState') // Clear persisted state
  }

  // Attempt to load initial state from sessionStorage (for persistence)
  const storedState = sessionStorage.getItem('authState')
  if (storedState) {
    try {
      const authState = JSON.parse(storedState)
      isLoggedIn.value = authState.isLoggedIn
      isAdmin.value = authState.isAdmin
      userName.value = authState.userName
    } catch (e) {
      console.error('Failed to parse authState from sessionStorage on store init', e)
      sessionStorage.removeItem('authState')
    }
  }

  return { isLoggedIn, isAdmin, userName, setLoginState, logout }
})
