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

// 热门电影
export const moviePopular = (page: number) => {
  return request.get(`/theMovieDB/moviePopular?page=${page}`)
}

// 热门电影
export const tvPopular = (page: number) => {
  return request.get(`/theMovieDB/tvPopular?page=${page}`)
}

// 高分电影（Top Rated）
export const topRatedMovies = (page: number) => {
  return request.get(`/theMovieDB/movieTopRated?page=${page}`)
}

// 高分剧集（Top Rated TV）
export const topRatedTV = (page: number) => {
  return request.get(`/theMovieDB/tvTopRated?page=${page}`)
}
