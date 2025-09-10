import express from 'express'
import {
  trending,
  movieTvImages,
  movieNowPlaying,
  movieTopRated,
  tvTopRated,
  moviePopular,
  tvPopular
} from '../services/theMovieDBService.js'

const router = express.Router()

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
    console.error(error)
    return ''
  }
}

// 今日趋势
router.get('/todayTrending', async (req, res) => {
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
    return res.success(trendList)
  } catch (error) {
    return res.error(error)
  }
})

// 本周趋势
router.get('/weekTrending', async (req, res) => {
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
    return res.success(trendList)
  } catch (error) {
    return res.error(error)
  }
})

// 正在上映
router.get('/movieNowPlaying', async (req, res) => {
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
    return res.success(nowPlayingList)
  } catch (error) {
    return res.error(error)
  }
})

// 热门电影
router.get('/moviePopular', async (req, res) => {
  try {
    const { page } = req.query
    const baseUrl = 'https://image.tmdb.org/t/p/original'
    const { data: response } = await moviePopular(page)
    const { results } = response
    const list = results.map(item => ({
      ...item,
      backdrop_path: `${baseUrl}${item.backdrop_path}`,
      poster_path: `${baseUrl}${item.poster_path}`
    }))
    return res.success(list)
  } catch (error) {
    return res.error(error)
  }
})

// 热门剧集
router.get('/tvPopular', async (req, res) => {
  try {
    const { page } = req.query
    const baseUrl = 'https://image.tmdb.org/t/p/original'
    const { data: response } = await tvPopular(page)
    const { results } = response
    const list = results.map(item => ({
      ...item,
      backdrop_path: `${baseUrl}${item.backdrop_path}`,
      poster_path: `${baseUrl}${item.poster_path}`
    }))
    return res.success(list)
  } catch (error) {
    return res.error(error)
  }
})

// 高分电影（Top Rated）
router.get('/movieTopRated', async (req, res) => {
  try {
    const { page } = req.query
    const baseUrl = 'https://image.tmdb.org/t/p/original'
    const { data: response } = await movieTopRated(page)
    const { results } = response
    const list = results.map(item => ({
      ...item,
      backdrop_path: `${baseUrl}${item.backdrop_path}`,
      poster_path: `${baseUrl}${item.poster_path}`
    }))
    return res.success(list)
  } catch (error) {
    return res.error(error)
  }
})

// 高分剧集（Top Rated TV）
router.get('/tvTopRated', async (req, res) => {
  try {
    const { page } = req.query
    const baseUrl = 'https://image.tmdb.org/t/p/original'
    const { data: response } = await tvTopRated(page)
    const { results } = response
    const list = results.map(item => ({
      ...item,
      backdrop_path: `${baseUrl}${item.backdrop_path}`,
      poster_path: `${baseUrl}${item.poster_path}`
    }))
    return res.success(list)
  } catch (error) {
    return res.error(error)
  }
})

export default router
