import Vue from 'vue'
import VueRouter from 'vue-router'
import store from 'store'

Vue.use(VueRouter)

const load = type => name => () =>
  System.import(`./${type}/${name}.vue`)

const layout = load('layouts')
const page = load('pages')

export default new VueRouter({

  routes: [
    {
      name: 'Login',
      path: '/',
      component: page('auth/login')
    },

    {
      name: 'Logout',
      path: '/logout',
      component: page('auth/logout')
    },

    {
      path: '/panel',
      component: layout('base-layout'),
      children: [
        {
          name: 'Dashboard',
          path: '',
          component: page('dashboard'),
          beforeEnter: requireAuth
        },

        {
          name: 'Users',
          path: 'users',
          component: page('user-table'),
          beforeEnter: requireAuth
        },

        {
          name: 'Organizations',
          path: 'organizations',
          component: page('organization-table'),
          beforeEnter: requireAuth
        },

        {
          name: 'Projects',
          path: 'projects',
          component: page('project-table'),
          beforeEnter: requireAuth
        }
      ]
    },
     // Not found
    {
      name: 'Error404',
      path: '*',
      component: load('Error404')
    }
  ]
})

function requireAuth (to, from, next) {
  if (store.getters.isAuthenticated) {
    return next()
  }

  return next({
    name: 'Login'
  })
}
