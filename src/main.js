import { createApp } from 'vue'
import store  from './store'
import router from './router'
import App from './App'

createApp(App)
  .use(router)
  .use(store)
  .mount('#app')
