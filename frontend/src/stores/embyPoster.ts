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

  // HSL 转 RGB（0-360, 0-100, 0-100 -> 0-255）
  const hslToRgb = (h: number, s: number, l: number) => {
    const sat = s / 100
    const lig = l / 100
    const c = (1 - Math.abs(2 * lig - 1)) * sat
    const hh = h / 60
    const x = c * (1 - Math.abs((hh % 2) - 1))
    let r1 = 0,
      g1 = 0,
      b1 = 0
    if (hh >= 0 && hh < 1) {
      r1 = c
      g1 = x
      b1 = 0
    } else if (hh >= 1 && hh < 2) {
      r1 = x
      g1 = c
      b1 = 0
    } else if (hh >= 2 && hh < 3) {
      r1 = 0
      g1 = c
      b1 = x
    } else if (hh >= 3 && hh < 4) {
      r1 = 0
      g1 = x
      b1 = c
    } else if (hh >= 4 && hh < 5) {
      r1 = x
      g1 = 0
      b1 = c
    } else {
      r1 = c
      g1 = 0
      b1 = x
    }
    const m = lig - c / 2
    const r = Math.round((r1 + m) * 255)
    const g = Math.round((g1 + m) * 255)
    const b = Math.round((b1 + m) * 255)
    return { r, g, b }
  }

  type PaletteName =
    | 'cool' // 冷色：蓝、青、紫
    | 'warm' // 暖色：红、橙、金、粉
    | 'neutral' // 中性：灰、蓝灰、棕灰
    | 'blue'
    | 'purple'
    | 'teal'
    | 'green'
    | 'gold'
    | 'orange'
    | 'pink'
    | 'brown'
    | 'random'

  // 基于色系用 HSL 生成更可控的颜色
  const generateColorByPalette = (palette: PaletteName = 'random') => {
    // 不同色系的色相范围（度数）
    const hueRanges: Record<Exclude<PaletteName, 'random' | 'neutral'>, [number, number]> = {
      cool: [180, 300],
      warm: [330, 390], // 330-360 与 0-30 跨 360
      blue: [200, 240],
      purple: [260, 300],
      teal: [170, 190],
      green: [110, 150],
      gold: [40, 55],
      orange: [20, 35],
      pink: [320, 350],
      brown: [20, 30]
    }

    // 中性不强调色相，低饱和高灰度
    const pickNeutral = () => {
      const h = Math.floor(Math.random() * 360)
      const s = Math.floor(Math.random() * 12) + 5 // 5-16 低饱和
      const l = Math.floor(Math.random() * 25) + 30 // 30-54 较暗中性
      return hslToRgb(h, s, l)
    }

    // 暖色段需要处理跨 360 的区间
    const pickHueInRange = (range: [number, number]) => {
      let h: number
      if (range[1] > 360) {
        const part1 = range[1] - 360 // 0..x
        if (Math.random() < 0.5) h = Math.random() * (360 - range[0]) + range[0]
        else h = Math.random() * part1
      } else {
        h = Math.random() * (range[1] - range[0]) + range[0]
      }
      return (h + 360) % 360
    }

    let h: number
    if (palette === 'random') {
      h = Math.floor(Math.random() * 360)
    } else if (palette === 'neutral') {
      return pickNeutral()
    } else {
      const range = hueRanges[palette]
      h = pickHueInRange(range)
    }

    // 背景友好：中低饱和 + 中低亮度
    const s = Math.floor(Math.random() * 35) + 25 // 25-59
    const l = Math.floor(Math.random() * 25) + 30 // 30-54
    return hslToRgb(h, s, l)
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

  // 生成渐变色（支持色系偏好与类型）
  type GradientOptions = {
    palette?: PaletteName | PaletteName[]
    type?: 'auto' | 'linear' | 'radial' | 'diagonal'
    stops?: 2 | 3
  }

  const generateGradient = (options: GradientOptions = {}) => {
    const paletteOpt = options.palette
    const pickPalette = (): PaletteName => {
      if (!paletteOpt) return 'random'
      return Array.isArray(paletteOpt)
        ? (paletteOpt[Math.floor(Math.random() * paletteOpt.length)] as PaletteName)
        : paletteOpt
    }

    // 颜色选择：优先按色系生成，保持和谐用近似或相邻色相
    const basePalette = pickPalette()
    const color1 = basePalette === 'random' ? generateRandomColor() : generateColorByPalette(basePalette)
    let color2: { r: number; g: number; b: number }
    let attempts = 0

    do {
      const p2 = pickPalette()
      color2 = p2 === 'random' ? generateRandomColor() : generateColorByPalette(p2)
      attempts++
    } while (!isColorHarmonious(color1, color2) && attempts < 30)

    const stops = options.stops ?? (Math.random() < 0.4 ? 3 : 2)

    const type = options.type ?? 'auto'
    const gradientBuilders: Array<() => string> = []

    const hex1 = rgbToHex(color1.r, color1.g, color1.b)
    const hex2 = rgbToHex(color2.r, color2.g, color2.b)
    const buildWithThird = (angle: string) => {
      const color3 = generateColorByPalette(pickPalette())
      const hex3 = rgbToHex(color3.r, color3.g, color3.b)
      return `linear-gradient(${angle}, ${hex1} 0%, ${hex2} 50%, ${hex3} 100%)`
    }

    const addLinear = (angle: string) => {
      if (stops === 2) gradientBuilders.push(() => `linear-gradient(${angle}, ${hex1} 0%, ${hex2} 100%)`)
      else gradientBuilders.push(() => buildWithThird(angle))
    }

    const addRadial = () => {
      if (stops === 2) gradientBuilders.push(() => `radial-gradient(circle at 30% 70%, ${hex1} 0%, ${hex2} 100%)`)
      else {
        const color3 = generateColorByPalette(pickPalette())
        const hex3 = rgbToHex(color3.r, color3.g, color3.b)
        gradientBuilders.push(() => `radial-gradient(circle at 35% 65%, ${hex1} 0%, ${hex2} 55%, ${hex3} 100%)`)
      }
    }

    if (type === 'linear' || type === 'auto') {
      addLinear('120deg')
    }
    if (type === 'diagonal' || type === 'auto') {
      addLinear('45deg')
    }
    if (type === 'radial' || type === 'auto') {
      addRadial()
    }

    const builder = gradientBuilders[Math.floor(Math.random() * gradientBuilders.length)]
    return builder()
  }

  // 获取随机渐变色
  const getRandomGradient = (options?: GradientOptions) => {
    return generateGradient(options ?? {})
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
