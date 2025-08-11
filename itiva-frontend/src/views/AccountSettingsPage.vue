<!-- src/views/AccountSettingsPage.vue -->
<script setup>
import { UserProfile } from '@clerk/vue'
import { useUiStore } from '@/stores/ui'
import { dark } from '@clerk/themes'
import { computed } from 'vue'

const uiStore = useUiStore()

// This computed property determines which theme to pass to Clerk's component
const clerkTheme = computed(() => {
  return uiStore.theme === 'dark' ? dark : undefined
})
</script>

<template>
  <div class="flex flex-grow justify-center items-center bg-gray-50 dark:bg-gray-900 py-8 px-4">
    <div class="w-full max-w-4xl">
      <UserProfile :appearance="{ baseTheme: clerkTheme }" />
    </div>
  </div>
</template>

<style scoped>
/* Overriding Clerk's default card styles to better fit the application's design */
:deep(.cl-card) {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

/* Dark mode overrides for the Clerk component */
.dark :deep(.cl-card) {
  background-color: #1f2937; /* Corresponds to dark:bg-gray-800 */
  border-color: rgba(255, 255, 255, 0.1);
}
</style>
