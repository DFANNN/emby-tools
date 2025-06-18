import express from 'express'
import cors from 'cors'
import { responseHandler } from './middleware/response.js'
import renameRoutes from './routes/rename.js'

const app = express()

// 中间件
app.use(cors())
app.use(responseHandler)

// 路由
app.use('/rename', renameRoutes)

app.listen(3001, () => {
  console.log('Server is running on port 3001')
})
