import { embyRequest, request } from '@/utils/request'
import type { IReplacePosterData } from '@/types/embyPoster'

// 获取emby媒体库列表
export const embyMediaLibraryList = () => {
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

export const linkEmby = () => {
  return embyRequest.get('/Library/MediaFolders')
}

// 获取emby媒体库下的剧集信息
export const embyMediaLibraryItems = (id: string) => {
  return embyRequest.get(`/emby/Items?ParentId=${id}`)
}

// emby替换当前媒体库封面
export const embyReplaceMediaLibraryPoster = (id: string, posterBase64: string) => {
  return embyRequest.post(`/Items/${id}/Images/Primary`, posterBase64, {
    headers: {
      'Content-Type': 'image/png'
    }
  })
}
