import { request } from '@/utils/request'

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
