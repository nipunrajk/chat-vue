import { createApp } from 'vue'
import App from './App.vue'

// import './assets/sass/style.scss'
import 'bootstrap/dist/css/bootstrap.css'
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle'
import './style.css'

createApp(App).use(bootstrap).mount('#app')
