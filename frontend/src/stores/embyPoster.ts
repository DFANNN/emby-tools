// embyPoster的仓库
import { defineStore } from 'pinia'
import type { RuleForm } from '@/types/embyPoster'

export const useEmbyPosterStore = defineStore('embyPoster', () => {
  //所有规则
  const allRuleList = ref([
    {
      id: '1',
      name: '规则一',
      description: '第一个内置规则哦第一个内置规则哦第一个内置规则哦第一个内置规则哦！！！',
      layout: '1',
      source: 'tmdb'
    },
    {
      id: '2',
      name: '规则二',
      description: '第二个内置规则哦第一个内置规则哦第一个内置规则哦第一个内置规则哦！！！',
      layout: '2',
      source: 'tmdb'
    },
    {
      id: '3',
      name: '规则三',
      description: '第三个内置规则哦第一个内置规则哦第一个内置规则哦第一个内置规则哦！！！',
      layout: '3',
      source: 'local'
    },
    {
      id: '4',
      name: '规则三',
      description: '第三个内置规则哦第一个内置规则哦第一个内置规则哦第一个内置规则哦！！！',
      layout: '3',
      source: 'local'
    },
    {
      id: '5',
      name: '规则三',
      description: '第三个内置规则哦第一个内置规则哦第一个内置规则哦第一个内置规则哦！！！',
      layout: '3',
      source: 'local'
    },
    {
      id: '6',
      name: '规则三',
      description: '第三个内置规则哦第一个内置规则哦第一个内置规则哦第一个内置规则哦！！！',
      layout: '3',
      source: 'local'
    },
    {
      id: '7',
      name: '规则三',
      description: '第三个内置规则哦第一个内置规则哦第一个内置规则哦第一个内置规则哦！！！',
      layout: '3',
      source: 'local'
    },
    {
      id: '8',
      name: '规则三',
      description: '第三个内置规则哦第一个内置规则哦第一个内置规则哦第一个内置规则哦！！！',
      layout: '3',
      source: 'local'
    }
  ])

  // 当前生成封面的规则
  const currentGeneratePosterRule = ref({
    id: '1',
    name: '规则一',
    description: '第一个内置规则哦第一个内置规则哦第一个内置规则哦第一个内置规则哦！！！',
    layout: '1',
    source: 'tmdb'
  })

  // 规则表单
  const rulesForm = ref<RuleForm>({
    id: undefined,
    name: '',
    description: '',
    layout: '1',
    source: 'tmdb'
  })

  // 布局样式
  const layoutList = ref([
    { name: '样式一', value: '1' },
    { name: '样式二', value: '2' },
    { name: '样式三', value: '3' }
  ])

  //图片来源
  const sourceList = ref([
    { name: '本地媒体库', value: 'local' },
    { name: 'TMDB 热门', value: 'tmdb' }
  ])

  return {
    allRuleList,
    currentGeneratePosterRule,
    rulesForm,
    layoutList,
    sourceList
  }
})
