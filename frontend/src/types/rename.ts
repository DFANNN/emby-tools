// 磁盘or文件夹列表
export interface IDiskFolderItem {
  id: number // 这个id 主要用于排序
  name: string // 展示名字
  newName?: string // 新的名字（重命名时使用）
  type: string // 文件夹、文件
  fullPath: string // 完整的路径地址
  fileType: string // 文件的类型
}

// 解析结果
export interface IParseResult {
  season?: number
  episode?: number
  title?: string
  quality?: string
  confidence: number // 置信度 0-1
}

// 重命名规则表单
export interface IRenameRuleForm {
  model: 'tv' | 'replace' | 'insert' // 重命名模式
  newFileName: string // 新文件名（剧集名称）
  seasonNumber: number // 季号
  episodeNumber: number // 起始集号
  targetName: string // 查找文本
  replaceName: string // 替换文本
  insertPosition: 'start' | 'end' // 插入位置
  insertText: string // 插入文本
  template?: string // 命名模板
}

// 重命名文件项
export interface IRenameFileItem extends IDiskFolderItem {
  parseResult?: IParseResult // 解析结果
  isSelected?: boolean // 是否选中
  status?: 'success' | 'warning' | 'error' // 状态
  statusText?: string // 状态说明
}
