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
