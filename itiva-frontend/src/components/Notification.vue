<!-- src/components/Notification.vue -->
<script setup>
defineProps({
  message: String,
  type: String, // 'success' or 'error'
});
</script>
<template>
    <div v-if="message" class="fixed top-5 right-5 z-50 p-4 rounded-lg shadow-lg text-white" 
        :class="type === 'success' ? 'bg-green-500' : 'bg-red-500'">
        {{ message }}
    </div>
</template>