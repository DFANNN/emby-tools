// 每日推荐
import { request } from '@/utils/request'

// 今日趋势
export const todayTrend = () => {
  return request.get('/theMovieDB/todayTrending')
}
