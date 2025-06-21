<!-- src/components/Header.vue -->
<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  isLoggedIn: Boolean,
  isAdmin: Boolean
})

const emit = defineEmits(['logout']);

</script>

<template>
  <header class="bg-white shadow-sm sticky top-0 z-50">
      <div class="container mx-auto px-6 py-4 flex justify-between items-center">
          <RouterLink to="/" class="cursor-pointer text-2xl font-bold text-gray-800">
              IT<span class="text-blue-600">I</span>VA
          </RouterLink>
          <nav class="hidden md:flex items-center space-x-8">
              <RouterLink to="/" class="text-gray-600 hover:text-blue-600 transition-colors">Home</RouterLink>
              <RouterLink to="/about" class="text-gray-600 hover:text-blue-600 transition-colors">About Us</RouterLink>
              <RouterLink v-if="isLoggedIn && !isAdmin" to="/dashboard" class="text-gray-600 hover:text-blue-600 transition-colors">Dashboard</RouterLink>
              <RouterLink v-if="isAdmin" to="/admin/dashboard" class="text-gray-600 hover:text-blue-600 transition-colors">Admin Dashboard</RouterLink>
          </nav>
          <div v-if="!isLoggedIn" class="flex items-center space-x-4">
              <RouterLink to="/login" class="hidden md:block text-gray-600 hover:text-blue-600 font-medium transition-colors">Login</RouterLink>
              <RouterLink to="/login" class="bg-blue-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105 shadow-lg">
                  Get Started
              </RouterLink>
          </div>
          <div v-if="isLoggedIn" class="flex items-center space-x-4">
              <button @click="emit('logout')" class="bg-red-500 text-white font-bold py-2 px-5 rounded-lg hover:bg-red-600 transition-transform transform hover:scale-105 shadow-lg">
                  Logout
              </button>
          </div>
      </div>
  </header>
</template>
