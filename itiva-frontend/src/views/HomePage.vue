<!-- src/views/HomePage.vue - Major rebuild based on new layout and grading requirements -->
<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { mockRankings } from '@/api/mockData' // Assuming mockRankings is structured as per previous definition

// Initialize the router for programmatic navigation
const router = useRouter()

// Reactive reference for the list of mock rankings
// Limiting to 10 companies as requested
const rankings = ref(mockRankings.slice(0, 10))

// --- Grading Logic ---
/**
 * Calculates the grade based on a given score.
 * @param {number} score The numerical score.
 * @returns {string} The corresponding letter grade.
 */
function getGrade(score) {
  if (score >= 85) return 'A'
  if (score >= 75) return 'B'
  if (score >= 65) return 'C'
  if (score >= 50) return 'D'
  return 'E'
}

/**
 * Determines the Tailwind CSS text color class based on the grade.
 * As requested, ensuring distinct colors:
 * A: Green (safe)
 * B: Emerald (subtle green, distinct from A)
 * C: Yellow (neutral warning)
 * D: Orange (minor concern)
 * E: Red (danger)
 * @param {string} grade The letter grade (A, B, C, D, E).
 * @returns {string} The Tailwind CSS class for text color.
 */
function getGradeColorClass(grade) {
  switch (grade) {
    case 'A':
      return 'text-green-600' // Safe Green
    case 'B':
      return 'text-emerald-600' // Emerald (slightly darker green/teal)
    case 'C':
      return 'text-yellow-600' // Yellow
    case 'D':
      return 'text-orange-600' // Orange
    case 'E':
      return 'text-red-600' // Danger Red
    default:
      return 'text-gray-600' // Fallback
  }
}

// --- Grouped Rankings for 3-column layout ---
const rankingsByRating = computed(() => {
  // Sort by overall score (descending) as it correlates with 'Rating'
  return rankings.value.slice().sort((a, b) => b.score - a.score)
})

const rankingsByLocation = computed(() => {
  const grouped = rankings.value.reduce((acc, rank) => {
    const key = rank.location
    if (!acc[key]) acc[key] = []
    acc[key].push(rank)
    return acc
  }, {})
  // Sort locations alphabetically, then by score within each location
  return Object.fromEntries(
    Object.entries(grouped)
      .sort()
      .map(([key, value]) => [key, value.sort((a, b) => b.score - a.score)]),
  )
})

const rankingsByType = computed(() => {
  const grouped = rankings.value.reduce((acc, rank) => {
    const key = rank.type
    if (!acc[key]) acc[key] = []
    acc[key].push(rank)
    return acc
  }, {})
  // Sort types alphabetically, then by score within each type
  return Object.fromEntries(
    Object.entries(grouped)
      .sort()
      .map(([key, value]) => [key, value.sort((a, b) => b.score - a.score)]),
  )
})

/**
 * Navigates the user to the login page to start an assessment.
 */
function navigateToLogin() {
  router.push('/login')
}

/**
 * Navigates to the ReportViewerPage, passing the selected business's report data.
 * @param {object} biz The business object whose report is to be viewed.
 * Note: The right pane for report summary has been removed from homepage.
 * This function will now directly navigate to the ReportViewerPage.
 */
function viewReport(biz) {
  router.push({
    name: 'ReportViewerPage',
    params: { report: JSON.stringify(biz.report), name: biz.name },
  })
}
</script>

