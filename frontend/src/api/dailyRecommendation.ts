// 每日推荐
import { request } from '@/utils/request'

// 今日趋势
export const todayTrend = () => {
  return request.get('/theMovieDB/todayTrending')
}

// 本周趋势
export const weekTrend = () => {
  return request.get('/theMovieDB/weekTrending')
}

// 影院上映中
export const nowPlaying = () => {
  return request.get('/theMovieDB/movieNowPlaying')
}
