import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const load = type => name => () =>
  System.import(`./${type}/${name}.vue`)

const layout = load('layouts')
const page = load('pages')

export default new VueRouter({

  routes: [
    {
      path: '/',
      component: page('home')
    },
    {
      path: '/panel',
      component: layout('base-layout'),
      children: [
        {
          name: 'Dashboard',
          path: '',
          component: page('dashboard')
        },

        {
          name: 'Users',
          path: 'users',
          component: page('user-table')
        },

        {
          name: 'Organizations',
          path: 'organizations',
          component: page('organization-table')
        },

        {
          name: 'Projects',
          path: 'projects',
          component: page('project-table')
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
