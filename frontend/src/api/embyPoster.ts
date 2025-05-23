import { embyRequest } from '@/utils/request'

export const linkEmby = () => {
  return embyRequest.get('/Library/MediaFolders')
}
