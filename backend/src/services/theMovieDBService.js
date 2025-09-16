import axios from 'axios'
import tmdbStore from '../store/tmdbStore.js'
import { HttpsProxyAgent } from 'https-proxy-agent'
import { SocksProxyAgent } from 'socks-proxy-agent'

// 基于 tmdbStore.proxy 动态创建 axios 实例并做缓存
let cachedClient = null
let cachedProxyKey = null

function createAgentByProxyUrl(proxyUrl) {
  try {
    if (!proxyUrl) return null
    const lower = String(proxyUrl).trim().toLowerCase()
    if (lower.startsWith('http://') || lower.startsWith('https://')) {
      return new HttpsProxyAgent(proxyUrl)
    }
    if (lower.startsWith('socks://') || lower.startsWith('socks5://') || lower.startsWith('socks4://')) {
      return new SocksProxyAgent(proxyUrl)
    }
    return null
  } catch (e) {
    return null
  }
}

function getClient() {
  const proxyKey = tmdbStore.proxy || ''
  if (cachedClient && cachedProxyKey === proxyKey) return cachedClient

  const agent = createAgentByProxyUrl(proxyKey)
  cachedClient = axios.create({
    baseURL: 'https://api.themoviedb.org',
    timeout: 15000,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0YWNkMDQ1NGM5ODMxOTA1ZDFiMDk1ZDNlZDg3NWQ0NCIsIm5iZiI6MTczOTQ0MDM0NS42NDQsInN1YiI6IjY3YWRjMGQ5NTMzNTNmOWJiYTM2ZWVmMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.AqO9jtKsKdb0w3sSmkBlkyztT1U4l1VmmntRXfpbGfI`
    },
    httpAgent: agent || undefined,
    httpsAgent: agent || undefined
  })
  cachedProxyKey = proxyKey
  return cachedClient
}

/**
 * 获取TMDB所有趋势的接口
 * @param {获取TMDB所有趋势的接口} time 'day' | 'week'
 * @returns
 */
export function trending(time) {
  return getClient().get(`/3/trending/all/${time}?language=zh-CN`)
}

/**
 * 获取TMDB当前电影/电视剧的图片（主要用于logo）
 * @param {*} type 电影/电视剧类型
 * @param {*} id 电影/电视剧的id
 * @returns
 */
export function movieTvImages(type, id) {
  return getClient().get(`/3/${type}/${id}/images`)
}

// 获取TMDB正在上映的电影
export function movieNowPlaying() {
  return getClient().get('/3/movie/now_playing?language=zh-CN')
}

// 获取TMDB热门电影
export function moviePopular(page) {
  return getClient().get(`/3/movie/popular?language=zh-CN&page=${page}`)
}

// 获取TMDB热门剧集
export function tvPopular(page) {
  return getClient().get(`/3/tv/popular?language=zh-CN&page=${page}`)
}

// 获取TMDB高分电影（Top Rated）
export function movieTopRated(page) {
  return getClient().get(`/3/movie/top_rated?language=zh-CN&page=${page}`)
}

// 获取TMDB高分剧集（Top Rated TV）
export function tvTopRated(page) {
  return getClient().get(`/3/tv/top_rated?language=zh-CN&page=${page}`)
}

// Discover 发现接口：按题材等筛选
export function discoverMovie(params = {}) {
  const { page = 1, with_genres = '', sort_by = 'popularity.desc', language = 'zh-CN' } = params
  return getClient().get(
    `/3/discover/movie?language=${language}&page=${page}&sort_by=${sort_by}&with_genres=${with_genres}`
  )
}

export function discoverTv(params = {}) {
  const { page = 1, with_genres = '', sort_by = 'popularity.desc', language = 'zh-CN' } = params
  return getClient().get(
    `/3/discover/tv?language=${language}&page=${page}&sort_by=${sort_by}&with_genres=${with_genres}`
  )
}
