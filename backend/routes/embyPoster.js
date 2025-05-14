import express from 'express'
import axios from 'axios'
import { generatePoster } from '../controllers/embyPosterController.js'

const router = express.Router()

// 链接emby媒体库，并且返回媒体库列表
router.post('/linkEmby', async (req, res) => {
  const { ip, port, token } = req.body
  // 校验请求体
  if (!ip || !port || !token) {
    return res.error('缺少ip、port、token参数')
  }

  // 访问emby媒体库接口地址
  const embyUrl = `http://${ip}:${port}/Library/MediaFolders`
  // 获取媒体库信息
  try {
    const { data: response } = await axios.get(embyUrl, {
      headers: {
        'X-Emby-Token': token
      }
    })

    const mediaLibraryList = response.Items.map(item => {
      return {
        Id: item.Id, // 媒体库id
        Name: item.Name, // 媒体库名称
        CollectionType: item.CollectionType, // 媒体库类型
        ImageTags: {
          Primary: `http://${ip}:${port}/Items/${item.Id}/Images/Primary` //封面图片地址
        }
      }
    })

    res.success(mediaLibraryList, '连接成功')
  } catch (error) {
    res.error('访问emby媒体库接口失败,请检查ip、端口、token是否正确')
  }
})

// 生成海报
router.post('/generatePoster', generatePoster)

export default router
