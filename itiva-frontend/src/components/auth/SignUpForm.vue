<!-- src/components/auth/SignUpForm.vue -->
<script setup>
import { ref, inject, computed } from 'vue'
import { useSignUp, useClerk } from '@clerk/vue'
import { useRouter } from 'vue-router'

const { isLoaded, signUp } = useSignUp()
const clerk = useClerk()
const router = useRouter()
const showToast = inject('showToast')

// Form state
const firstName = ref('')
const lastName = ref('')
const username = ref('')
const emailAddress = ref('')
const password = ref('')
const confirmPassword = ref('')
const companyName = ref('')
const companyDescription = ref('')
const companyAddress = ref('')
const companyCity = ref('')
const businessType = ref('')

const isSubmitting = ref(false)
const errorMessage = ref('')
const showPassword = ref(false)
const isBusinessTypeFocused = ref(false)

// List of business types for autocomplete, as provided
const businessTypes = ref([
  'AI/ML',
  'Creative Agency',
  'Data Analytics',
  'E-commerce',
  'Education Technology (EdTech)',
  'Trading',
  'Fintech',
  'IT Services & Consulting',
  'Logistics & Supply Chain',
  'Marketing & Advertising',
  'SaaS (Software as a Service)',
  'Finance & Accounting',
  'Healthcare & Wellness',
  'Real Estate & PropTech',
  'Recruitment & HR Tech',
  'Management Consulting',
  'Manufacturing',
  'Retail (Brick & Mortar)',
  'Hospitality (Hotels, Restaurants)',
  'Legal Services & LegalTech',
  'Biotechnology & Life Sciences',
  'Gaming & Entertainment',
  'Media & Publishing',
  'Telecommunications',
  'Energy & Utilities',
  'Automotive',
  'Construction',
  'Travel & Tourism',
  'Cybersecurity',
  'Non-Profit & Charity',
])

const filteredBusinessTypes = computed(() => {
  if (!businessType.value) {
    return businessTypes.value
  }
  return businessTypes.value.filter((type) =>
    type.toLowerCase().includes(businessType.value.toLowerCase()),
  )
})

const selectBusinessType = (type) => {
  businessType.value = type
  isBusinessTypeFocused.value = false
}

