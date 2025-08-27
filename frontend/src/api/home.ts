import { request, tmdbRequest } from '@/utils/request'

// 媒体库概览（统计电影、剧集、音乐数量）
export const mediaCount = () => {
  return request.get('/emby/mediaCount')
}

// 获取存储占用空间
export const embyStorage = () => {
  return request.get('/emby/storage')
}

// 获取播放时长
export const embyPlayTime = () => {
  return request.get('/emby/playTime')
}

// 最近添加
export const embyLatestAdd = () => {
  return request.get('/emby/latestAdd')
}

// 获取TMDB所有趋势的接口
export const trending = (time: 'day' | 'week') => {
  return tmdbRequest.get(`/3/trending/all/${time}?language=zh-CN`)
}

// 获取TMDB当前电影/电视剧的图片
export const movieTvImages = (type: string, id: number) => {
  return tmdbRequest.get(`/3/${type}/${id}/images`)
}
