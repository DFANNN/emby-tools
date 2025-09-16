import { request } from '@/utils/request'

// 读取/设置 TMDB 代理
export function getTmdbProxy() {
  return request.get('/theMovieDB/proxy')
}

export function setTmdbProxy(proxy: string) {
  return request.post('/theMovieDB/proxy', { proxy })
}

export function tmdbDiscover(params: {
  media_type?: 'movie' | 'tv'
  page?: number | 'random'
  with_genres?: string
  sort_by?: string
  randomNum?: number
}) {
  return request({
    url: '/theMovieDB/discover',
    method: 'get',
    params
  })
}
