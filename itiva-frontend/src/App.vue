<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'

const route = useRoute()
const router = useRouter()

// This state would ideally be managed by a state management library like Pinia
const isLoggedIn = ref(false)
const isAdmin = ref(false)

const showHeaderAndFooter = computed(() => route.meta.showHeaderAndFooter !== false)

function login() {
  isLoggedIn.value = true
  isAdmin.value = false
  router.push('/dashboard')
}

function adminLogin() {
  isLoggedIn.value = true
  isAdmin.value = true
  router.push('/admin/dashboard')
}

function logout() {
  isLoggedIn.value = false
  isAdmin.value = false
  router.push('/')
}

// Provide state to all child components
// provide('auth', { isLoggedIn, isAdmin, login, adminLogin, logout });
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <Header
      v-if="showHeaderAndFooter"
      :is-logged-in="isLoggedIn"
      :is-admin="isAdmin"
      @logout="logout"
    />
    <main class="flex-grow">
      <router-view
        :is-logged-in="isLoggedIn"
        :is-admin="isAdmin"
        @login="login"
        @admin-login="adminLogin"
      />
    </main>
    <Footer v-if="showHeaderAndFooter" />
  </div>
</template>

<style>
/* You can move the global styles from the original HTML file's <style> tag to src/assets/main.css */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
