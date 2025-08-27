// 连接emby设置的类型
export interface LinkEmbyConfigFormType {
  protocol: 'http' | 'https'
  ip: string
  port: string
  Username: string
  Pw: string
}
