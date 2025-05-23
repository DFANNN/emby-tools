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
