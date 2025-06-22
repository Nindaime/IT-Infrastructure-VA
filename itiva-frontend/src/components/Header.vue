<!-- src/components/Header.vue -->
<!-- <script setup>
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
</template> -->
<!-- src/components/Header.vue - Rebuilt based on visual design -->
<script setup>
import { RouterLink } from 'vue-router'

// Define props to receive login and admin status from parent (App.vue)
defineProps({
  isLoggedIn: Boolean,
  isAdmin: Boolean,
})

// Define emitted events, specifically for logout
const emit = defineEmits(['logout'])
</script>

<template>
  <!-- Header container: fixed at top, background white, subtle shadow, high z-index -->
  <header class="bg-white shadow-sm sticky top-0 z-50">
    <!-- Inner container for content: constrained width, centered, padding, flex for alignment -->
    <div class="container mx-auto px-6 py-4 flex justify-between items-center">
      <!-- Logo/Brand Name: clickable to home, large bold text, blue highlight for 'I' -->
      <RouterLink to="/" class="cursor-pointer text-2xl font-bold text-gray-800">
        IT<span class="text-blue-600">I</span>VA
      </RouterLink>
      <!-- Navigation links: hidden on small screens, flex on medium/large, spaced out -->
      <nav class="hidden md:flex items-center space-x-8">
        <RouterLink to="/" class="text-gray-600 hover:text-blue-600 transition-colors duration-200"
          >Home</RouterLink
        >
        <RouterLink
          to="/about"
          class="text-gray-600 hover:text-blue-600 transition-colors duration-200"
          >About Us</RouterLink
        >
        <!-- Conditional links based on login and admin status -->
        <RouterLink
          v-if="isLoggedIn && !isAdmin"
          to="/dashboard"
          class="text-gray-600 hover:text-blue-600 transition-colors duration-200"
          >Dashboard</RouterLink
        >
        <RouterLink
          v-if="isAdmin"
          to="/admin/dashboard"
          class="text-gray-600 hover:text-blue-600 transition-colors duration-200"
          >Admin Dashboard</RouterLink
        >
      </nav>
      <!-- Authentication/Action buttons -->
      <div v-if="!isLoggedIn" class="flex items-center space-x-4">
        <!-- Login link: hidden on small screens, block on medium/large -->
        <RouterLink
          to="/login"
          class="hidden md:block text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200"
          >Login</RouterLink
        >
        <!-- Get Started button: primary action, bold, rounded, hover effects, shadow -->
        <RouterLink
          to="/login"
          class="bg-blue-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105 shadow-lg"
        >
          Get Started
        </RouterLink>
      </div>
      <!-- Logout button (shown when logged in) -->
      <div v-if="isLoggedIn" class="flex items-center space-x-4">
        <button
          @click="emit('logout')"
          class="bg-red-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-red-700 transition-transform transform hover:scale-105 shadow-lg"
        >
          Logout
        </button>
      </div>
    </div>
  </header>
</template>
