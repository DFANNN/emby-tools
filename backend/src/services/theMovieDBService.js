import axios from 'axios'

const service = axios.create({
  baseURL: 'https://api.themoviedb.org',
  timeout: 10000,
  headers: {
    accept: 'application/json',
    Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0YWNkMDQ1NGM5ODMxOTA1ZDFiMDk1ZDNlZDg3NWQ0NCIsIm5iZiI6MTczOTQ0MDM0NS42NDQsInN1YiI6IjY3YWRjMGQ5NTMzNTNmOWJiYTM2ZWVmMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.AqO9jtKsKdb0w3sSmkBlkyztT1U4l1VmmntRXfpbGfI`
  }
})

/**
 * 获取TMDB所有趋势的接口
 * @param {获取TMDB所有趋势的接口} time 'day' | 'week'
 * @returns
 */
export function trending(time) {
  return service.get(`/3/trending/all/${time}?language=zh-CN`)
}

/**
 * 获取TMDB当前电影/电视剧的图片（主要用于logo）
 * @param {*} type 电影/电视剧类型
 * @param {*} id 电影/电视剧的id
 * @returns
 */
export function movieTvImages(type, id) {
  return service.get(`/3/${type}/${id}/images`)
}

// 获取TMDB正在上映的电影
export function movieNowPlaying() {
  return service.get('/3/movie/now_playing?language=zh-CN')
}
