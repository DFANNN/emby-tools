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

    // 统一排序：文件夹优先，其次按名称自然排序（数字顺序、忽略大小写、兼容中文）
    const collator = new Intl.Collator('zh', { numeric: true, sensitivity: 'base' })
    data.sort((a, b) => {
      if (a.type !== b.type) return a.type === 'folder' ? -1 : 1
      return collator.compare(a.name, b.name)
    })

    return res.success(data, '获取文件夹内容成功')
  } catch (error) {
    return res.error('获取文件夹内容失败', error)
  }
})

// 批量重命名接口
router.post('/batch-rename', async (req, res) => {
  const renameList = req.body
  console.log(renameList)
  if (!Array.isArray(renameList)) {
    return res.error('请求体必须为数组')
  }
  const results = []
  for (const item of renameList) {
    const { targetName, newName } = item
    if (!targetName || !newName) {
      results.push({
        name: path.basename(targetName),
        fullPath: targetName,
        newName,
        fileType: path.extname(targetName).slice(1),
        status: 'error',
        statusText: '参数缺失'
      })
      continue
    }
    try {
      // 兼容多系统，路径直接用
      fs.renameSync(targetName, newName)
      results.push({
        name: path.basename(newName),
        fullPath: newName,
        newName: '',
        fileType: path.extname(newName).slice(1),
        status: 'success',
        statusText: '修改成功'
      })
    } catch (err) {
      results.push({
        name: path.basename(targetName),
        fullPath: targetName,
        newName,
        fileType: path.extname(targetName).slice(1),
        status: 'error',
        statusText: err.message
      })
    }
  }
  return res.success(results, '批量重命名完成')
})

// 批量删除接口（仅支持文件，目录将判为失败；仅接受 fullPath 字符串数组）
router.post('/batch-delete', async (req, res) => {
  const deleteList = req.body
  if (!Array.isArray(deleteList)) {
    return res.error('请求体必须为数组')
  }
  let success = 0
  let failed = 0
  for (const fullPath of deleteList) {
    if (typeof fullPath !== 'string' || !fullPath) {
      failed++
      continue
    }
    try {
      const stat = fs.statSync(fullPath)
      if (stat.isDirectory()) {
        // 不支持删除文件夹
        failed++
        continue
      }
      fs.unlinkSync(fullPath)
      success++
    } catch (err) {
      failed++
    }
  }
  return res.success({ success, failed }, '批量删除完成')
})

export default router
