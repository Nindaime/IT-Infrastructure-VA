<!-- src/views/AboutUsPage.vue -->
<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

/**
 * Navigates back to the home page.
 */
function goToHome() {
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center p-6 font-sans">
    <div class="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-8 md:p-12 my-8">
      <header class="text-center mb-10">
        <h1 class="text-4xl md:text-5xl font-extrabold text-blue-700 mb-4">About ITIVA</h1>
        <p class="text-xl text-gray-600">Your partner in proactive IT security.</p>
      </header>

      <section class="mb-10 text-gray-700 leading-relaxed">
        <h2 class="text-3xl font-bold text-gray-800 mb-6 text-center">Our Mission</h2>
        <p class="text-lg mb-4">
          At ITIVA, our mission is to empower businesses of all sizes to navigate the complex
          landscape of cyber threats with confidence. We believe that robust IT security should be
          accessible, understandable, and actionable. Through our intelligent, AI-powered platform,
          we provide comprehensive vulnerability assessments that not only identify risks but also
          offer clear, practical recommendations for mitigation.
        </p>
        <p class="text-lg">
          We are dedicated to fostering a safer digital environment for businesses across the UK,
          helping them protect their valuable data, maintain operational integrity, and build trust
          with their clients.
        </p>
      </section>

      <section class="mb-10 text-gray-700 leading-relaxed">
        <h2 class="text-3xl font-bold text-gray-800 mb-6 text-center">What We Do</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="bg-blue-50 p-6 rounded-lg shadow-sm text-center border border-blue-100">
            <svg
              class="w-16 h-16 text-blue-600 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M9.75 17L9 20l-1 1h4l-1-1v-3.25m-6.096 1.408l-3.003-3.004C2.012 10.612 0 8.874 0 7c0-1.79 1.41-3.266 3-3.896c1.59-.63 3.23-1.004 4.5-.604c1.27.4 2.378 1.547 3 2.896M21 7c0 1.79-1.41 3.266-3 3.896c-1.59.63-3.23 1.004-4.5.604c-1.27-.4-2.378-1.547-3-2.896"
              ></path>
            </svg>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">AI-Powered Assessments</h3>
            <p class="text-gray-600">
              Leveraging advanced AI to rapidly identify and analyze vulnerabilities across your
              digital assets.
            </p>
          </div>
          <div class="bg-green-50 p-6 rounded-lg shadow-sm text-center border border-green-100">
            <svg
              class="w-16 h-16 text-green-600 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              ></path>
            </svg>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">Actionable Insights</h3>
            <p class="text-gray-600">
              We translate complex security data into clear, actionable recommendations you can
              implement.
            </p>
          </div>
          <div class="bg-purple-50 p-6 rounded-lg shadow-sm text-center border border-purple-100">
            <svg
              class="w-16 h-16 text-purple-600 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v4m0 0a2 2 0 100 4m0-4a2 2 0 110 4m0 4v2m0-6H4m6 0h10m6-6v10m0-10a2 2 0 100-4m0 4a2 2 0 110-4m0 4H4"
              ></path>
            </svg>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">Continuous Improvement</h3>
            <p class="text-gray-600">
              Our platform helps you continuously monitor and improve your security posture over
              time.
            </p>
          </div>
        </div>
      </section>

      <section class="mb-10 text-center">
        <h2 class="text-3xl font-bold text-gray-800 mb-6">Our Team</h2>
        <p class="text-lg text-gray-700 max-w-2xl mx-auto mb-8">
          We are a dedicated team of cybersecurity experts, AI engineers, and business strategists
          passionate about digital security.
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="bg-gray-100 p-6 rounded-lg shadow-sm">
            <img
              class="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              src="https://placehold.co/128x128/aabbcc/ffffff?text=John"
              alt="Team Member John Doe"
            />
            <h3 class="text-xl font-semibold text-gray-800">John Doe</h3>
            <p class="text-blue-600">CEO & Founder</p>
            <p class="text-sm text-gray-600 mt-2">
              With over 15 years in cybersecurity, John leads ITIVA's vision for a safer digital
              world.
            </p>
          </div>
          <div class="bg-gray-100 p-6 rounded-lg shadow-sm">
            <img
              class="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              src="https://placehold.co/128x128/ccbbaa/ffffff?text=Jane"
              alt="Team Member Jane Smith"
            />
            <h3 class="text-xl font-semibold text-gray-800">Jane Smith</h3>
            <p class="text-blue-600">Lead AI Engineer</p>
            <p class="text-sm text-gray-600 mt-2">
              Jane is the architect behind ITIVA's intelligent assessment algorithms.
            </p>
          </div>
        </div>
      </section>

      <div class="text-center mt-10">
        <button
          @click="goToHome"
          class="bg-blue-600 text-white font-semibold py-3 px-8 rounded-full hover:bg-blue-700 transition-transform transform hover:scale-105 shadow-md"
        >
          Back to Home
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Add any custom styles specific to the AboutUsPage here */
</style>
