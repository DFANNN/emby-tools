import { request } from '@/utils/request'
import type { LinkEmbyConfigFormType } from '@/types/layout'

// 连接Emby
export const loginEmby = (data: LinkEmbyConfigFormType) => {
  return request.post('/emby/login', data)
}