<template>
  <div class="font-sans">
    <!-- Hero Section: Grand, eye-catching introduction with gradient background and shadow -->
    <div
      class="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 md:py-32 shadow-xl rounded-b-3xl"
    >
      <div class="container mx-auto px-6 text-center">
        <!-- Main Heading: Large, bold, responsive text with yellow highlight for "AI-Powered" -->
        <h1 class="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
          Assess Your IT Vulnerabilities with
          <span class="text-yellow-300">AI-Powered</span> Precision
        </h1>
        <!-- Sub-heading/Description: Readable text, centered, with slight opacity -->
        <p class="text-lg md:text-xl max-w-3xl mx-auto mb-10 opacity-90">
          ITIVA (IT Infrastructure Vulnerability Assessment) is an intelligent platform that helps
          businesses in the UK identify, analyze, and mitigate security risks across their digital
          infrastructure.
        </p>
        <!-- Call to Action Button: Prominent, white background, blue text, interactive hover effects -->
        <button
          @click="navigateToLogin"
          class="bg-white text-blue-700 font-bold py-4 px-10 rounded-full text-lg hover:bg-gray-100 transition-transform transform hover:scale-105 shadow-2xl"
        >
          Start Your Free Assessment
        </button>
      </div>
    </div>

    <!-- How It Works Section - Reintroduced and updated content -->
    <section id="how-it-works" class="py-20 bg-gray-50/70">
      <div class="container mx-auto px-6">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-12">How It Works</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Step 1: Register & Answer -->
          <div class="bg-white p-8 rounded-xl shadow-lg text-center border border-gray-200">
            <div
              class="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold"
            >
              1
            </div>
            <h3 class="text-2xl font-semibold text-gray-800 mb-4">Register & Answer</h3>
            <p class="text-gray-600 leading-relaxed">
              Create your business profile and complete our straightforward, up to date 40-questions
              Net Triad assessments. We also offer specialized questionnaires for Advanced Cloud
              Security and GDPR Compliance.
            </p>
          </div>
          <!-- Step 2: AI-Powered Analysis -->
          <div class="bg-white p-8 rounded-xl shadow-lg text-center border border-gray-200">
            <div
              class="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold"
            >
              2
            </div>
            <h3 class="text-2xl font-semibold text-gray-800 mb-4">AI-Powered Analysis</h3>
            <p class="text-gray-600 leading-relaxed">
              Our system analyzes your answers based on 4 main criteria: Website Security, Device &
              Network, Compliance Documentation & Cybersecurity Implementation to calculate your
              vulnerability score for each category.
            </p>
          </div>
          <!-- Step 3: Get Actionable Insights -->
          <div class="bg-white p-8 rounded-xl shadow-lg text-center border border-gray-200">
            <div
              class="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold"
            >
              3
            </div>
            <h3 class="text-2xl font-semibold text-gray-800 mb-4">Get Actionable Insights</h3>
            <p class="text-gray-600 leading-relaxed">
              Receive an instant, detailed report with a visual Radar Chart and prioritized
              recommendations. You may download your reports as pdf for further review or reach to
              us on actionable plans to mitigate your security gaps.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Platform Features Section - Reintroduced -->
    <section id="features" class="py-20 bg-white">
      <div class="container mx-auto px-6">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-12">
          Platform Features
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <!-- Feature 1: Comprehensive Assessments -->
          <div class="flex items-start bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100">
            <div
              class="flex-shrink-0 w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-4"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9.75 17L9 20l-1 1h4l-1-1v-3.25m-6.096 1.408l-3.003-3.004C2.012 10.612 0 8.874 0 7c0-1.79 1.41-3.266 3-3.896c1.59-.63 3.23-1.004 4.5-.604c1.27.4 2.378 1.547 3 2.896M21 7c0 1.79-1.41 3.266-3 3.896c-1.59.63-3.23 1.004-4.5.604c-1.27-.4-2.378-1.547-3-2.896"
                ></path>
              </svg>
            </div>
            <div>
              <h3 class="text-xl font-semibold text-gray-800 mb-2">Comprehensive Assessments</h3>
              <p class="text-gray-600">
                Detailed analysis of your IT infrastructure covering a wide range of potential
                vulnerabilities.
              </p>
            </div>
          </div>
          <!-- Feature 2: Risk Prioritization -->
          <div class="flex items-start bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100">
            <div
              class="flex-shrink-0 w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-4"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                ></path>
              </svg>
            </div>
            <div>
              <h3 class="text-xl font-semibold text-gray-800 mb-2">Risk Prioritization</h3>
              <p class="text-gray-600">
                Automatically identify and prioritize the most critical risks, enabling efficient
                resource allocation.
              </p>
            </div>
          </div>
          <!-- Feature 3: Automated Reporting -->
          <div class="flex items-start bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100">
            <div
              class="flex-shrink-0 w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mr-4"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v4m0 0a2 2 0 100 4m0-4a2 2 0 110 4m0 4v2m0-6H4m6 0h10m6-6v10m0-10a2 2 0 100-4m0 4a2 2 0 110-4m0 4H4"
                ></path>
              </svg>
            </div>
            <div>
              <h3 class="text-xl font-semibold text-gray-800 mb-2">Automated Reporting</h3>
              <p class="text-gray-600">
                Generate clear, actionable reports instantly, detailing vulnerabilities and
                recommended solutions.
              </p>
            </div>
          </div>
          <!-- Feature 4: User-Friendly Dashboard -->
          <div class="flex items-start bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100">
            <div
              class="flex-shrink-0 w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mr-4"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8c1.657 0 3 1.343 3 3v2a3 3 0 01-3 3m0-12c1.657 0 3 1.343 3 3v2a3 3 0 01-3 3m0-12a9 9 0 100 18A9 9 0 0012 8z"
                ></path>
              </svg>
            </div>
            <div>
              <h3 class="text-xl font-semibold text-gray-800 mb-2">User-Friendly Dashboard</h3>
              <p class="text-gray-600">
                Intuitive dashboard to monitor your security posture and track progress over time.
              </p>
            </div>
          </div>
          <!-- Feature 5: Scalable Solutions -->
          <div class="flex items-start bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100">
            <div
              class="flex-shrink-0 w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mr-4"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5s3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18s-3.332.477-4.5 1.253"
                ></path>
              </svg>
            </div>
            <div>
              <h3 class="text-xl font-semibold text-gray-800 mb-2">Scalable Solutions</h3>
              <p class="text-gray-600">
                Whether you're a small business or a large enterprise, ITIVA scales to meet your
                security needs.
              </p>
            </div>
          </div>
          <!-- Feature 6: Expert Support -->
          <div class="flex items-start bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100">
            <div
              class="flex-shrink-0 w-12 h-12 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center mr-4"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.105A9.764 9.764 0 015 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                ></path>
              </svg>
            </div>
            <div>
              <h3 class="text-xl font-semibold text-gray-800 mb-2">Expert Support</h3>
              <p class="text-gray-600">
                Access to our team of cybersecurity experts for guidance and advanced threat
                mitigation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- UK's Most Secure Businesses Section - Modified for 3-column layout -->
    <section id="rankings" class="py-20 bg-gray-50/70">
      <div class="container mx-auto px-6">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-800">UK's Most Secure Businesses</h2>
          <p class="text-gray-600 mt-4 max-w-2xl mx-auto mb-8">
            Discover the top-ranked businesses based on their comprehensive ITIVA vulnerability
            score, grouped by various criteria.
          </p>
          <!-- Removed "Group by:" and filter buttons as per new requirements -->
        </div>

        <!-- Three-Column Ranking Display Area: Grid layout for distinct ranking views -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Column 1: Business Ranking by Rating -->
          <div
            class="bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden border border-gray-200"
          >
            <div class="p-6 border-b border-gray-200 bg-blue-50">
              <h3 class="text-xl font-bold text-blue-800">Business Ranking by Rating</h3>
            </div>
            <div class="overflow-y-auto custom-scrollbar flex-grow p-4 min-h-[400px]">
              <ul class="space-y-1">
                <li
                  v-for="item in rankingsByRating"
                  :key="item.rank"
                  @click="viewReport(item)"
                  class="p-3 rounded-lg cursor-pointer flex items-center justify-between transition-all duration-200 hover:bg-gray-50"
                >
                  <div class="flex items-center truncate">
                    <span class="font-bold text-gray-400 mr-3 w-6 text-center flex-shrink-0">{{
                      item.rank
                    }}</span>
                    <div class="truncate">
                      <!-- Increased font size for company name as requested -->
                      <p class="font-bold text-gray-800 text-base truncate">{{ item.name }}</p>
                      <p class="text-xs text-gray-500 truncate">
                        {{ item.location }} - {{ item.type }}
                      </p>
                    </div>
                  </div>
                  <!-- Grade display with conditional color -->
                  <span
                    class="font-extrabold text-base flex-shrink-0 ml-2"
                    :class="getGradeColorClass(getGrade(item.score))"
                  >
                    {{ getGrade(item.score) }}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Column 2: Business Ranking by Location -->
          <div
            class="bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden border border-gray-200"
          >
            <div class="p-6 border-b border-gray-200 bg-green-50">
              <h3 class="text-xl font-bold text-green-800">Business Ranking by Location</h3>
            </div>
            <div class="overflow-y-auto custom-scrollbar flex-grow p-4 min-h-[400px]">
              <div
                v-for="(group, groupName) in rankingsByLocation"
                :key="groupName"
                class="mb-4 last:mb-0"
              >
                <h4
                  class="font-semibold text-sm text-green-800 bg-green-100 px-4 py-2 rounded-md mb-2 sticky top-0 z-10 shadow-sm"
                >
                  {{ groupName }}
                </h4>
                <ul class="space-y-1">
                  <li
                    v-for="item in group"
                    :key="item.rank"
                    @click="viewReport(item)"
                    class="p-3 rounded-lg cursor-pointer flex items-center justify-between transition-all duration-200 hover:bg-gray-50"
                  >
                    <div class="flex items-center truncate">
                      <span class="font-bold text-gray-400 mr-3 w-6 text-center flex-shrink-0">{{
                        item.rank
                      }}</span>
                      <div class="truncate">
                        <!-- Increased font size for company name as requested -->
                        <p class="font-bold text-gray-800 text-base truncate">{{ item.name }}</p>
                        <p class="text-xs text-gray-500 truncate">
                          {{ item.location }} - {{ item.type }}
                        </p>
                      </div>
                    </div>
                    <!-- Grade display with conditional color -->
                    <span
                      class="font-extrabold text-base flex-shrink-0 ml-2"
                      :class="getGradeColorClass(getGrade(item.score))"
                    >
                      {{ getGrade(item.score) }}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Column 3: Business Ranking by Type -->
          <div
            class="bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden border border-gray-200"
          >
            <div class="p-6 border-b border-gray-200 bg-purple-50">
              <h3 class="text-xl font-bold text-purple-800">Business Ranking by Type</h3>
            </div>
            <div class="overflow-y-auto custom-scrollbar flex-grow p-4 min-h-[400px]">
              <div
                v-for="(group, groupName) in rankingsByType"
                :key="groupName"
                class="mb-4 last:mb-0"
              >
                <h4
                  class="font-semibold text-sm text-purple-800 bg-purple-100 px-4 py-2 rounded-md mb-2 sticky top-0 z-10 shadow-sm"
                >
                  {{ groupName }}
                </h4>
                <ul class="space-y-1">
                  <li
                    v-for="item in group"
                    :key="item.rank"
                    @click="viewReport(item)"
                    class="p-3 rounded-lg cursor-pointer flex items-center justify-between transition-all duration-200 hover:bg-gray-50"
                  >
                    <div class="flex items-center truncate">
                      <span class="font-bold text-gray-400 mr-3 w-6 text-center flex-shrink-0">{{
                        item.rank
                      }}</span>
                      <div class="truncate">
                        <!-- Increased font size for company name as requested -->
                        <p class="font-bold text-gray-800 text-base truncate">{{ item.name }}</p>
                        <p class="text-xs text-gray-500 truncate">
                          {{ item.location }} - {{ item.type }}
                        </p>
                      </div>
                    </div>
                    <!-- Grade display with conditional color -->
                    <span
                      class="font-extrabold text-base flex-shrink-0 ml-2"
                      :class="getGradeColorClass(getGrade(item.score))"
                    >
                      {{ getGrade(item.score) }}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- About Us Section Placeholder: Calls to action to learn more -->
    <section id="about" class="py-20 bg-white">
      <div class="container mx-auto px-6 text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-800 mb-4">About ITIVA</h2>
        <p class="text-lg text-gray-600 max-w-3xl mx-auto">
          ITIVA is committed to empowering businesses with the knowledge and tools to secure their
          digital presence. Our cutting-edge AI technology provides in-depth vulnerability
          assessments, helping you proactively manage and mitigate risks. Learn more about our
          mission and values.
        </p>
        <button
          @click="router.push('/about')"
          class="mt-8 bg-blue-600 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-700 transition-transform transform hover:scale-105 shadow-md"
        >
          Learn More
        </button>
      </div>
    </section>
  </div>
</template>
