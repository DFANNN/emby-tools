import express from 'express'
import { trending } from '../services/theMovieDBService.js'

const router = express.Router()

// 今日趋势
router.get('/todayTrending', async (req, res) => {
  const { data } = await trending('day')
  console.log(data)
})

export default router
