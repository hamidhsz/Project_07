
import { createRouter, createWebHistory } from 'vue-router'
import LogPage from '../views/LogPage.vue'
import HomePage from '../views/HomePage.vue'
import OwnerProfile from '../views/OwnerProfile.vue'
import UserProfile from '../views/UserProfile.vue'


const routes = [
  {
    path: '/',
    name: 'Login',
    component: LogPage
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/profile',
    name: 'OwnerProfile',
    component: OwnerProfile
  },
  {
    path: '/users',
    name: 'UserProfile',
    component: UserProfile
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router
