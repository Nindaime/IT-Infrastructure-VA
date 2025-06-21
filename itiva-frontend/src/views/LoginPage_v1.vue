<!-- src/views/LoginPage.vue -->
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import GoogleIcon from '../components/icons/GoogleIcon.vue';
import FacebookIcon from '../components/icons/FacebookIcon.vue';

const emit = defineEmits(['login', 'adminLogin']);
const router = useRouter();

const activeTab = ref('login');
const loginEmail = ref('');
const loginPassword = ref('');
const registrationData = ref({ name: '', email: '', password: '', businessName: '', businessObjective: '', website: '', address: '' });

function handleLogin() {
    if (loginEmail.value === 'admin@admin.com' && loginPassword.value === 'admin') {
        emit('adminLogin');
    } else {
        emit('login');
    }
}
function handleRegister() {
    // In a real app, you would post registrationData to your Django API
    // await axios.post('/api/v1/register', registrationData.value);
    emit('login'); // Log the user in directly after registration for this example
}
</script>
<template>
  <header class="bg-white shadow-sm sticky top-0 z-50">
        <div class="container mx-auto px-6 py-4 flex justify-between items-center">
            <div @click="$emit('navigate', 'HomePage')" class="cursor-pointer text-2xl font-bold text-gray-800">
                IT<span class="text-blue-600">I</span>VA
            </div>
            <nav class="hidden md:flex items-center space-x-8">
                <a @click.prevent="$emit('navigate', 'HomePage')" href="#" class="text-gray-600 hover:text-blue-600 transition-colors">Home</a>
                <a @click.prevent="$emit('navigate', 'AboutUsPage')" href="#" class="text-gray-600 hover:text-blue-600 transition-colors">About Us</a>
                <a v-if="isLoggedIn && !isAdmin" @click.prevent="$emit('navigate', 'DashboardPage')" href="#" class="text-gray-600 hover:text-blue-600 transition-colors">Dashboard</a>
                <a v-if="isAdmin" @click.prevent="$emit('navigate', 'AdminDashboardPage')" href="#" class="text-gray-600 hover:text-blue-600 transition-colors">Admin Dashboard</a>
            </nav>
            <div v-if="!isLoggedIn" class="flex items-center space-x-4">
               <button @click="$emit('navigate', 'LoginPage')" class="hidden md:block text-gray-600 hover:text-blue-600 font-medium transition-colors">Login</button>
               <button @click="$emit('navigate', 'LoginPage')" class="bg-blue-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105 shadow-lg">
                   Get Started
               </button>
            </div>
            <div v-if="isLoggedIn" class="flex items-center space-x-4">
               <button @click="$emit('logout')" class="bg-red-500 text-white font-bold py-2 px-5 rounded-lg hover:bg-red-600 transition-transform transform hover:scale-105 shadow-lg">
                   Logout
               </button>
            </div>
        </div>
    </header>
</template>