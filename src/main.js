import { createApp } from 'vue'
import store  from './store'
import Board from './Board.vue'

createApp(Board)
  .use(store)
  .mount('#app')
