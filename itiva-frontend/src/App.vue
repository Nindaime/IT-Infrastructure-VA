<!-- src/App.vue - Updated to manage global header/footer visibility and notification -->
<script setup>
import { computed, ref, provide, onMounted, watchEffect } from 'vue'
import { useRoute, RouterView, useRouter } from 'vue-router'
import { useReportsStore } from './stores/reports'
import { useUiStore } from './stores/ui'
import { SpeedInsights } from '@vercel/speed-insights/vue'
import { Analytics } from '@vercel/analytics/vue'
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import ToastNotification from '@/components/ToastNotification.vue'

const route = useRoute()
const router = useRouter()
const reportsStore = useReportsStore()
const uiStore = useUiStore()

// Reactive state for global notifications
const toast = ref({
  show: false,
  message: '',
  type: 'info',
  duration: 3000,
})

function showToast(message, type = 'info', duration = 3000) {
  toast.value = { show: true, message, type, duration }
}
function hideToast() {
  toast.value.show = false
}
provide('showToast', showToast)
provide('hideToast', hideToast)

onMounted(() => {
  router.isReady().then(() => {
    reportsStore.loadReportsFromStorage()
  })
})

// Apply Tailwind dark mode by toggling only the 'dark' class on <html>
watchEffect(() => {
  const root = window.document.documentElement
  if (uiStore.theme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
})

const showGlobalHeaderAndFooter = computed(() => route.meta.showHeaderAndFooter !== false)
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <AppHeader v-if="showGlobalHeaderAndFooter" />
    <main class="flex flex-col flex-grow">
      <router-view
        :key="$route.matched[0]?.meta?.viewKey || $route.matched[0]?.name || $route.name"
      ></router-view>
    </main>
    <AppFooter v-if="showGlobalHeaderAndFooter" />
    <ToastNotification
      :show="toast.show"
      :message="toast.message"
      :type="toast.type"
      :duration="toast.duration"
      @close="hideToast"
    />
    <SpeedInsights />
    <Analytics />
  </div>
</template>

<style></style>