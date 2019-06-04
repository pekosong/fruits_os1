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
      path: '/items/:category',
      name: 'category',
      component: require('@/components/ClassMain').default
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
