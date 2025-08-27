// 存储布局参数的store
import { defineStore } from 'pinia'
import { loginEmby } from '@/api/layout'
import { ElMessage } from 'element-plus'
import type { LinkEmbyConfigFormType } from '@/types/layout'

export const useLayoutStore = defineStore('layout', () => {
  // 控制菜单折叠
  const isCollapse = ref(true)

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

  // 连接emby设置的form
  const linkEmbyConfigForm = ref<LinkEmbyConfigFormType>({
    protocol: 'http',
    ip: '',
    port: '8096',
    Username: '',
    Pw: ''
  })

  // Emby连接状态
  const linkEmbyStatus = ref(false)

  // 存储Emby连接配置信息
  const storageEmbyConfigInfo = async () => {
    localStorage.setItem('embyConfigInfo', JSON.stringify(linkEmbyConfigForm.value))
  }

  // 连接Emby
  const connectToEmby = async () => {
    const { data: res } = await loginEmby(linkEmbyConfigForm.value)
    if (res.code === 200) {
      linkEmbyStatus.value = true
      ElMessage.success('连接Emby成功')
      storageEmbyConfigInfo()
    } else {
      linkEmbyStatus.value = false
      ElMessage.error(`连接Emby失败,${res.message}`)
    }
    return res.code
  }

  return {
    isCollapse,
    themeMode,
    toggleTheme,
    linkEmbyConfigForm,
    linkEmbyStatus,
    connectToEmby
  }
})
