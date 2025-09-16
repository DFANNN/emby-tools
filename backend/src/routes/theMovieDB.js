import express from 'express'
import {
  trending,
  movieTvImages,
  movieNowPlaying,
  movieTopRated,
  tvTopRated,
  moviePopular,
  tvPopular,
  discoverMovie,
  discoverTv
} from '../services/theMovieDBService.js'

const router = express.Router()

// 识别 Axios 超时错误
const isTimeoutError = error => {
  if (!error) return false
  if (error.code === 'ECONNABORTED') return true
  const msg = String(error.message || '')
  return msg.includes('timeout') || msg.includes('ETIMEDOUT')
}

// 获取TMDB当前电影/电视剧的图片（主要用于logo）
const getMovieTvImages = async (type, id) => {
  try {
    const { data: res } = await movieTvImages(type, id)
    return (
      res.logos.filter(item => item.iso_639_1 === 'zh')[0]?.file_path ||
      res.logos.filter(item => item.iso_639_1 === 'en')[0]?.file_path ||
      res.logos[0]?.file_path ||
      ''
    )
  } catch (error) {
    return ''
  }
}

// 今日趋势
router.get('/todayTrending', async (req, res) => {
  console.log('[TMDB TRENDING] 开始获取今日趋势')
  try {
    const baseUrl = 'https://image.tmdb.org/t/p/original'
    const { data: response } = await trending('day')
    const { results } = response
    const trendList = await Promise.all(
      results.slice(0, 10).map(async item => {
        const logoPath = await getMovieTvImages(item.media_type, item.id)
        return {
          ...item,
          backdrop_path: `${baseUrl}${item.backdrop_path}`,
          poster_path: `${baseUrl}${item.poster_path}`,
          logo_path: logoPath ? `${baseUrl}${logoPath}` : ''
        }
      })
    )
    console.log(`[TMDB TRENDING] 获取今日趋势成功 - 共 ${trendList.length} 项`)
    return res.success(trendList)
  } catch (error) {
    console.error('[TMDB TRENDING] 获取今日趋势失败:', error.message)
    if (isTimeoutError(error)) {
      return res.error('请求超时无法访问 TMDB，请自行配置代理或 DNS/hosts 后重试。')
    }
    return res.error(error)
  }
})

// 本周趋势
router.get('/weekTrending', async (req, res) => {
  console.log('[TMDB TRENDING] 开始获取本周趋势')
  try {
    const baseUrl = 'https://image.tmdb.org/t/p/original'
    const { data: response } = await trending('week')
    const { results } = response
    const trendList = results.map(item => {
      return {
        ...item,
        backdrop_path: `${baseUrl}${item.backdrop_path}`,
        poster_path: `${baseUrl}${item.poster_path}`
      }
    })
    console.log(`[TMDB TRENDING] 获取本周趋势成功 - 共 ${trendList.length} 项`)
    return res.success(trendList)
  } catch (error) {
    console.error('[TMDB TRENDING] 获取本周趋势失败:', error.message)
    if (isTimeoutError(error)) {
      return res.error('请求超时无法访问 TMDB，请自行配置代理或 DNS/hosts 后重试。')
    }
    return res.error(error)
  }
})

// 正在上映
router.get('/movieNowPlaying', async (req, res) => {
  console.log('[TMDB MOVIE] 开始获取正在上映的电影')
  try {
    const baseUrl = 'https://image.tmdb.org/t/p/original'
    const { data: response } = await movieNowPlaying()
    const { results } = response
    const nowPlayingList = results.map(item => {
      return {
        ...item,
        backdrop_path: `${baseUrl}${item.backdrop_path}`,
        poster_path: `${baseUrl}${item.poster_path}`
      }
    })
    console.log(`[TMDB MOVIE] 获取正在上映电影成功 - 共 ${nowPlayingList.length} 项`)
    return res.success(nowPlayingList)
  } catch (error) {
    console.error('[TMDB MOVIE] 获取正在上映电影失败:', error.message)
    if (isTimeoutError(error)) {
      return res.error('请求超时无法访问 TMDB，请自行配置代理或 DNS/hosts 后重试。')
    }
    return res.error(error)
  }
})

// 热门电影
router.get('/moviePopular', async (req, res) => {
  const { page } = req.query
  console.log(`[TMDB MOVIE] 开始获取热门电影 - 页码: ${page || 1}`)
  try {
    const baseUrl = 'https://image.tmdb.org/t/p/original'
    const { data: response } = await moviePopular(page)
    const { results } = response
    const list = results.map(item => ({
      ...item,
      backdrop_path: `${baseUrl}${item.backdrop_path}`,
      poster_path: `${baseUrl}${item.poster_path}`
    }))
    console.log(`[TMDB MOVIE] 获取热门电影成功 - 共 ${list.length} 项`)
    return res.success(list)
  } catch (error) {
    console.error('[TMDB MOVIE] 获取热门电影失败:', error.message)
    if (isTimeoutError(error)) {
      return res.error('请求超时无法访问 TMDB，请自行配置代理或 DNS/hosts 后重试。')
    }
    return res.error(error)
  }
})

