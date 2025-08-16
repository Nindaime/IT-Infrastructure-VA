// src/stores/auth.js
import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useAuth, useUser, useClerk } from '@clerk/vue'
import router from '@/router'
import { safeStorage } from '@/utils/errorHandler'

export const useAuthStore = defineStore('auth', () => {
  const { isSignedIn, isLoaded } = useAuth()
  const clerk = useClerk()
  const { user } = useUser()

  const cachedIsAuthenticated = ref(safeStorage.getItem('auth-isAuthenticated-cache', false))
  const cachedUser = ref(safeStorage.getItem('auth-user-cache', null))

  const isAuthenticated = computed(() => {
    if (!isLoaded.value) {
      return cachedIsAuthenticated.value
    }
    return isSignedIn.value
  })

  const currentUser = computed(() => {
    if (!isLoaded.value) {
      return cachedUser.value
    }
    return user.value
  })

  const userFullName = computed(() => {
    const u = currentUser.value
    if (u) {
      return `${u.firstName || ''} ${u.lastName || ''}`.trim()
    }
    return ''
  })

  const userName = computed(() => currentUser.value?.username || '')

  const userEmail = computed(() => {
    const u = currentUser.value
    if (u && u.primaryEmailAddress) {
      return u.primaryEmailAddress.emailAddress
    }
    return u?.email || ''
  })

  const isAdmin = computed(() => {
    const u = currentUser.value
    return u?.publicMetadata?.role === 'admin'
  })

  const companyName = computed(() => {
    const u = currentUser.value
    if (!u) return ''
    return u.publicMetadata?.companyName || u.unsafeMetadata?.companyName || ''
  })

  watch(
    [isSignedIn, user, isLoaded],
    ([newIsSignedIn, newUser, newIsLoaded]) => {
      if (newIsLoaded) {
        safeStorage.setItem('auth-isAuthenticated-cache', newIsSignedIn)
        cachedIsAuthenticated.value = newIsSignedIn

        if (newIsSignedIn && newUser) {
          // console.log('User metadata:', newUser.unsafeMetadata) // Log user metadata
          const userToCache = {
            id: newUser.id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            username: newUser.username,
            email: newUser.primaryEmailAddress.emailAddress,
            publicMetadata: newUser.unsafeMetadata,
            imageUrl: newUser.imageUrl, // Cache the image URL
          }
          safeStorage.setItem('auth-user-cache', userToCache)
          cachedUser.value = userToCache
        } else {
          safeStorage.removeItem('auth-user-cache')
          cachedUser.value = null
        }
      }
    },
    { immediate: true },
  )

  // --- Actions ---
  const logout = async () => {
    if (clerk.value) {
      try {
        await clerk.value.signOut()
        router.push('/login')
      } catch (error) {
        console.error('Error during sign out:', error)
        throw error
      }
    }
  }

  return {
    // State
    isAuthenticated,
    currentUser,
    isClerkLoaded: isLoaded,

    // Getters
    userFullName,
    userName,
    userEmail,
    isAdmin,
    companyName,

    // Actions
    logout,
  }
})
