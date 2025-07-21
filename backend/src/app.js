import express from 'express'
import cors from 'cors'
import { responseHandler } from './middleware/response.js'
import renameRoutes from './routes/rename.js'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// 静态资源托管
app.use(express.static(path.join(__dirname, 'public')))

// 中间件
app.use(cors())
app.use(responseHandler)
app.use(express.json())

// 路由
app.use('/rename', renameRoutes)

// SPA history 路由 fallback，放在所有路由最后
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.listen(3001, () => {
  console.log('Server is running on port 3001')
})
