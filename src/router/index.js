import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ChessRooms from '../views/ChessRooms'
import Board from '../views/Board'
import SignUp from '../views/SignUp'
//import GameView from '../views/GameView.vue'
import store from '../store'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/signup',
    name: 'signup',
    component: SignUp
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