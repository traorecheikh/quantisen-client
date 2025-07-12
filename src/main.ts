import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index';
import Toast, { POSITION } from 'vue-toastification'
import 'vue-toastification/dist/index.css'

const app = createApp(App)
app.use(router)
app.use(Toast, {
  position: POSITION.BOTTOM_RIGHT,
  timeout: 2000,
  closeOnClick: true,
  pauseOnHover: true,
  hideProgressBar: false,
  type: 'default',
})
app.mount('#app')
