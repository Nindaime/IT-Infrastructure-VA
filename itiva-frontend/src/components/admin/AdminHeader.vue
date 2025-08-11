<!-- src/components/admin/AdminHeader.vue -->
<script setup>
import { RouterLink } from 'vue-router'
import ItivaLogo from '@/assets/itiva-logo.svg'

// The logout functionality is now handled by the main AppHeader's user menu.
// This component is purely for navigation within the admin section.
</script>

<template>
  <header class="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-30">
    <div class="container mx-auto px-6 py-4 flex justify-between items-center">
      <div class="flex items-center space-x-8">
        <div class="flex items-center space-x-2">
          <img :src="ItivaLogo" alt="ITIVA Logo" class="h-8" />
          <span
            class="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600 leading-none relative top-[2px] -left-[3px]"
            >Admin</span
          >
        </div>
        <nav class="hidden md:flex items-center space-x-6">
          <RouterLink
            to="/admin/dashboard"
            class="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >Dashboard</RouterLink
          >
          <RouterLink
            to="/admin/questionnaire/some-id"
            class="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >Edit Questionnaire</RouterLink
          >
          <RouterLink
            to="/verify-account"
            class="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >Verify Account</RouterLink
          >
        </nav>
      </div>
      <!-- The User Menu from AppHeader will be visible on admin pages and handles logout -->
    </div>
  </header>
</template>
