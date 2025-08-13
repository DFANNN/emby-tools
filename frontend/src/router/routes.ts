/**
 * meta字段说明
 * title: 菜单标题
 * icon: 菜单图标
 * isMenu: 是否显示在菜单中
 * modeInfo: 模式描述
 * group: 菜单分组
 */

// 菜单分组
export const groupMap: Record<string, any> = {
  renameTools: {
    title: 'emby更名工具',
    icon: 'EditPen'
  }
}

const routes = [
  {
    path: '/',
    redirect: '/layouts/home'
  },
  {
    path: '/layouts',
    name: 'layouts',
    component: () => import('@/layouts/index.vue'),
    children: [
      {
        path: 'home',
        name: 'home',
        component: () => import('@/views/home/index.vue'),
        meta: { title: '首页', icon: 'Guide', isMenu: true }
      },
      {
        path: 'embyPoster',
        name: 'embyPoster',
        component: () => import('@/views/embyPoster/index.vue'),
        meta: { title: 'emby媒体库封面', icon: 'Picture', isMenu: true }
      },
      {
        path: 'embyRename',
        name: 'embyRename',
        component: () => import('@/views/rename/index.vue'),
        meta: { title: 'emby批量重命名', icon: 'EditPen', isMenu: true }
      }
    ]
  }
]

export default routes
