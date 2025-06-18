import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { tolgee, VueTolgee } from './tolgee'
import './assets/main.css'; // Import the main CSS file

const app = createApp(App)
app.use(router)
app.use(VueTolgee, { tolgee })
app.mount('#app')
