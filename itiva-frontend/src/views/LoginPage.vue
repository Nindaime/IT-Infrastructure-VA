<!-- src/views/LoginPage.vue -->
<script setup>
import { ref, watch } from 'vue'
import LoginForm from '@/components/auth/LoginForm.vue'
import SignUpForm from '@/components/auth/SignUpForm.vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { SignedIn, SignedOut } from '@clerk/vue'
import ItivaLogo from '@/assets/itiva-logo.png'

const route = useRoute()
const router = useRouter()

// Determine the initial tab from the route path, then manage state internally.
const initialTab = route.path.startsWith('/sign-up') ? 'register' : 'login'
const activeTab = ref(initialTab)

// Sync URL when the tab changes without remounting the page.
const setActiveTab = (tab) => {
  if (activeTab.value === tab) return
  activeTab.value = tab
  const targetName = tab === 'register' ? 'sign-up' : 'login'
  router.replace({ name: targetName })
}

// Keep internal state in sync when navigation happens via back/forward or direct URL entry
watch(
  () => route.name,
  (name) => {
    const tabFromRoute = name === 'sign-up' ? 'register' : 'login'
    if (activeTab.value !== tabFromRoute) {
      activeTab.value = tabFromRoute
    }
  },
)
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans">
    <div class="mb-8">
      <RouterLink to="/" class="cursor-pointer">
        <img :src="ItivaLogo" alt="ITIVA Logo" class="h-12" />
      </RouterLink>
    </div>
    <div class="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
      <SignedOut>
        <!-- Tab Navigation -->
        <div class="flex border-b border-gray-200 mb-8">
          <button
            @click="setActiveTab('login')"
            :class="[
              'w-1/2 py-4 text-center font-medium text-lg transition-colors cursor-pointer',
              activeTab === 'login'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700',
            ]"
          >
            Login
          </button>
          <button
            @click="setActiveTab('register')"
            :class="[
              'w-1/2 py-4 text-center font-medium text-lg transition-colors cursor-pointer',
              activeTab === 'register'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700',
            ]"
          >
            Register
          </button>
        </div>

        <!-- Keep both forms in the DOM; toggle visibility with v-show so they aren't destroyed -->
        <div class="relative overflow-hidden">
          <Transition
            enter-from-class="opacity-0 translate-x-8"
            enter-active-class="transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)]"
            enter-to-class="opacity-100 translate-x-0"
            leave-from-class="opacity-100 translate-x-0"
            leave-active-class="transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)] absolute inset-0 pointer-events-none"
            leave-to-class="opacity-0 -translate-x-8"
          >
            <div v-show="activeTab === 'login'" key="login">
              <LoginForm />
            </div>
          </Transition>

          <Transition
            enter-from-class="opacity-0 translate-x-8"
            enter-active-class="transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)]"
            enter-to-class="opacity-100 translate-x-0"
            leave-from-class="opacity-100 translate-x-0"
            leave-active-class="transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)] absolute inset-0 pointer-events-none"
            leave-to-class="opacity-0 -translate-x-8"
          >
            <div v-show="activeTab === 'register'" key="register">
              <SignUpForm />
            </div>
          </Transition>
        </div>
      </SignedOut>

      <!-- Message for already signed-in users -->
      <SignedIn>
        <div class="text-center">
          <p class="text-lg font-medium text-gray-800">You are already signed in.</p>
          <p class="mt-2 text-sm text-gray-600">Redirecting you to your dashboard...</p>
        </div>
      </SignedIn>
    </div>
  </div>
</template>

<style scoped>
/* Transition classes provided inline via Transition props; no additional scoped CSS needed here. */
</style>
