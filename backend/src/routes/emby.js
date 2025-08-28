import express from 'express'
import si from 'systeminformation'
import embyStore from '../store/embyStore.js'
import { embyUserInfo, embyMediaCount, embyLatestAdd, embyStorage, embyPlayTime } from '../services/embyService.js'

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

    return res.success({ ...params, EmbyAddress: embyStore.url }, '登录成功')
  } catch (error) {
    // TODO: 优化具体错误信息
    console.error('登录失败:', error.response?.data || error.message)
    return res.error('登录失败，请检查用户名和密码')
  }
})

// 媒体库概览（统计电影、剧集、音乐数量）
router.get('/mediaCount', async (req, res) => {
  try {
    const { data: response } = await embyMediaCount()
    const { MovieCount, SeriesCount, SongCount } = response
    const TotalCount = MovieCount + SeriesCount + SongCount
    return res.success({ MovieCount, SeriesCount, SongCount, TotalCount })
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
        Type: item.Type,
        Primary: item.ImageTags?.Primary
          ? `${embyStore.url}/Items/${item.Id}/Images/Primary?tag=${item.ImageTags.Primary}&quality=90`
          : `${embyStore.url}/Items/${item.ParentBackdropItemId}/Images/Primary?tag=${item.SeriesPrimaryImageTag}&quality=90`,
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

// 获取磁盘信息
const getDiskInfo = async () => {
  const disks = await si.diskLayout()
  let totalSizeBytes = 0

  disks.forEach((disk, i) => {
    totalSizeBytes += disk.size || 0 // 累加磁盘大小
  })

  return Number((totalSizeBytes / 1_000_000_000).toFixed(2))
}

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
    // 总计大小
    const TotalSize = MovieSize + EpisodeSize + AudioSize
    // 磁盘大小
    const DiskSize = await getDiskInfo()

    return res.success({
      MovieSize,
      EpisodeSize,
      AudioSize,
      TotalSize,
      DiskSize
    })
  } catch (error) {
    return res.error(error)
  }
})

// emby获取播放时间
router.get('/playTime', async (req, res) => {
  try {
    const [movieResponse, episodeResponse, audioResponse] = await Promise.all([
      embyPlayTime('Movie'),
      embyPlayTime('Episode'),
      embyPlayTime('Audio')
    ])

    // 计算时长函数
    const calculateTime = response => {
      const { Items } = response.data

      const totalTicks = Items.reduce((total, { RunTimeTicks = 0, UserData = {} }) => {
        const { PlayCount = 0, PlaybackPositionTicks = 0, Played = false } = UserData

        if (PlaybackPositionTicks > 0) {
          return total + PlaybackPositionTicks
        }
        if (PlaybackPositionTicks === 0 && Played === true) {
          return total + (RunTimeTicks ? RunTimeTicks : 0)
        }
        return total

        // return total + RunTimeTicks * PlayCount + PlaybackPositionTicks
      }, 0)

      // 换算成小时
      const totalHours = totalTicks / 10_000_000 / 3600

      return Number(totalHours.toFixed(2)) // 保留两位小数
    }

    console.log('movieResponse', calculateTime(movieResponse))

    const MovieTime = calculateTime(movieResponse)
    const EpisodeTime = calculateTime(episodeResponse)
    const AudioTime = calculateTime(audioResponse)
    const TotalTime = Number((MovieTime + EpisodeTime + AudioTime).toFixed(2))

    return res.success({ MovieTime, EpisodeTime, AudioTime, TotalTime })
  } catch (error) {
    console.log(error)
    return res.error(error)
  }
})

export default router
