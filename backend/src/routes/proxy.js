import express from 'express'
import axios from 'axios'
import tmdbStore from '../store/tmdbStore.js'
import { HttpsProxyAgent } from 'https-proxy-agent'
import { SocksProxyAgent } from 'socks-proxy-agent'

const router = express.Router()

// 统一时间戳前缀
const _now = () => {
  const d = new Date()
  const pad = n => String(n).padStart(2, '0')
  return `[${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(
    d.getMinutes()
  )}:${pad(d.getSeconds())}]`
}

// 簡單圖片代理：避免前端 canvas 污染與跨域
router.get('/image', async (req, res) => {
  const { url } = req.query
  console.log(`${_now()} [PROXY IMAGE] 开始代理图片 - URL: ${url}`)
  try {
    if (!url || typeof url !== 'string') {
      console.error(`${_now()} [PROXY IMAGE] 缺少URL参数`)
      return res.status(400).send('missing url')
    }

    // 僅允許代理 TMDB 靜態圖片域名
    const allowedHosts = ['image.tmdb.org']
    const parsed = new URL(url)
    if (!allowedHosts.includes(parsed.host)) {
      console.error(`${_now()} [PROXY IMAGE] 不允许的域名: ${parsed.host}`)
      return res.status(400).send('host not allowed')
    }

    // 基于 tmdbStore.proxy 选择代理
    let agent = null
    const proxyUrl = (tmdbStore.proxy || '').trim().toLowerCase()
    if (proxyUrl.startsWith('http://') || proxyUrl.startsWith('https://')) {
      agent = new HttpsProxyAgent(tmdbStore.proxy)
    } else if (
      proxyUrl.startsWith('socks://') ||
      proxyUrl.startsWith('socks5://') ||
      proxyUrl.startsWith('socks4://')
    ) {
      agent = new SocksProxyAgent(tmdbStore.proxy)
    }

    const upstream = await axios.get(url, {
      responseType: 'arraybuffer',
      headers: {
        // 盡量模擬瀏覽器，避免 403
        'User-Agent': 'Mozilla/5.0',
        Accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
        Referer: 'https://www.themoviedb.org/'
      },
      timeout: 15000,
      httpAgent: agent || undefined,
      httpsAgent: agent || undefined
    })

    const contentType = upstream.headers['content-type'] || 'image/jpeg'
    res.setHeader('Content-Type', contentType)
    // 緩存一天
    res.setHeader('Cache-Control', 'public, max-age=86400, immutable')
    console.log(`${_now()} [PROXY IMAGE] 代理成功 - 大小: ${upstream.data.length} bytes, 类型: ${contentType}`)
    return res.status(200).send(Buffer.from(upstream.data))
  } catch (err) {
    console.error(`${_now()} [PROXY IMAGE] 代理失败 - URL: ${url}, 错误:`, err.message)
    return res.status(502).send('bad gateway')
  }
})

export default router
