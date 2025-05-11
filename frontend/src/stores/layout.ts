// 存储布局参数的store
import { defineStore } from 'pinia'

export const useLayoutStore = defineStore('layout', () => {
  // 控制菜单折叠
  const isCollapse = ref(false)

  // 当前主题模式，支持三种值 (light, dark, auto)
  const themeMode = ref(localStorage.getItem('themeMode') || 'light')

  /**
   * 监听 themeMode改变
   * 将最新的themeMode值存储在localStorage中
   */
  watch(
    themeMode,
    val => {
      const html = document.documentElement
      localStorage.setItem('themeMode', val)
      if (val === 'auto') {
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        html.className = systemDark ? 'dark' : 'light'
      } else {
        html.className = val
      }
    },
    {
      immediate: true
    }
  )

  // 切换主题方法：auto → light → dark → auto ...
  const toggleTheme = () => {
    if (themeMode.value === 'auto') {
      themeMode.value = 'light'
    } else if (themeMode.value === 'light') {
      themeMode.value = 'dark'
    } else {
      themeMode.value = 'auto'
    }
  }

  return {
    isCollapse,
    themeMode,
    toggleTheme
  }
})
