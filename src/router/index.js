import { createRouter, createWebHistory } from 'vue-router'
import Setupgame from '../views/Setupgame.vue'
import GameView from '../views/GameView.vue'
import Scoreboard from '../views/Scoreboard.vue'
import HomeView from '../views/HomeView.vue'

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/new', name: 'Setupgame', component: Setupgame },
  { path: '/game/:gameId', name: 'GameView', component: GameView },
  { path: '/scoreboard', name: 'Scoreboard', component: Scoreboard }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router