// 热门剧集
router.get('/tvPopular', async (req, res) => {
  const { page } = req.query
  console.log(`[TMDB TV] 开始获取热门剧集 - 页码: ${page || 1}`)
  try {
    const baseUrl = 'https://image.tmdb.org/t/p/original'
    const { data: response } = await tvPopular(page)
    const { results } = response
    const list = results.map(item => ({
      ...item,
      backdrop_path: `${baseUrl}${item.backdrop_path}`,
      poster_path: `${baseUrl}${item.poster_path}`
    }))
    console.log(`[TMDB TV] 获取热门剧集成功 - 共 ${list.length} 项`)
    return res.success(list)
  } catch (error) {
    console.error('[TMDB TV] 获取热门剧集失败:', error.message)
    if (isTimeoutError(error)) {
      return res.error('请求超时无法访问 TMDB，请自行配置代理或 DNS/hosts 后重试。')
    }
    return res.error(error)
  }
})

// 高分电影（Top Rated）
router.get('/movieTopRated', async (req, res) => {
  const { page } = req.query
  console.log(`[TMDB MOVIE] 开始获取高分电影 - 页码: ${page || 1}`)
  try {
    const baseUrl = 'https://image.tmdb.org/t/p/original'
    const { data: response } = await movieTopRated(page)
    const { results } = response
    const list = results.map(item => ({
      ...item,
      backdrop_path: `${baseUrl}${item.backdrop_path}`,
      poster_path: `${baseUrl}${item.poster_path}`
    }))
    console.log(`[TMDB MOVIE] 获取高分电影成功 - 共 ${list.length} 项`)
    return res.success(list)
  } catch (error) {
    console.error('[TMDB MOVIE] 获取高分电影失败:', error.message)
    if (isTimeoutError(error)) {
      return res.error('请求超时无法访问 TMDB，请自行配置代理或 DNS/hosts 后重试。')
    }
    return res.error(error)
  }
})

// 高分剧集（Top Rated TV）
router.get('/tvTopRated', async (req, res) => {
  const { page } = req.query
  console.log(`[TMDB TV] 开始获取高分剧集 - 页码: ${page || 1}`)
  try {
    const baseUrl = 'https://image.tmdb.org/t/p/original'
    const { data: response } = await tvTopRated(page)
    const { results } = response
    const list = results.map(item => ({
      ...item,
      backdrop_path: `${baseUrl}${item.backdrop_path}`,
      poster_path: `${baseUrl}${item.poster_path}`
    }))
    console.log(`[TMDB TV] 获取高分剧集成功 - 共 ${list.length} 项`)
    return res.success(list)
  } catch (error) {
    console.error('[TMDB TV] 获取高分剧集失败:', error.message)
    if (isTimeoutError(error)) {
      return res.error('请求超时无法访问 TMDB，请自行配置代理或 DNS/hosts 后重试。')
    }
    return res.error(error)
  }
})

export default router

// 题材发现（支持电影/剧集，with_genres 可传中文标签将在前端映射）
router.get('/discover', async (req, res) => {
  const { media_type = 'movie', page: pageParam, with_genres = '', sort_by = 'popularity.desc', randomNum } = req.query
  console.log(
    `[TMDB DISCOVER] 开始题材发现 - 类型: ${media_type}, 页码: ${pageParam || 'random'}, 类型: ${with_genres}, 数量: ${
      randomNum || 9
    }`
  )
  try {
    const baseUrl = 'https://image.tmdb.org/t/p/original'
    const svc = media_type === 'tv' ? discoverTv : discoverMovie

    // 如果 page 未指定或为 'random'，先请求第一页获取总页数再随机选一页
    let targetPage = Number(pageParam) || 1
    if (!pageParam || pageParam === 'random') {
      const { data: firstResp } = await svc({ page: 1, with_genres, sort_by })
      const maxPages = Math.min(firstResp.total_pages || 1, 500)
      targetPage = Math.floor(Math.random() * maxPages) + 1
    }

    const { data: response } = await svc({ page: targetPage, with_genres, sort_by })
    const { results = [] } = response || {}

    // 提取图片 URL，优先海报，其次背景，并过滤空
    const urls = results
      .map(item => item.poster_path || item.backdrop_path)
      .filter(Boolean)
      .map(p => `${baseUrl}${p}`)

    // 打乱顺序
    for (let i = urls.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[urls[i], urls[j]] = [urls[j], urls[i]]
    }

    const num = Math.max(1, Math.min(Number(randomNum) || 9, urls.length || 9))
    const picked = urls.slice(0, num)
    console.log(`[TMDB DISCOVER] 题材发现成功 - 返回 ${picked.length} 张图片`)
    return res.success(picked)
  } catch (error) {
    console.error('[TMDB DISCOVER] 题材发现失败:', error.message)
    if (isTimeoutError(error)) {
      return res.error('请求超时无法访问 TMDB，请自行配置代理或 DNS/hosts 后重试。')
    }
    return res.error(error)
  }
})
