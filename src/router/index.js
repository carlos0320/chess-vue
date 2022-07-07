import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ChessRooms from '../views/ChessRooms'
import BoardView from '../views/BoardView'

// import GameView from '../views/GameView.vue'

const routes = [
  {
    path: '/',
    name: 'home-view',
    component: HomeView
  },
  {
    path: '/chessrooms/:username',
    name: 'ChessRooms',
    component: ChessRooms
  },
  {
    path: '/chessrooms/:username/:gameId',
    name: 'BoardView',
    component: BoardView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
