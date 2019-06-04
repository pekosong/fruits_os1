
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import Trend from 'vuetrend';
import {
  Laue
} from 'laue';
import VueGoogleCharts from 'vue-google-charts'

Vue.use(VueGoogleCharts)
Vue.config.productionTip = false
Vue.use(BootstrapVue)
Vue.use(Trend)
Vue.use(Laue)

new Vue({
  render: h => h(App),
  router,
  store,
}).$mount('#app')