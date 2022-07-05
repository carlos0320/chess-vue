import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ChessRooms from '../views/ChessRooms'
import Board from '../views/Board'
//import GameView from '../views/GameView.vue'
import store from '../store'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/chessrooms/:username',
    name: 'ChessRooms',
    component: ChessRooms
  },
  {
    path: '/chessrooms/:username/:gameId',
    name: 'Board',
    component: Board
  },
  
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router