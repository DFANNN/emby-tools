import { request } from '@/utils/request'

export const folderContent = (path: string) => {
  return request.get(`/rename/folder-content?dirPath=${path}`)
}
