// 磁盘or文件夹列表
export interface IDiskFolderItem {
  name: string // 展示名字
  type: string // 文件夹、文件
  fullPath: string // 完整的路径地址
  fileType: string // 文件的类型
}
