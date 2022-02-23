import Vue from 'vue'
import App from './views/App.vue'
import router from './router'
import VueSweetalert2 from 'vue-sweetalert2';
import JSZip from 'jszip'

Vue.use(VueSweetalert2)
Vue.use(JSZip)
Vue.config.productionTip = false

new Vue({
  router,
  render: function (h) { return h(App) },
}).$mount('#app')