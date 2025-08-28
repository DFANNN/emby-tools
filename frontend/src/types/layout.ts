// 连接emby设置的类型
export interface LinkEmbyConfigFormType {
  protocol: 'http' | 'https'
  ip: string
  port: string
  Username: string
  Pw: string
}

// emby用户的基本信息
export interface IEmbyUserInfoType {
  DateCreated: string
  Id: string
  LastActivityDate: string
  LastLoginDate: string
  Name: string
  ServerId: string
  EmbyAddress: string
}
