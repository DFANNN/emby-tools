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
      return {
        totalSizeInBytes,
        totalSizeInGB: parseFloat(totalSizeInGB),
        itemCount: Items.length
      }
    }

    const movieSize = calculateSize(movieResponse)
    const episodeSize = calculateSize(episodeResponse)
    const audioSize = calculateSize(audioResponse)

    // 计算总大小
    const totalSizeInBytes = movieSize.totalSizeInBytes + episodeSize.totalSizeInBytes + audioSize.totalSizeInBytes
    const totalSizeInGB = (totalSizeInBytes / (1024 * 1024 * 1024)).toFixed(2)

    // 获取磁盘信息
    const getDiskInfo = () => {
      try {
        // 获取当前工作目录的磁盘信息
        const stats = fs.statSync('.')
        const path = require('path')
        const diskPath = path.resolve('.')

        // 在Windows上，我们需要使用不同的方法
        if (process.platform === 'win32') {
          try {
            // 获取磁盘使用情况
            const output = execSync('wmic logicaldisk get size,freespace,caption', { encoding: 'utf8' })
            const lines = output.trim().split('\n').slice(1) // 跳过标题行

            const diskInfo = lines
              .map(line => {
                const parts = line.trim().split(/\s+/)
                if (parts.length >= 3) {
                  const caption = parts[0]
                  const freeSpace = parseInt(parts[1]) || 0
                  const totalSize = parseInt(parts[2]) || 0
                  const usedSpace = totalSize - freeSpace

                  return {
                    drive: caption,
                    totalSizeInBytes: totalSize,
                    totalSizeInGB: (totalSize / (1024 * 1024 * 1024)).toFixed(2),
                    freeSpaceInBytes: freeSpace,
                    freeSpaceInGB: (freeSpace / (1024 * 1024 * 1024)).toFixed(2),
                    usedSpaceInBytes: usedSpace,
                    usedSpaceInGB: (usedSpace / (1024 * 1024 * 1024)).toFixed(2),
                    usagePercentage: totalSize > 0 ? ((usedSpace / totalSize) * 100).toFixed(1) : 0
                  }
                }
                return null
              })
              .filter(Boolean)

            return diskInfo
          } catch (error) {
            console.error('获取磁盘信息失败:', error)
            return []
          }
        } else {
          // Linux/Mac 系统
          try {
            const output = execSync('df -h', { encoding: 'utf8' })
            const lines = output.trim().split('\n').slice(1)

            const diskInfo = lines
              .map(line => {
                const parts = line.trim().split(/\s+/)
                if (parts.length >= 6) {
                  const filesystem = parts[0]
                  const totalSize = parts[1]
                  const usedSize = parts[2]
                  const availableSize = parts[3]
                  const usagePercentage = parts[4]
                  const mountedOn = parts[5]

                  return {
                    filesystem,
                    totalSize,
                    usedSize,
                    availableSize,
                    usagePercentage,
                    mountedOn
                  }
                }
                return null
              })
              .filter(Boolean)

            return diskInfo
          } catch (error) {
            console.error('获取磁盘信息失败:', error)
            return []
          }
        }
      } catch (error) {
        console.error('获取磁盘信息失败:', error)
        return []
      }
    }

    const diskInfo = getDiskInfo()

    console.log('电影大小:', movieSize.totalSizeInGB, 'GB')
    console.log('剧集大小:', episodeSize.totalSizeInGB, 'GB')
    console.log('音乐大小:', audioSize.totalSizeInGB, 'GB')
    console.log('总大小:', totalSizeInGB, 'GB')
    console.log('磁盘信息:', diskInfo)

    return res.success({
      movie: movieSize,
      episode: episodeSize,
      audio: audioSize,
      total: {
        totalSizeInBytes,
        totalSizeInGB: parseFloat(totalSizeInGB),
        itemCount: movieSize.itemCount + episodeSize.itemCount + audioSize.itemCount
      },
      diskInfo
    })
  } catch (error) {
    return res.error(error)
  }
})

export default router
