<!-- src/views/AccountVerificationPage.vue -->
<script setup>
import { ref, inject } from 'vue'
import { useAuth } from '@clerk/vue'

const { user } = useAuth()
const showToast = inject('showToast')

const businessCertificateFile = ref(null)
const taxClearanceFile = ref(null)
const isSubmitting = ref(false)

const handleFileUpload = (event, fileRef) => {
  const file = event.target.files[0]
  if (file) {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']
    if (!allowedTypes.includes(file.type)) {
      showToast('Invalid file type. Please upload a JPG, PNG, or PDF.', 'error')
      event.target.value = ''
      return
    }
    fileRef.value = file
  }
}

const submitForVerification = async () => {
  if (!businessCertificateFile.value || !taxClearanceFile.value) {
    showToast('Please upload both documents to proceed.', 'error')
    return
  }

  isSubmitting.value = true
  showToast('Submitting documents for verification...', 'info')

  try {
    await user.value.update({
      publicMetadata: {
        ...user.value.publicMetadata,
        verificationStatus: 'pending',
        businessCertificateUrl: `simulated_path/${businessCertificateFile.value.name}`,
        taxClearanceUrl: `simulated_path/${taxClearanceFile.value.name}`,
      },
    })

    await new Promise((resolve) => setTimeout(resolve, 1500))

    showToast('Documents submitted successfully! Your account is pending approval.', 'success')
  } catch (error) {
    console.error('Error submitting for verification:', error)
    showToast('An error occurred while submitting your documents.', 'error')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div
    class="flex flex-grow items-center justify-center bg-gray-100 dark:bg-gray-900 px-6 py-8 font-sans"
  >
    <div class="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        Business Verification
      </h1>
      <p class="text-gray-600 dark:text-gray-300 mb-6">
        Upload your business registration certificate and tax clearance for verification.
      </p>

      <form @submit.prevent="submitForVerification" class="space-y-6">
        <div>
          <label
            for="business-cert"
            class="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >Business Registration Certificate</label
          >
          <input
            id="business-cert"
            type="file"
            @change="handleFileUpload($event, businessCertificateFile)"
            class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            accept="image/png, image/jpeg, application/pdf"
          />
          <p v-if="businessCertificateFile" class="text-xs text-gray-500 mt-1">
            Selected: {{ businessCertificateFile.name }}
          </p>
        </div>

        <div>
          <label
            for="tax-clearance"
            class="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >Tax Clearance Document</label
          >
          <input
            id="tax-clearance"
            type="file"
            @change="handleFileUpload($event, taxClearanceFile)"
            class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            accept="image/png, image/jpeg, application/pdf"
          />
          <p v-if="taxClearanceFile" class="text-xs text-gray-500 mt-1">
            Selected: {{ taxClearanceFile.name }}
          </p>
        </div>

        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full py-3 cursor-pointer px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
        >
          {{ isSubmitting ? 'Submitting...' : 'Submit for Verification' }}
        </button>
      </form>
    </div>
  </div>
</template>
