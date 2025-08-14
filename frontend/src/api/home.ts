import { tmdbRequest } from '@/utils/request'

// 获取TMDB所有趋势的接口
export const trending = (time: 'day' | 'week') => {
  return tmdbRequest.get(`/3/trending/all/${time}?language=zh-CN`)
}

// 获取TMDB当前电影/电视剧的图片
export const movieTvImages = (type: string, id: number) => {
  return tmdbRequest.get(`/3/${type}/${id}/images`)
}
