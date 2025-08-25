import express from 'express'
import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import embyStore from '../store/embyStore.js'
import { embyUserInfo, embyMediaCount, embyLatestAdd, embyStorage } from '../services/embyService.js'

const router = express.Router()

// 登录emby
router.post('/login', async (req, res) => {
  const { protocol, ip, port, Username, Pw } = req.body
  embyStore.url = `${protocol}://${ip}:${port}`

  try {
    const { data: response } = await embyUserInfo({ Username, Pw })

    const { User, AccessToken } = response
    const { Id, Name, ServerId, DateCreated, LastLoginDate, LastActivityDate } = User
    const params = { Id, Name, ServerId, DateCreated, LastLoginDate, LastActivityDate }

    // 存储到embyStore中
    embyStore.accessToken = AccessToken
    embyStore.user = params

    return res.success(params, '登录成功')
  } catch (error) {
    // TODO: 优化具体错误信息
    console.error('登录失败:', error.response?.data || error.message)
    return res.error('登录失败，请检查用户名和密码', 401)
  }
})

// 媒体库概览（统计电影、剧集、音乐数量）
router.get('/mediaCount', async (req, res) => {
  try {
    const { data: response } = await embyMediaCount()
    const { MovieCount, SeriesCount, SongCount } = response
    return res.success({ MovieCount, SeriesCount, SongCount })
  } catch (error) {
    return res.error(error)
  }
})

// 最近添加
router.get('/latestAdd', async (req, res) => {
  try {
    const { data: response } = await embyLatestAdd()
    const { Items } = response
    const latestAddList = Items.map(item => {
      const date = new Date(item.DateCreated)
      const formatDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
        date.getDate()
      ).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(
        2,
        '0'
      )}:${String(date.getSeconds()).padStart(2, '0')}`
      return {
        Name: item.Name,
        Id: item.Id,
        DateCreated: formatDate,
        MediaType: item.MediaType,
        Primary: item.ImageTags?.Primary
          ? `${embyStore.url}/Items/${item.Id}/Images/Primary?tag=${item.ImageTags.Primary}&quality=90`
          : '',
        Artists: item.Artists ? item.Artists : [],
        SeriesName: item.SeriesName ? item.SeriesName : ''
      }
    })
    console.log(latestAddList)
    return res.success(latestAddList)
  } catch (error) {
    return res.error(error)
  }
})

// emby获取存储占用空间
router.get('/storage', async (req, res) => {
  try {
    // 同时发送三个请求
    const [movieResponse, episodeResponse, audioResponse] = await Promise.all([
      embyStorage('Movie'),
      embyStorage('Episode'),
      embyStorage('Audio')
    ])

    // 计算各类型媒体的大小
    const calculateSize = response => {
      const { Items } = response.data
      const totalSizeInBytes = Items.reduce((total, item) => {
        return total + (item.Size || 0)
      }, 0)
      const totalSizeInGB = (totalSizeInBytes / (1024 * 1024 * 1024)).toFixed(2)
      return parseFloat(totalSizeInGB)
    }

    // 电影大小
    const MovieSize = calculateSize(movieResponse)
    // 剧集大小
    const EpisodeSize = calculateSize(episodeResponse)
    // 音乐大小
    const AudioSize = calculateSize(audioResponse)

    // 获取磁盘信息

    return res.success({
      MovieSize,
      EpisodeSize,
      AudioSize
    })
  } catch (error) {
    console.log('error', error)
    return res.error(error)
  }
})

export default router
