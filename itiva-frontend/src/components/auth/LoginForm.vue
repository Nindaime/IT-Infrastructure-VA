<!-- src/components/auth/LoginForm.vue -->
<script setup lang="ts">
import type { ClerkAPIResponseError, OAuthStrategy } from '@clerk/types'
import { ref, inject, watch } from 'vue'
import { useSignIn, useClerk, GoogleOneTap } from '@clerk/vue'
import { useRouter } from 'vue-router'

const { signIn, isLoaded } = useSignIn()
const clerk = useClerk()
const router = useRouter()
const showToast = inject('showToast')

// Form state
const identifier = ref('')
const password = ref('')
const mfaCode = ref('')

// Component state
const isSubmitting = ref(false)
const errorMessage = ref('')
const showPassword = ref(false)
const step = ref('loading')

// Watch for Clerk to be loaded to set the initial step.
// This ensures that if a sign-in is already in progress (e.g., after a page refresh),
// the UI shows the correct step.
watch(
  isLoaded,
  (loaded) => {
    if (loaded) {
      step.value = signIn.value?.status === 'needs_first_factor' ? 'password' : 'identifier'
    }
  },
  { immediate: true },
)

// Handles successful sign-in completion
const onSignInComplete = async (signInResult) => {
  try {
    await clerk.value.setActive({ session: signInResult.createdSessionId })
    showToast('Sign in successful! Redirecting...', 'success')
    await router.push('/dashboard')
  } catch (e) {
    console.error('Error during session activation or redirect:', e)
    errorMessage.value = 'Login was successful, but redirect failed. Please refresh the page.'
    isSubmitting.value = false
  }
}

// Handles the submission of the identifier (email or username)
const submitIdentifier = async () => {
  if (!isLoaded.value || !signIn.value) return
  isSubmitting.value = true
  errorMessage.value = ''

  try {
    const signInAttempt = await signIn.value.create({
      identifier: identifier.value,
    })

    if (signInAttempt.status === 'complete') {
      await onSignInComplete(signInAttempt)
    } else if (signInAttempt.status === 'needs_first_factor') {
      // Manually advance to the password step to ensure UI updates.
      step.value = 'password'
      isSubmitting.value = false
    }
  } catch (err) {
    const clerkError = err as ClerkAPIResponseError
    console.error('Sign in error:', JSON.parse(JSON.stringify(clerkError, null, 2)))
    errorMessage.value =
      clerkError.errors?.[0]?.longMessage ||
      'The email or username you entered is incorrect. Please try again.'
    isSubmitting.value = false
  }
}

// Handles the submission of the password
const submitPassword = async () => {
  if (!isLoaded.value || !signIn.value) return
  isSubmitting.value = true
  errorMessage.value = ''

  try {
    const result = await signIn.value.attemptFirstFactor({
      strategy: 'password',
      password: password.value,
    })

    if (result.status === 'complete') {
      await onSignInComplete(result)
    } else if (result.status === 'needs_second_factor') {
      step.value = 'mfa'
      isSubmitting.value = false
    }
  } catch (err) {
    const clerkError = err as ClerkAPIResponseError
    console.error('Password attempt error:', JSON.parse(JSON.stringify(clerkError, null, 2)))
    errorMessage.value =
      clerkError.errors?.[0]?.longMessage || 'Incorrect password. Please try again.'
    password.value = '' // Clear password on error
    isSubmitting.value = false
  }
}

const submitMfaCode = async () => {
  if (!isLoaded.value || !signIn.value) return
  isSubmitting.value = true
  errorMessage.value = ''

  try {
    const result = await signIn.value.attemptSecondFactor({
      strategy: 'totp',
      code: mfaCode.value,
    })

    if (result.status === 'complete') {
      await onSignInComplete(result)
    } else {
      // This case is not expected for TOTP but handled for completeness
      errorMessage.value = 'An unexpected error occurred during MFA verification.'
    }
  } catch (err) {
    const clerkError = err as ClerkAPIResponseError
    console.error('MFA error:', JSON.parse(JSON.stringify(clerkError, null, 2)))
    errorMessage.value = clerkError.errors?.[0]?.longMessage || 'Invalid MFA code. Please try again.'
    mfaCode.value = '' // Clear MFA code on error
  } finally {
    isSubmitting.value = false
  }
}

// Main sign-in handler that delegates to the correct function based on the current step
const handleSignIn = async () => {
  if (step.value === 'identifier') {
    await submitIdentifier()
  } else if (step.value === 'password') {
    await submitPassword()
  } else if (step.value === 'mfa') {
    await submitMfaCode()
  }
}

// Handles sign-in with social providers like Google or Facebook
const signInWithSocial = async (strategy: OAuthStrategy) => {
  if (!isLoaded.value || !signIn.value) return
  isSubmitting.value = true
  try {
    await signIn.value.authenticateWithRedirect({
      strategy,
      redirectUrl: '/link-accounts',
      redirectUrlComplete: '/dashboard',
    })
  } catch (err) {
    const clerkError = err as ClerkAPIResponseError
    console.error('Social sign in error:', JSON.parse(JSON.stringify(clerkError, null, 2)))
    errorMessage.value = clerkError.errors?.[0]?.longMessage || 'Failed to sign in with provider.'
    isSubmitting.value = false
  }
}

