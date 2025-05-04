const routes = [
  {
    path: '/',
    redirect: '/layouts/embyPoster'
  },
  {
    path: '/layouts',
    name: 'layouts',
    component: () => import('@/layouts/index.vue'),
    children: [
      {
        path: 'embyPoster',
        name: 'embyPoster',
        component: () => import('@/views/embyPoster/index.vue')
      }
    ]
  }
]

export default routes
