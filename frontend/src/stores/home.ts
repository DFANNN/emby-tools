import { defineStore } from 'pinia'
import { trending, movieTvImages } from '@/api/home'
import type { ITrendItem } from '@/types/home'

export const useHomeStore = defineStore('home', () => {
  // 电影/电视剧类型
  const genreMap: Record<number, string> = {
    // movie
    28: '动作',
    12: '冒险',
    16: '动画',
    35: '喜剧',
    80: '犯罪',
    99: '纪录',
    18: '剧情',
    10751: '家庭',
    14: '奇幻',
    36: '历史',
    27: '恐怖',
    10402: '音乐',
    9648: '悬疑',
    10749: '爱情',
    878: '科幻',
    10770: '电视电影',
    53: '惊悚',
    10752: '战争',
    37: '西部',

    // tv
    10759: '动作冒险',
    10762: '儿童',
    10763: '新闻',
    10764: '真人秀',
    10765: '科幻 & 奇幻',
    10766: '肥皂剧',
    10767: '脱口秀',
    10768: '战争与政治'
  }

  // 今日趋势
  const trendList = ref<ITrendItem[]>([])

  const getImages = async (type: string, id: number) => {
    const { data: res } = await movieTvImages(type, id)
    return (
      res.logos.filter((item: any) => item.iso_639_1 === 'zh')[0]?.file_path ||
      res.logos.filter((item: any) => item.iso_639_1 === 'en')[0]?.file_path ||
      ''
    )
  }

  // 获取今日趋势
  const getTrendList = async () => {
    const { data: res } = await trending('day')
    const baseUrl = 'https://image.tmdb.org/t/p/original'

    // 一次性并发请求所有 logo
    const trendWithLogos = await Promise.all(
      res.results.slice(0, 20).map(async (item: any) => {
        const logoPath = await getImages(item.media_type, item.id)
        return {
          ...item,
          backdrop_path: `${baseUrl}${item.backdrop_path}`,
          poster_path: `${baseUrl}${item.poster_path}`,
          logo_path: logoPath ? `${baseUrl}${logoPath}` : ''
        }
      })
    )

    trendList.value = trendWithLogos
  }

  return {
    genreMap,
    trendList,
    getTrendList
  }
})
