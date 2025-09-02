// 媒体库概览类型
export interface MediaCountInfoType {
  MovieCount: number
  SeriesCount: number
  SongCount: number
  TotalCount: number
}

// Emby占用存储空间info的类型
export interface EmbyStorageInfoType {
  AudioSize: number
  DiskSize: number
  EpisodeSize: number
  MovieSize: number
  TotalSize: number
}

// Emby播放时长info类型
export interface EmbyPlayTimeInfoType {
  AudioTime: number
  EpisodeTime: number
  MovieTime: number
  TotalTime: number
}

// 最近添加的类型
export interface EmbyLatestAddItemType {
  Artists: string[] // 在音乐的类型的媒体里会有值（比如歌手名）
  DateCreated: string // 添加到 Emby 服务器的时间
  Id: string // 媒体项唯一ID
  Type: string // 媒体类型 Episode:剧集  Movie:电影  Audio:音乐
  Name: string // 媒体名称
  Primary: string // 封面
  SeriesName: string // 电视剧时，这里会存放 所属剧集名称
}
