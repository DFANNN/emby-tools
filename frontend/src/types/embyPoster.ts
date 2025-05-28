// 规则表单
export interface RuleForm {
  id?: string
  name: string
  description: string
  layout: string
  source: string
}

// 连接emby的表单
export interface IConnectionForm {
  protocol: string // 协议
  ip: string // 服务器地址
  port: string // 端口
  apiKey: string // API Token
}

// emby 媒体库列表类型
export interface IEmbyMediaLibraryItem {
  Id: string // 媒体库id
  Name: string // 媒体库名称
  CollectionType: string // 媒体库类型
  ImageUrl: string // 封面图片地址
  imageUrls?: string[] // 图片地址列表(用于预览)
  backgroundGradient?: string // 背景渐变色(用于预览)
}
