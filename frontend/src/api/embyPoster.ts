import { request } from '@/utils/request'
import type { IReplacePosterData } from '@/types/embyPoster'

// 获取emby媒体库列表
export const embyMediaLibrary = () => {
  return request.get('/emby/mediaLibraryList')
}

// 随机获取当前媒体库下的emby封面图
export const radomPoster = (mediaId: string, radomNum: number) => {
  return request.get(`/emby/radomEmbyPosterList?mediaId=${mediaId}&radomNum=${radomNum}`)
}

// 替换emby媒体库封面图
export const embyReplacePoster = (data: IReplacePosterData) => {
  return request.post('/emby/embyReplacePoster', data)
}
