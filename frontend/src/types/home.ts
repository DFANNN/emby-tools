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

// 今日趋势的类型定义
export interface ITrendItem {
  /** 是否为成人内容 */
  adult: boolean

  /** 背景图片路径 (用于轮播图背景) */
  backdrop_path: string

  /** 首次播出日期 (电视剧) */
  first_air_date: string

  /** 上映日期(电影) */
  release_date: string

  /** 类型ID数组 (用于显示电影/电视剧类型) */
  genre_ids: number[]

  /** 唯一标识ID */
  id: number

  /** 媒体类型 ('movie' | 'tv' | 'person') */
  media_type: string

  /** 显示名称 (可能是电影名或电视剧名) */
  name: string

  /** 标题(电影名) */
  title: string

  /** 原产国家/地区数组 */
  origin_country: string[]

  /** 原始语言代码 (如 'en', 'zh') */
  original_language: string

  /** 原始名称 (未翻译的名称) */
  original_name: string

  /** 剧情简介/概述 */
  overview: string

  /** 热度/流行度评分 */
  popularity: number

  /** 海报图片路径 (用于缩略图显示) */
  poster_path: string

  /** 平均评分 (0-10分) */
  vote_average: number

  /** 评分人数/投票总数 */
  vote_count: number

  /** logo图片路径 */
  logo_path: string
}
