import { embyRequest } from '@/utils/request'

export const linkEmby = () => {
  return embyRequest.get('/Library/MediaFolders')
}

// 获取emby媒体库下的剧集信息
export const embyMediaLibraryItems = (id: string) => {
  return embyRequest.get(`/emby/Items?ParentId=${id}`)
}
