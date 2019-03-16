import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'main',
      component: require('@/components/Main').default
    },
    {
      path: '/vegetables',
      name: 'vegetables',
      component: require('@/components/Vegetables').default
    },
    {
      path: '/fruits',
      name: 'fruits',
      component: require('@/components/Fruits').default
    },
    {
      path: '/static',
      name: 'static',
      component: require('@/components/Static').default
    },
    {
      path: '/howto',
      name: 'howto',
      component: require('@/components/HowTo').default
    }
  ]
})
