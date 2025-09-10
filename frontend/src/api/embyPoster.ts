import { embyRequest, request } from '@/utils/request'

// 获取emby媒体库列表
export const embyMediaLibraryList = () => {
  return request.get('/emby/mediaLibraryList')
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
