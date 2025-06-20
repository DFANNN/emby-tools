import { request } from '@/utils/request'

// 获取文件夹内容
export const folderContent = (path: string) => {
  return request.get(`/rename/folder-content?dirPath=${path}`)
}

// 更名接口
export const batchRename = (data: any) => {
  return request.post('/rename/batch-rename', data)
}
