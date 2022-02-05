import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/Index.vue'
import _Set from '../views/Set.vue'
import Album from '../views/Album.vue'
import Image from '../views/Image.vue'
import Settings from '../views/Settings.vue'
import Core_Image from '../views/Core_Image.vue'
import Admin from '../views/Admin.vue'

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
    alias: '/@/:set/:album/:image',
    name: 'Album',
    component: Album
  },
  {
    path: '/>/:set/:album/:image',
    name: 'Image',
    component: Image
  },
  {
    path: '/</:set/:album/:image',
    name: 'Core_Image',
    component: Core_Image
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router