import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { clerkPlugin } from '@clerk/vue'

import App from './App.vue'
import router from './router'

import './assets/main.css'

const app = createApp(App)

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!clerkPubKey) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY from .env')
}

app.use(createPinia())
app.use(clerkPlugin, {
  publishableKey: clerkPubKey,
  routerPush: (to) => router.push(to),
  routerReplace: (to) => router.replace(to),
  forceRedirectUrl: '/dashboard',
  // afterSignUpUrl: '/dashboard',
})
app.use(router)

app.mount('#app')
