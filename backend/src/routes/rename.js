import express from 'express'

const router = express.Router()

// 获取文件夹内容
router.get('/folder-content', async (req, res) => {
  const { path } = req.query

  if (path === '') {
    return res.success(
      [
        { path: '1.txt', name: '1.txt', type: 'txt' },
        { path: '2.txt', name: '2.txt', type: 'txt' },
        { path: '3.txt', name: '3.txt', type: 'txt' }
      ],
      '获取文件夹内容成功'
    )
  }
})

export default router