// Resets the sign-in flow to the beginning
const goBack = async () => {
  if (!isLoaded.value || !signIn.value) return
  isSubmitting.value = true // Prevent user interaction during reset
  try {
    // This creates a new sign-in attempt, effectively resetting the state.
    await signIn.value.create({})
    identifier.value = ''
    password.value = ''
    mfaCode.value = ''
    errorMessage.value = ''
    step.value = 'identifier' // Manually reset the step to ensure UI updates
  } catch (err) {
    console.error('Error resetting sign-in flow:', err)
    errorMessage.value = 'An unexpected error occurred. Please reload the page.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <!-- This single root div is the key to making the parent transition work -->
  <div>
    <div v-if="step === 'loading'" class="flex justify-center items-center p-8">
      <svg
        class="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <span>Loading...</span>
    </div>
    <div v-else class="space-y-6">
      <!-- Google One Tap will render a pop-up if the user has a session with Google -->
      <GoogleOneTap v-if="isLoaded" />

      <div class="space-y-4">
        <button
          @click="signInWithSocial('oauth_google')"
          :disabled="isSubmitting"
          class="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors cursor-pointer"
        >
          <svg class="w-5 h-5" role="img" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <title>Google</title>
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
            ></path>
            <path
              fill="#4285F4"
              d="M46.98 24.55c0-1.57-.15-3.09-.42-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
            ></path>
            <path
              fill="#FBBC05"
              d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
            ></path>
            <path
              fill="#34A853"
              d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
            ></path>
            <path fill="none" d="M0 0h48v48H0z"></path>
          </svg>
          <span class="text-sm font-medium text-gray-700">Continue with Google</span>
        </button>
        <button
          @click="signInWithSocial('oauth_facebook')"
          :disabled="isSubmitting"
          class="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors cursor-pointer"
        >
          <svg
            class="w-5 h-5 text-[#1877F2]"
            role="img"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
          >
            <title>Facebook</title>
            <path
              d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
            />
          </svg>
          <span class="text-sm font-medium text-gray-700">Continue with Facebook</span>
        </button>
      </div>

      <div class="flex items-center">
        <hr class="w-full border-t border-gray-300" />
        <span class="px-2 text-xs font-medium text-gray-500">OR</span>
        <hr class="w-full border-t border-gray-300" />
      </div>

      <form @submit.prevent="handleSignIn" class="space-y-6 overflow-hidden">
        <transition name="slide-left" mode="out-in">
          <!-- Identifier Step -->
          <div v-if="step === 'identifier'" key="identifier">
            <div>
              <label for="identifier" class="block text-sm font-medium text-gray-700 mb-1"
                >Email address or username</label
              >
              <input
                v-model="identifier"
                type="text"
                id="identifier"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., john.doe@example.com"
                required
                autocomplete="username"
              />
            </div>
          </div>

          <!-- Password Step -->
          <div v-else-if="step === 'password'" key="password">
            <div class="flex justify-between items-center mb-2">
              <p class="text-sm text-gray-600">
                Signing in as
                <strong class="font-medium text-gray-800">{{ signIn.identifier }}</strong>
              </p>
              <button
                type="button"
                @click="goBack"
                class="text-sm font-medium text-blue-600 hover:underline"
              >
                Change
              </button>
            </div>
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 mb-1"
                >Password</label
              >
              <div class="relative">
                <input
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  id="password"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••••"
                  required
                  autocomplete="current-password"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  <svg
                    v-if="!showPassword"
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7S3.732 16.057 2.458 12z"
                    />
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7 .925-2.945 3.26-5.235 6.16-6.235M15.25 10.5A3.25 3.25 0 0012 7.25a3.25 3.25 0 00-3.25 3.25M15.25 10.5c0 .25-.03.5-.084.741M12 13.75a3.25 3.25 0 003.25-3.25M12 13.75c-.25 0-.5-.03-.741-.084M17.5 5.5l-14 14"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- MFA Step -->
          <div v-else-if="step === 'mfa'" key="mfa">
            <p class="text-sm text-gray-600 mb-2">
              Please enter the code from your authenticator app.
            </p>
            <div>
              <label for="mfaCode" class="block text-sm font-medium text-gray-700 mb-1"
                >Authentication Code</label
              >
              <input
                v-model="mfaCode"
                type="text"
                id="mfaCode"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 123456"
                required
                autocomplete="one-time-code"
              />
            </div>
          </div>
        </transition>

        <div v-if="errorMessage" class="pt-2 text-red-600 text-sm text-center">
          {{ errorMessage }}
        </div>

        <button
          type="submit"
          :disabled="isSubmitting || !isLoaded"
          class="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 shadow-lg disabled:opacity-50 transition-colors cursor-pointer"
        >
          <span v-if="!isLoaded">Loading...</span>
          <span v-else-if="isSubmitting">Signing In...</span>
          <span v-else>Continue</span>
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.3s ease-in-out;
}
.slide-left-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>
