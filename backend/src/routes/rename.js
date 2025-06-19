import express from 'express'
import si from 'systeminformation'
import fs from 'fs'
import path from 'path'

const router = express.Router()

// 获取文件夹内容
router.get('/folder-content', async (req, res) => {
  const { dirPath } = req.query

  // 如果路径为空 则返回磁盘列表信息
  if (dirPath === '') {
    try {
      const disks = await si.fsSize()
      const data = disks.map(item => {
        return {
          name: item.mount,
          type: 'disk',
          fullPath: process.platform === 'win32' ? item.mount + '\\' : item.mount
        }
      })
      return res.success(data, '获取磁盘列表成功')
    } catch (error) {
      return res.error('获取磁盘列表失败', error)
    }
  }

  // 如果路径不为空 则返回文件夹内容
  try {
    const dir = fs.opendirSync(dirPath)
    // 初始化文件数组，用于存储目录中的文件和子目录信息
    let data = []
    let index = 0 // 新增索引变量
    // 遍历目录中的每一项
    for await (const dirent of dir) {
      // 将文件或目录的信息添加到数组中
      data.push({
        id: index++,
        name: dirent.name,
        // 如果是目录，类型标记为1，否则为2
        type: dirent.isDirectory() ? 'folder' : 'file',
        // 使用path模块拼接完整的文件或目录路径
        fullPath: path.join(dirPath, dirent.name),
        // 读取文件后缀
        fileType: dirent.isDirectory() ? '' : path.extname(path.join(dirPath, dirent.name)).slice(1)
      })
    }

    return res.success(data, '获取文件夹内容成功')
  } catch (error) {
    return res.error('获取文件夹内容失败', error)
  }
})

export default router
