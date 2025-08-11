<!-- src/components/AppHeader.vue -->
<script setup>
import { ref, computed, watch } from 'vue'
import { useQuestionnairesStore } from '@/stores/questionnaires'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'
import { RouterLink } from 'vue-router'
import ItivaLogo from '@/assets/itiva-logo.png'
import CogIcon from './icons/CogIcon.vue'
import SignOutIcon from './icons/SignOutIcon.vue'

// Props
defineProps({
  showNewAssessment: { type: Boolean },
})

// Stores
const authStore = useAuthStore()
const uiStore = useUiStore()
const questionnairesStore = useQuestionnairesStore()

// State
const isMobileMenuOpen = ref(false)
const activeMenu = ref(null) // 'assessment' or 'user'

// Computed Properties
const activeAssessments = computed(() =>
  questionnairesStore.questionnaires.filter((q) => q.status === 'Active'),
)

const userInitials = computed(() => {
  const name = authStore.userFullName
  if (!name) return ''
  const parts = name.split(' ')
  if (parts.length > 1) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
})

const userImageUrl = computed(() => authStore.currentUser?.imageUrl || '')

// Methods
function toggleMenu(menuName) {
  if (activeMenu.value === menuName) {
    activeMenu.value = null
  } else {
    activeMenu.value = menuName
  }
}

function closeMenus() {
  activeMenu.value = null
}

async function handleLogout() {
  closeMenus()
  await authStore.logout()
}

// Watcher to close menus when clicking outside
watch(activeMenu, (val) => {
  if (val) {
    setTimeout(() => window.addEventListener('click', closeMenus, { once: true }), 0)
  } else {
    window.removeEventListener('click', closeMenus)
  }
})
</script>

<template>
  <header class="bg-white dark:bg-gray-900 shadow-md w-full sticky top-0 z-40">
    <div class="container mx-auto px-4 sm:px-6 py-3">
      <nav class="flex items-center justify-between" @click.stop>
        <!-- Logo and Title -->
        <RouterLink to="/dashboard" class="flex items-center space-x-2 cursor-pointer group">
          <img
            :src="ItivaLogo"
            alt="ITIVA Logo"
            class="h-8 group-hover:scale-105 transition-transform"
          />
          <span
            v-if="authStore.isAuthenticated"
            class="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600 leading-none relative top-[2px] -left-[3px]"
          >
            {{ authStore.isAdmin ? 'Admin' : 'User' }}
          </span>
        </RouterLink>

        <!-- Right-side content -->
        <div class="flex items-center space-x-2 sm:space-x-4">
          <!-- Logged-Out Navigation -->
          <div v-if="!authStore.isAuthenticated" class="hidden md:flex items-center space-x-6">
            <RouterLink
              to="/about"
              class="text-gray-600 dark:text-gray-300 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >About Us</RouterLink
            >
            <RouterLink
              to="/login"
              class="text-gray-600 dark:text-gray-300 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >Login</RouterLink
            >
            <RouterLink
              to="/sign-up"
              class="bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
              >Get Started</RouterLink
            >
          </div>

          <!-- Logged-In Navigation -->
          <div v-if="authStore.isAuthenticated" class="flex items-center space-x-2 sm:space-x-4">
            <!-- New Assessment Button -->
            <div v-if="showNewAssessment" class="relative">
              <button
                @click="toggleMenu('assessment')"
                class="hidden sm:inline-flex items-center bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
              >
                New Assessment
              </button>
              <transition name="fade-down">
                <div
                  v-if="activeMenu === 'assessment'"
                  class="absolute right-0 mt-4 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50 py-1 border border-gray-200 dark:border-gray-700"
                  @click.stop
                >
                  <RouterLink
                    v-for="assessment in activeAssessments"
                    :key="assessment.name"
                    :to="{ name: 'questionnaire', params: { type: assessment.name } }"
                    @click="closeMenus"
                    class="block w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700 last:border-b-0 cursor-pointer"
                  >
                    {{ assessment.name }}
                  </RouterLink>
                </div>
              </transition>
            </div>

            <!-- User Menu -->
            <div class="relative">
              <button @click="toggleMenu('user')" class="focus:outline-none cursor-pointer block">
                <div
                  class="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-md"
                >
                  <img
                    v-if="userImageUrl"
                    :src="userImageUrl"
                    alt="User avatar"
                    class="w-full h-full object-cover"
                  />
                  <span v-else>{{ userInitials }}</span>
                </div>
              </button>
              <transition name="fade-down">
                <div
                  v-if="activeMenu === 'user'"
                  class="absolute right-0 mt-4 w-60 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50 py-1 border border-gray-200 dark:border-gray-700"
                  @click.stop
                >
                  <!-- User Info -->
                  <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <p class="font-semibold text-gray-800 dark:text-white truncate">
                      {{ authStore.userFullName }}
                    </p>
                    <p class="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {{ authStore.userEmail }}
                    </p>
                  </div>
                  <!-- Theme Toggle -->
                  <div
                    class="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700"
                  >
                    <label for="theme-toggle" class="text-sm text-gray-700 dark:text-gray-200"
                      >Dark Mode</label
                    >
                    <button
                      @click="uiStore.toggleTheme"
                      class="relative inline-flex items-center h-6 rounded-full w-11 transition-colors cursor-pointer"
                      :class="uiStore.theme === 'dark' ? 'bg-blue-600' : 'bg-gray-300'"
                    >
                      <span
                        class="inline-block w-4 h-4 transform bg-white rounded-full transition-transform"
                        :class="uiStore.theme === 'dark' ? 'translate-x-6' : 'translate-x-1'"
                      />
                    </button>
                  </div>
                  <!-- Menu Actions -->
                  <RouterLink
                    to="/account-settings"
                    @click="closeMenus"
                    class="group flex items-center w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <CogIcon class="w-5 h-5 mr-3 text-gray-400 group-hover:text-blue-500" />
                    <span>Manage account</span>
                  </RouterLink>
                  <RouterLink
                    to="/verify-account"
                    @click="closeMenus"
                    class="group flex items-center w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <svg
                      class="w-5 h-5 mr-3 text-gray-400 group-hover:text-blue-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 2a8 8 0 100 16 8 8 0 000-16zm3.707 5.293a1 1 0 00-1.414-1.414L9 9.172 7.707 7.879a1 1 0 10-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <span>Verify Account</span>
                  </RouterLink>
                  <button
                    @click="handleLogout"
                    class="group w-full flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <SignOutIcon class="w-5 h-5 mr-3 text-gray-400 group-hover:text-blue-500" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </transition>
            </div>
          </div>

          <!-- Mobile Menu Button (hidden as profile menu serves as main menu) -->
          <div class="md:hidden hidden">
            <button
              @click="isMobileMenuOpen = !isMobileMenuOpen"
              class="focus:outline-none cursor-pointer text-gray-600 dark:text-gray-300"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </nav>
    </div>
    <!-- Mobile Menu Content -->
  </header>
</template>

<style scoped>
.fade-down-enter-active,
.fade-down-leave-active {
  transition: all 0.2s ease-in-out;
}
.fade-down-enter-from,
.fade-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
