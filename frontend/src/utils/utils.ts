import type { ITrendItem } from '@/types/dailyRecommendation'

export function getSeriesNameFromPath(path: string): string {
  if (!path) return ''
  const cleanPath = path.replace(/[\\/]+$/, '')
  const parts = cleanPath.split(/[\\/]/)
  if (parts.length === 0) return ''
  // 判断最后一级是否为季/新建文件夹等
  let name = ''
  const last = parts[parts.length - 1].toLowerCase()
  if (/season|第.*季|新建文件夹|^s\d{1,2}$/i.test(last)) {
    name = parts[parts.length - 2]
  } else {
    name = parts[parts.length - 1]
  }
  // 去除括号内的年份，如 "Adolescence (2025)" => "Adolescence"
  name = name.replace(/\(\s*\d{4}\s*\)/g, '').trim()
  // 去除结尾的年份，如 "三体 2023" => "三体"
  name = name.replace(/\s*\d{4}$/, '').trim()
  return name
}

// 判断媒体类型
export const resolveMediaType = (item: ITrendItem): 'movie' | 'tv' => {
  const mt = (item.media_type || '').toLowerCase()
  if (mt === 'movie' || mt === 'tv') return mt as 'movie' | 'tv'
  // 兜底：根据日期字段推断
  if (item.first_air_date && !item.release_date) return 'tv'
  if (item.release_date && !item.first_air_date) return 'movie'
  // 再兜底：title 倾向 movie，name 倾向 tv
  if (item.title && !item.name) return 'movie'
  return 'tv'
}

// 根据媒体类型打开详情页
export const openTmdb = (item: ITrendItem) => {
  const type = resolveMediaType(item)
  const url = `https://www.themoviedb.org/${type}/${item.id}`
  const win = window.open(url, '_blank', 'noopener,noreferrer')
  if (win) win.opener = null
}
