/**
 * meta字段说明
 * title: 菜单标题
 * icon: 菜单图标
 * isMenu: 是否显示在菜单中
 * modeInfo: 模式描述
 * group: 菜单分组
 */

// 模式的描述
const tvSeriesModeInfo =
  '电视剧模式用于批量重命名文件，适用于电视剧集文件的统一命名规则。该模式可以自动为每一集的文件添加季号、集数，并将其重命名为指定格式。'
const replaceTextModeInfo =
  '替换文本模式用于将文件名中已有的文本替换成新的文本。该模式非常适用于批量修正文件名中的错误文本或按用户需求修改文件名中的特定部分。'
const insertTextModeInfo =
  '插入文本模式用于在文件名的指定位置插入自定义文本。该模式允许用户在文件名的开始或结尾插入文本，灵活地修改文件名结构。'

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
        component: () => import('@/views/embyPoster/index.vue'),
        meta: { title: 'emby媒体库封面', icon: 'Picture', isMenu: true }
      },
      {
        path: 'tvSeriesMode',
        name: 'tvSeriesMode',
        component: () => import('@/views/rename/tvSeriesMode/index.vue'),
        meta: {
          title: '电视剧集模式',
          modeInfo: tvSeriesModeInfo,
          icon: 'VideoCamera',
          isMenu: true,
          group: 'renameTools'
        }
      },
      {
        path: 'replaceTextMode',
        name: 'replaceTextMode',
        component: () => import('@/views/rename/replaceTextMode/index.vue'),
        meta: {
          title: '替换文本模式',
          modeInfo: replaceTextModeInfo,
          icon: 'DocumentCopy',
          isMenu: true,
          group: 'renameTools'
        }
      },
      {
        path: 'insertTextMode',
        name: 'insertTextMode',
        component: () => import('@/views/rename/insertTextMode/index.vue'),
        meta: {
          title: '插入文本模式',
          modeInfo: insertTextModeInfo,
          icon: 'DocumentRemove',
          isMenu: true,
          group: 'renameTools'
        }
      }
    ]
  }
]

export default routes
