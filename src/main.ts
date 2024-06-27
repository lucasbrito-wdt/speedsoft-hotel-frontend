import { createApp } from 'vue'

import { mask } from 'vue-the-mask'
import { vue3Debounce } from 'vue-debounce'
import InfiniteLoading from 'v3-infinite-loading'
import { registerPlugins } from '@core/utils/plugins'
import App from '@/App.vue'

// Styles
import '@core/scss/template/index.scss'
import '@styles/styles.scss'
import 'v3-infinite-loading/lib/style.css'

// Create vue app
const app = createApp(App) // required if you're not going to override default slots

// Use components
app.component('InfiniteLoading', InfiniteLoading)

// Use directives
app.directive('mask', mask)
app.directive('debounce', vue3Debounce({ lock: true }))

// Register plugins
registerPlugins(app)

// Mount vue app
app.mount('#app')

console.log('👋 This message is being logged by "renderer.ts", included via Vite')