const generatePassword = () => {
  const length = 16
  const charset =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-='
  let retVal = ''
  for (let i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n))
  }
  password.value = retVal
  confirmPassword.value = retVal
  showToast('A new strong password has been generated and filled in.', 'success')
}

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match.'
    return
  }
  if (!isLoaded.value) {
    errorMessage.value = 'Registration is initializing. Please wait a moment.'
    return
  }

  isSubmitting.value = true
  errorMessage.value = ''

  try {
    const result = await signUp.value.create({
      firstName: firstName.value,
      lastName: lastName.value,
      username: username.value,
      emailAddress: emailAddress.value,
      password: password.value,
      unsafeMetadata: {
        companyName: companyName.value,
        companyDescription: companyDescription.value,
        companyAddress: companyAddress.value,
        companyCity: companyCity.value,
        businessType: businessType.value,
        role: 'user',
        verificationStatus: 'unverified',
      },
    })

    if (result.status === 'complete') {
      // By calling setActive, we update Clerk's internal state.
      // The navigation guards in router/index.js will then automatically handle
      // the redirection to the correct dashboard. We just need to trigger a
      // navigation event to activate the guard.
      await clerk.value.setActive({ session: result.createdSessionId })
      showToast('Registration successful! Redirecting...', 'success')
      // We trigger a navigation, and the router guard will direct the user
      // to the correct page (user or admin dashboard).
      await router.push('/dashboard')
    } else if (result.status === 'missing_requirements') {
      // This flow is for when email verification is enabled.
      // The user needs to be redirected to a page to enter their verification code.
      showToast('Almost there! Please check your email to verify your account.', 'info')
      await router.push('/sign-up/verify-email-address')
    }
  } catch (err) {
    console.error('Sign up error:', JSON.parse(JSON.stringify(err, null, 2)))
    if (err && err.errors && err.errors.length > 0) {
      errorMessage.value = err.errors[0].longMessage || 'An error occurred during registration.'
    } else if (err && err.message) {
      errorMessage.value = err.message
    } else {
      errorMessage.value = 'An unexpected error occurred during registration.'
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <form @submit.prevent="handleRegister" class="space-y-4">
    <!-- Company Details -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label for="company-name" class="block text-sm font-medium text-gray-700 mb-1"
          >Company Name *</label
        >
        <input
          v-model="companyName"
          type="text"
          id="company-name"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          placeholder="e.g., Acme Corp"
          required
        />
      </div>
      <div>
        <label for="company-city" class="block text-sm font-medium text-gray-700 mb-1"
          >Company City</label
        >
        <input
          v-model="companyCity"
          type="text"
          id="company-city"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          placeholder="e.g., London"
        />
      </div>
    </div>
    <div>
      <label for="company-address" class="block text-sm font-medium text-gray-700 mb-1"
        >Company Address</label
      >
      <input
        v-model="companyAddress"
        type="text"
        id="company-address"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        placeholder="e.g., 123 Business Lane"
      />
    </div>
    <div class="relative">
      <label for="business-type" class="block text-sm font-medium text-gray-700 mb-1"
        >Business Type</label
      >
      <input
        v-model="businessType"
        type="text"
        id="business-type"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        placeholder="e.g., Fintech"
        @focus="isBusinessTypeFocused = true"
        @blur="setTimeout(() => (isBusinessTypeFocused = false), 200)"
        autocomplete="off"
      />
      <div
        v-if="isBusinessTypeFocused && filteredBusinessTypes.length > 0"
        class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-56 overflow-y-auto"
      >
        <ul>
          <li
            v-for="type in filteredBusinessTypes"
            :key="type"
            @click="selectBusinessType(type)"
            class="px-4 py-2 cursor-pointer hover:bg-gray-100"
          >
            {{ type }}
          </li>
        </ul>
      </div>
    </div>
    <div>
      <label for="company-description" class="block text-sm font-medium text-gray-700 mb-1"
        >Company Description</label
      >
      <textarea
        v-model="companyDescription"
        id="company-description"
        rows="3"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        placeholder="e.g., Leading provider of innovative solutions."
      ></textarea>
    </div>

    <!-- User Details -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label for="first-name" class="block text-sm font-medium text-gray-700 mb-1"
          >First Name *</label
        >
        <input
          v-model="firstName"
          type="text"
          id="first-name"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          placeholder="e.g., John"
          required
        />
      </div>
      <div>
        <label for="last-name" class="block text-sm font-medium text-gray-700 mb-1"
          >Last Name *</label
        >
        <input
          v-model="lastName"
          type="text"
          id="last-name"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          placeholder="e.g., Doe"
          required
        />
      </div>
    </div>
    <div>
      <label for="username" class="block text-sm font-medium text-gray-700 mb-1">Username</label>
      <input
        v-model="username"
        type="text"
        id="username"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        placeholder="e.g., john.doe"
      />
    </div>
    <div>
      <label for="email" class="block text-sm font-medium text-gray-700 mb-1"
        >Email Address *</label
      >
      <input
        v-model="emailAddress"
        type="email"
        id="email"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        placeholder="e.g., john.doe@example.com"
        required
      />
    </div>
    <div>
      <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password *</label>
      <div class="relative">
        <input
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          id="password"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          placeholder="••••••••"
          required
        />
        <button
          type="button"
          @click="showPassword = !showPassword"
          class="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 cursor-pointer"
        >
          <svg
            v-if="!showPassword"
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7S3.732 16.057 2.458 12z"
            />
          </svg>
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7 .925-2.945 3.26-5.235 6.16-6.235M15.25 10.5A3.25 3.25 0 0012 7.25a3.25 3.25 0 00-3.25 3.25M15.25 10.5c0 .25-.03.5-.084.741M12 13.75a3.25 3.25 0 003.25-3.25M12 13.75c-.25 0-.5-.03-.741-.084M17.5 5.5l-14 14"
            />
          </svg>
        </button>
      </div>
      <button
        type="button"
        @click="generatePassword"
        class="text-sm text-blue-600 hover:underline mt-2 cursor-pointer"
      >
        Suggest a strong password
      </button>
    </div>
    <div>
      <label for="confirm-password" class="block text-sm font-medium text-gray-700 mb-1"
        >Confirm Password *</label
      >
      <div class="relative">
        <input
          v-model="confirmPassword"
          :type="showPassword ? 'text' : 'password'"
          id="confirm-password"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          placeholder="••••••••"
          required
        />
        <button
          type="button"
          @click="showPassword = !showPassword"
          class="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 cursor-pointer"
        >
          <svg
            v-if="!showPassword"
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7S3.732 16.057 2.458 12z"
            />
          </svg>
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7 .925-2.945 3.26-5.235 6.16-6.235M15.25 10.5A3.25 3.25 0 0012 7.25a3.25 3.25 0 00-3.25 3.25M15.25 10.5c0 .25-.03.5-.084.741M12 13.75a3.25 3.25 0 003.25-3.25M12 13.75c-.25 0-.5-.03-.741-.084M17.5 5.5l-14 14"
            />
          </svg>
        </button>
      </div>
    </div>

    <div v-if="errorMessage" class="pt-2 text-red-600 text-sm text-center">
      {{ errorMessage }}
    </div>

    <button
      type="submit"
      :disabled="isSubmitting || !isLoaded"
      class="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 shadow-lg disabled:opacity-50 transition-colors cursor-pointer"
    >
      <span v-if="!isLoaded">Loading...</span>
      <span v-else-if="isSubmitting">Registering...</span>
      <span v-else>Register</span>
    </button>
  </form>
</template>
