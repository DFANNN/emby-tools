import express from 'express'

const router = express.Router()

router.get('/aaa', (req, res) => {
  res.send('embyPoster')
})

export default router
