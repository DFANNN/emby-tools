import express from 'express'
import axios from 'axios'

const router = express.Router()

// 簡單圖片代理：避免前端 canvas 污染與跨域
router.get('/image', async (req, res) => {
  const { url } = req.query
  console.log(`[PROXY IMAGE] 开始代理图片 - URL: ${url}`)
  try {
    if (!url || typeof url !== 'string') {
      console.error('[PROXY IMAGE] 缺少URL参数')
      return res.status(400).send('missing url')
    }

    // 僅允許代理 TMDB 靜態圖片域名
    const allowedHosts = ['image.tmdb.org']
    const parsed = new URL(url)
    if (!allowedHosts.includes(parsed.host)) {
      console.error(`[PROXY IMAGE] 不允许的域名: ${parsed.host}`)
      return res.status(400).send('host not allowed')
    }

    const upstream = await axios.get(url, {
      responseType: 'arraybuffer',
      headers: {
        // 盡量模擬瀏覽器，避免 403
        'User-Agent': 'Mozilla/5.0',
        Accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
        Referer: 'https://www.themoviedb.org/'
      },
      timeout: 15000
    })

    const contentType = upstream.headers['content-type'] || 'image/jpeg'
    res.setHeader('Content-Type', contentType)
    // 緩存一天
    res.setHeader('Cache-Control', 'public, max-age=86400, immutable')
    console.log(`[PROXY IMAGE] 代理成功 - 大小: ${upstream.data.length} bytes, 类型: ${contentType}`)
    return res.status(200).send(Buffer.from(upstream.data))
  } catch (err) {
    console.error(`[PROXY IMAGE] 代理失败 - URL: ${url}, 错误:`, err.message)
    return res.status(502).send('bad gateway')
  }
})

export default router
