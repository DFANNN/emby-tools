// embyPoster的仓库
import { defineStore } from 'pinia'
import { radomPoster, embyReplacePoster, embyMediaLibrary } from '@/api/embyPoster'
import type { IRuleForm, IEmbyMediaLibraryItem, IReplacePosterData } from '@/types/embyPoster'

export const useEmbyPosterStore = defineStore('embyPoster', () => {
  // loading
  const loading = ref(false)
  const loadingText = ref('')

  // 随机生成图片数
  const posterOneRadomNum = ref(9)

  // 是否展示预览海报
  const showPreviewPoster = ref(false)

  // emby媒体库列表
  const embyMediaLibraryList = ref<IEmbyMediaLibraryItem[]>([])

  // 需要生成封面的媒体库id
  const ruleForm = ref<IRuleForm>({
    ids: []
  })

  // 需要生成封面的媒体库列表
  const needGeneratePosterMediaLibraryList = ref<IEmbyMediaLibraryItem[]>([])

  // 颜色工具函数

  const rgbToHex = (r: number, g: number, b: number) => {
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
  }

  // 计算颜色亮度
  const getLuminance = (r: number, g: number, b: number) => {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
  }

  // 检查颜色是否过于鲜艳或刺眼
  const isColorTooBright = (r: number, g: number, b: number) => {
    const luminance = getLuminance(r, g, b)
    // 过滤掉过亮或过暗的颜色
    if (luminance > 0.8 || luminance < 0.1) return true

    // 检查是否过于饱和（RGB值差异过大）
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    const saturation = (max - min) / max
    if (saturation > 0.9) return true

    return false
  }

  // 检查颜色组合是否和谐
  const isColorHarmonious = (
    color1: { r: number; g: number; b: number },
    color2: { r: number; g: number; b: number }
  ) => {
    // 计算色相差异
    const hue1 = Math.atan2(Math.sqrt(3) * (color1.g - color1.b), 2 * color1.r - color1.g - color1.b)
    const hue2 = Math.atan2(Math.sqrt(3) * (color2.g - color2.b), 2 * color2.r - color2.g - color2.b)
    const hueDiff = Math.abs(hue1 - hue2)

    // 色相差异在合理范围内（避免互补色过于刺眼）
    if (hueDiff > Math.PI * 0.8 && hueDiff < Math.PI * 1.2) return false

    // 亮度差异不要太大
    const lum1 = getLuminance(color1.r, color1.g, color1.b)
    const lum2 = getLuminance(color2.r, color2.g, color2.b)
    if (Math.abs(lum1 - lum2) > 0.6) return false

    return true
  }

  // 生成随机颜色
  const generateRandomColor = () => {
    let r, g, b
    let attempts = 0

    do {
      // 偏向生成较暗的颜色，更适合作为背景
      r = Math.floor(Math.random() * 180) + 20
      g = Math.floor(Math.random() * 180) + 20
      b = Math.floor(Math.random() * 180) + 20
      attempts++
    } while (isColorTooBright(r, g, b) && attempts < 50)

    return { r, g, b }
  }

  // 生成渐变色
  const generateGradient = () => {
    const color1 = generateRandomColor()
    let color2 = generateRandomColor()
    let attempts = 0

    // 确保两个颜色搭配和谐
    while (!isColorHarmonious(color1, color2) && attempts < 20) {
      color2 = generateRandomColor()
      attempts++
    }

    // 随机选择渐变类型
    const gradientTypes = [
      // 两色渐变
      () =>
        `linear-gradient(120deg, ${rgbToHex(color1.r, color1.g, color1.b)} 0%, ${rgbToHex(
          color2.r,
          color2.g,
          color2.b
        )} 100%)`,
      // 三色渐变
      () => {
        const color3 = generateRandomColor()
        return `linear-gradient(120deg, ${rgbToHex(color1.r, color1.g, color1.b)} 0%, ${rgbToHex(
          color2.r,
          color2.g,
          color2.b
        )} 50%, ${rgbToHex(color3.r, color3.g, color3.b)} 100%)`
      },
      // 径向渐变
      () =>
        `radial-gradient(circle at 30% 70%, ${rgbToHex(color1.r, color1.g, color1.b)} 0%, ${rgbToHex(
          color2.r,
          color2.g,
          color2.b
        )} 100%)`,
      // 对角渐变
      () =>
        `linear-gradient(45deg, ${rgbToHex(color1.r, color1.g, color1.b)} 0%, ${rgbToHex(
          color2.r,
          color2.g,
          color2.b
        )} 100%)`
    ]

    const randomType = gradientTypes[Math.floor(Math.random() * gradientTypes.length)]
    return randomType()
  }

  // 获取随机渐变色
  const getRandomGradient = () => {
    return generateGradient()
  }

  // 获取emby随机图片
  const getRadomPoster = async (mediaId: string) => {
    const { data: res } = await radomPoster(mediaId, posterOneRadomNum.value)
    if (res.code === 200) {
      return res.data
    }
    return []
  }

  // 替换emby媒体库封面图
  const replacePoster = async (data: IReplacePosterData) => {
    return embyReplacePoster(data)
  }

  const getEmbyMediaLibraryList = async () => {
    const { data: res } = await embyMediaLibrary()
    if (res.code === 200) {
      embyMediaLibraryList.value = res.data
      ruleForm.value.ids = res.data.map((item: any) => item.Id)
      showPreviewPoster.value = false
    }
  }

  return {
    loading,
    loadingText,
    ruleForm,
    embyMediaLibraryList,
    showPreviewPoster,
    needGeneratePosterMediaLibraryList,
    getRandomGradient,
    getRadomPoster,
    replacePoster,
    getEmbyMediaLibraryList
  }
})
