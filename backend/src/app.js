import express from 'express'
import cors from 'cors'
import { responseHandler } from './middleware/response.js'
import renameRoutes from './routes/rename.js'
import embyRoutes from './routes/emby.js'
import theMovieDB from './routes/theMovieDB.js'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// 中间件
app.use(cors())
app.use(responseHandler)
app.use(express.json())

// 路由
app.use('/rename', renameRoutes)
app.use('/emby', embyRoutes)
app.use('/theMovieDB', theMovieDB)

// 根据环境判断是否托管前端静态文件
const isProduction = process.env.NODE_ENV === 'production'

// 生产环境托管前端静态文件
if (isProduction) {
  // 静态资源托管
  app.use(express.static(path.join(__dirname, 'public')))

  // SPA history 路由 fallback
  app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
  })
}

app.listen(3001, () => {
  if (isProduction) {
    console.log('✅ 生产模式：已启用前端静态文件托管，后端服务端口：3001')
  } else {
    console.log('🔧 开发模式：前端服务独立运行，后端服务端口：3001')
  }
})
