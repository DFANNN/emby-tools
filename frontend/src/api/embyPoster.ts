import request from '@/utils/request'

export const linkEmby = (data: any) => {
  return request.post('/a', data)
}
