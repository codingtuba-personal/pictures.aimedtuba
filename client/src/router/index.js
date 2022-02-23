import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/Index.vue'
import _Set from '../views/Set.vue'
import Album from '../views/Album.vue'
import Settings from '../views/Settings.vue'
import Support from '../views/Support.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Index',
    component: Index
  },
  {
    path: '/@/:set',
    name: 'Set',
    component: _Set
  },
  {
    path: '/@/:set/:album',
    name: 'Album',
    component: Album
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings
  },
  {
    path:'/support',
    name:'Support',
    component:Support
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router