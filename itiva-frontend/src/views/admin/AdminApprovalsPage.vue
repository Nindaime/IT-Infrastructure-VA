<!-- src/views/admin/AdminApprovalsPage.vue -->
<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function backToAdminDashboard() {
  router.push('/admin/dashboard')
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 font-sans">
    <header class="bg-white shadow-sm py-4 px-6 flex justify-between items-center">
      <h1 class="text-2xl font-bold">Pending Approvals</h1>
      <button
        @click="backToAdminDashboard"
        class="px-4 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition-colors"
      >
        Back to Dashboard
      </button>
    </header>
    <main class="p-8">
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">
          User Accounts Awaiting Verification
        </h2>
        <p class="text-gray-600">
          This page is under construction. In a full implementation, you would see a list of users
          who have submitted their documents for verification. You would be able to view their
          submitted documents and approve or reject their applications.
        </p>
        <!-- Placeholder for user list -->
      </div>
    </main>
  </div>
</template>
