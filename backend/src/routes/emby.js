import express from 'express'
import si from 'systeminformation'
import embyStore from '../store/embyStore.js'
import {
  embyUserInfo,
  embyMediaCount,
  embyLatestAdd,
  embyStorage,
  embyPlayTime,
  embyMediaLibraryList,
  embyMediaLibraryItems,
  embyReplacePoster
} from '../services/embyService.js'

const router = express.Router()

// 统一时间戳前缀
const _now = () => {
  const d = new Date()
  const pad = n => String(n).padStart(2, '0')
  return `[${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(
    d.getMinutes()
  )}:${pad(d.getSeconds())}]`
}

// 登录emby
router.post('/login', async (req, res) => {
  const { protocol, ip, port, Username, Pw } = req.body
  console.log(`${_now()} [EMBY LOGIN] 开始登录 - 服务器: ${protocol}://${ip}:${port}, 用户: ${Username}`)
  embyStore.url = `${protocol}://${ip}:${port}`

  try {
    const { data: response } = await embyUserInfo({ Username, Pw })

    const { User, AccessToken } = response
    const { Id, Name, ServerId, DateCreated, LastLoginDate, LastActivityDate } = User
    const params = { Id, Name, ServerId, DateCreated, LastLoginDate, LastActivityDate }

    // 存储到embyStore中
    embyStore.accessToken = AccessToken
    embyStore.user = params

    console.log(`${_now()} [EMBY LOGIN] 登录成功 - 用户ID: ${Id}, 用户名: ${Name}`)
    return res.success({ ...params, EmbyAddress: embyStore.url }, '登录成功')
  } catch (error) {
    console.error(`${_now()} [EMBY LOGIN] 登录失败 - 用户: ${Username}, 错误:`, error.message)
    // TODO: 优化具体错误信息
    return res.error('登录失败，请检查用户名和密码')
  }
})

// 媒体库概览（统计电影、剧集、音乐数量）
router.get('/mediaCount', async (req, res) => {
  console.log(`${_now()} [EMBY MEDIA COUNT] 开始获取媒体库统计`)
  try {
    const { data: response } = await embyMediaCount()
    const { MovieCount, SeriesCount, SongCount } = response
    const TotalCount = MovieCount + SeriesCount + SongCount
    console.log(
      `${_now()} [EMBY MEDIA COUNT] 获取成功 - 电影: ${MovieCount}, 剧集: ${SeriesCount}, 音乐: ${SongCount}, 总计: ${TotalCount}`
    )
    return res.success({ MovieCount, SeriesCount, SongCount, TotalCount })
  } catch (error) {
    console.error(`${_now()} [EMBY MEDIA COUNT] 获取失败:`, error.message)
    return res.error(error)
  }
})

// 最近添加
router.get('/latestAdd', async (req, res) => {
  console.log(`${_now()} [EMBY LATEST ADD] 开始获取最近添加的媒体`)
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
    console.log(`${_now()} [EMBY LATEST ADD] 获取成功 - 共 ${latestAddList.length} 项`)
    return res.success(latestAddList)
  } catch (error) {
    console.error(`${_now()} [EMBY LATEST ADD] 获取失败:`, error.message)
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
  console.log(`${_now()} [EMBY STORAGE] 开始获取存储空间信息`)
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

    console.log(
      `${_now()} [EMBY STORAGE] 获取成功 - 电影: ${MovieSize}GB, 剧集: ${EpisodeSize}GB, 音乐: ${AudioSize}GB, 总计: ${TotalSize}GB, 磁盘: ${DiskSize}GB`
    )
    return res.success({
      MovieSize,
      EpisodeSize,
      AudioSize,
      TotalSize,
      DiskSize
    })
  } catch (error) {
    console.error(`${_now()} [EMBY STORAGE] 获取失败:`, error.message)
    return res.error(error)
  }
})

// emby获取播放时间
router.get('/playTime', async (req, res) => {
  console.log(`${_now()} [EMBY PLAY TIME] 开始获取播放时间统计`)
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

    const MovieTime = calculateTime(movieResponse)
    const EpisodeTime = calculateTime(episodeResponse)
    const AudioTime = calculateTime(audioResponse)
    const TotalTime = Number((MovieTime + EpisodeTime + AudioTime).toFixed(2))

    console.log(
      `${_now()} [EMBY PLAY TIME] 获取成功 - 电影: ${MovieTime}小时, 剧集: ${EpisodeTime}小时, 音乐: ${AudioTime}小时, 总计: ${TotalTime}小时`
    )
    return res.success({ MovieTime, EpisodeTime, AudioTime, TotalTime })
  } catch (error) {
    console.error(`${_now()} [EMBY PLAY TIME] 获取失败:`, error.message)
    return res.error(error)
  }
})

