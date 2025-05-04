// 存储布局参数的store
import { defineStore } from 'pinia'

export const useLayoutStore = defineStore('layout', () => {
  // 控制菜单折叠
  const isCollapse = ref(false)

  return {
    isCollapse
  }
})
