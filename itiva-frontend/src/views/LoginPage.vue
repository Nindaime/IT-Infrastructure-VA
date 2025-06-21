<!-- src/views/LoginPage.vue -->
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'; // Import useRouter

// Initialize the router
const router = useRouter();

// Define reactive properties for username, password, and error message
const username = ref('');
const password = ref('');
const errorMessage = ref('');

/**
 * Handles the login attempt.
 * Currently uses hardcoded credentials for demonstration purposes.
 * Emits 'login' or 'adminLogin' events based on successful authentication.
 */
function handleLogin() {
    errorMessage.value = ''; // Clear previous error messages

    // Hardcoded credentials for demonstration
    if (username.value === 'user' && password.value === 'password') {
        router.push('/dashboard'); // Navigate to the user dashboard
    } else if (username.value === 'admin' && password.value === 'admin') {
        router.push('/admin-dashboard'); // Navigate to the admin dashboard
    } else {
        errorMessage.value = 'Invalid username or password.'; // Display error for invalid credentials
    }
}
</script>

<template>
    <div class="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
        <div class="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Sign in to your account
            </h2>
            <p class="mt-2 text-center text-sm text-gray-600 max-w">
                Or
                <router-link to="/register" class="font-medium text-blue-600 hover:text-blue-500">
                    create a new account
                </router-link>
            </p>
        </div>

        <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div class="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
                <form class="space-y-6" @submit.prevent="handleLogin">
                    <div>
                        <label for="username" class="block text-sm font-medium text-gray-700">
                            Username
                        </label>
                        <div class="mt-1">
                            <input id="username" name="username" type="text" autocomplete="username" required
                                v-model="username"
                                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                        </div>
                    </div>

                    <div>
                        <label for="password" class="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <div class="mt-1">
                            <input id="password" name="password" type="password" autocomplete="current-password" required
                                v-model="password"
                                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                        </div>
                    </div>

                    <div v-if="errorMessage" class="text-red-600 text-sm text-center">
                        {{ errorMessage }}
                    </div>

                    <div>
                        <button type="submit"
                            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200">
                            Sign in
                        </button>
                    </div>
                </form>

                <div class="mt-6">
                    <div class="relative">
                        <div class="absolute inset-0 flex items-center">
                            <div class="w-full border-t border-gray-300"></div>
                        </div>
                        <div class="relative flex justify-center text-sm">
                            <span class="px-2 bg-white text-gray-500">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <div class="mt-6 grid grid-cols-2 gap-3">
                        <div>
                            <a href="#"
                                class="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                                <svg class="w-5 h-5 mr-2" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"><path d="M6.29 18.29l1.41-1.41L13 18l-5.29-5.29zM10 2a8 8 0 100 16 8 8 0 000-16zM10 4a6 6 0 110 12 6 6 0 010-12z" clip-rule="evenodd" fill-rule="evenodd"></path></svg>
                                Google
                            </a>
                        </div>
                        <div>
                            <a href="#"
                                class="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                                <svg class="w-5 h-5 mr-2" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"><path d="M10 0C4.477 0 0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.872v-6.984h-2.26V10h2.26V7.71a3.037 3.037 0 013.25-3.25c.937 0 1.745.07 1.977.102v2.138h-1.298c-1.272 0-1.521.604-1.521 1.49v1.948h2.854l-.465 2.988h-2.389V20C16.343 19.128 20 14.991 20 10 20 4.477 15.523 0 10 0z" clip-rule="evenodd" fill-rule="evenodd"></path></svg>
                                Facebook
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>