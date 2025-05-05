import { defineStore } from 'pinia'
import router from '@/router/index'
import { groupMap } from '@/router/routes'

interface IMenuItem {
  path: string | null
  name: string
  icon: string
  children?: IMenuItem[]
}

export const useMenuStore = defineStore('menu', () => {
  const menuList = ref<IMenuItem[]>([])

  const getMenu = () => {
    // 筛选出作为菜单的路由
    const routeList = router.getRoutes().filter(item => item.meta.isMenu)
    // 递归处理路由，帮菜单变为tree结构
    menuList.value = disposeRouteByMenu(routeList)
  }

  // 递归路由变为菜单 将菜单变为tree结构
  const disposeRouteByMenu = (routeList: any[]): IMenuItem[] => {
    const menuMap = new Map<string, IMenuItem>()
    const topLevelMenus: IMenuItem[] = []

    routeList.forEach(item => {
      const group = item.meta.group
      const menuItem: IMenuItem = {
        path: item.path,
        name: item.meta.title,
        icon: item.meta.icon
      }

      if (group) {
        // 如果 groupMap 中没有定义该 group，跳过
        const groupInfo = groupMap[group]
        if (!groupInfo) return

        // 如果该分组已存在，添加子项；否则初始化
        if (!menuMap.has(group)) {
          menuMap.set(group, {
            path: null,
            name: groupInfo.title,
            icon: groupInfo.icon,
            children: []
          })
        }
        menuMap.get(group)?.children?.push(menuItem)
      } else {
        // 无分组，作为顶级菜单项
        topLevelMenus.push({ ...menuItem, children: [] })
      }
    })

    // 将 map 中的 group 菜单插入顶级菜单中
    const groupedMenus = Array.from(menuMap.values())
    return [...topLevelMenus, ...groupedMenus]
  }

  return {
    menuList,
    getMenu
  }
})
