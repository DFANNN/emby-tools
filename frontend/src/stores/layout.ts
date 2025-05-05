// 存储布局参数的store
import { defineStore } from 'pinia'
import { useDark } from '@vueuse/core'

export const useLayoutStore = defineStore('layout', () => {
  // 控制菜单折叠
  const isCollapse = ref(false)

  // 控制暗夜/明亮模式
  const isDark = useDark({
    selector: 'html', // 默认就是 html
    valueDark: 'dark',
    valueLight: 'light',
    storageKey: 'vueuse-color-scheme'
  })

  // 当前主题模式，支持三种值 (light, dark, auto)
  const themeMode = ref(localStorage.getItem('vueuse-color-scheme') || 'light')

  // 监听 themeMode 改变 isDark 和 localStorage
  watch(themeMode, val => {
    if (val === 'auto') {
      localStorage.removeItem('vueuse-color-scheme')
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      isDark.value = systemDark
    } else {
      localStorage.setItem('vueuse-color-scheme', val)
      isDark.value = val === 'dark'
    }
  })

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
