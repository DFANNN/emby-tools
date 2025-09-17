import { defineStore } from 'pinia'
import type { ITabType } from '@/types/components/tabs'

export const useTabsStore = defineStore('tabs', () => {
  // 标签页
  const tabList = ref<ITabType[]>([{ path: '/layouts/home', name: 'home', icon: 'Guide', title: '首页' }])
  // 需要缓存的页面名称
  const keepAliveComponentName = ref(['home'])

  return { tabList, keepAliveComponentName }
})