// emby获取媒体库列表
router.get('/mediaLibraryList', async (req, res) => {
  console.log(`${_now()} [EMBY MEDIA LIBRARY] 开始获取媒体库列表`)
  try {
    const { data: response } = await embyMediaLibraryList()
    const { Items } = response
    const mediaLibraryList = Items.map(item => {
      return {
        Id: item.Id,
        Name: item.Name,
        CollectionType: item.CollectionType,
        ImageUrl: `${embyStore.url}/Items/${item.Id}/Images/Primary`
      }
    }).filter(item => item.CollectionType === 'tvshows' || item.CollectionType === 'movies')
    console.log(`${_now()} [EMBY MEDIA LIBRARY] 获取成功 - 共 ${mediaLibraryList.length} 个媒体库`)
    return res.success(mediaLibraryList)
  } catch (error) {
    console.error(`${_now()} [EMBY MEDIA LIBRARY] 获取失败:`, error.message)
    return res.error(error)
  }
})

/**
 * 随机生成emby封面图数组
 */
router.get('/radomEmbyPosterList', async (req, res) => {
  const { mediaId, radomNum } = req.query
  console.log(`${_now()} [EMBY POSTER LIST] 开始获取随机封面图 - 媒体库ID: ${mediaId}, 数量: ${radomNum || 10}`)
  try {
    const { data: response } = await embyMediaLibraryItems(mediaId)
    const { Items } = response

    if (!Items || !Array.isArray(Items)) {
      console.error(`${_now()} [EMBY POSTER LIST] 媒体库数据为空`)
      return res.error('媒体库数据为空')
    }

    // 提取所有的封面图地址
    const posterUrls = Items.map(
      item =>
        `${embyStore.url}/Items/${item.Id}/Images/Primary?tag=${item.ImageTags.Primary}&maxWidth=500&maxHeight=750`
    )

    if (posterUrls.length === 0) {
      console.error(`${_now()} [EMBY POSTER LIST] 该媒体库下没有剧集封面图`)
      return res.error('该媒体库下没有剧集封面图')
    }

    // 随机生成指定数量的图片地址数组
    const targetNum = parseInt(radomNum) || 10
    const result = []

    if (posterUrls.length >= targetNum) {
      // 媒体库数量足够，随机选择不重复
      const shuffled = [...posterUrls].sort(() => Math.random() - 0.5)
      result.push(...shuffled.slice(0, targetNum))
    } else {
      // 媒体库数量不足，允许重复
      for (let i = 0; i < targetNum; i++) {
        const randomIndex = Math.floor(Math.random() * posterUrls.length)
        result.push(posterUrls[randomIndex])
      }
    }

    console.log(`${_now()} [EMBY POSTER LIST] 获取成功 - 返回 ${result.length} 张封面图`)
    res.success(result)
  } catch (error) {
    console.error(`${_now()} [EMBY POSTER LIST] 获取失败:`, error.message)
    res.error(error)
  }
})

// 替换媒体库封面
router.post('/embyReplacePoster', async (req, res) => {
  const { mediaId, posterBase64 } = req.body
  console.log(`${_now()} [EMBY REPLACE POSTER] 开始替换封面 - 媒体ID: ${mediaId}`)
  try {
    // 验证数据格式
    if (!mediaId || !posterBase64) {
      console.error(`${_now()} [EMBY REPLACE POSTER] 数据格式错误，缺少mediaId或posterBase64`)
      return res.error('媒体数据格式错误，缺少mediaId或posterBase64')
    }

    // 替换单个媒体封面
    const response = await embyReplacePoster(mediaId, posterBase64)

    console.log(`${_now()} [EMBY REPLACE POSTER] 替换成功 - 媒体ID: ${mediaId}`)
    return res.success(
      {
        mediaId: mediaId,
        success: true,
        response: response.data
      },
      '封面替换成功'
    )
  } catch (error) {
    console.error(`${_now()} [EMBY REPLACE POSTER] 替换失败 - 媒体ID: ${mediaId}, 错误:`, error.message)
    return res.error('替换封面失败')
  }
})

export default router
