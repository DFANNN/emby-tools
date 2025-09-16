import express from 'express'
import si from 'systeminformation'
import fs from 'fs'
import path from 'path'

const router = express.Router()

// 获取文件夹内容
router.get('/folder-content', async (req, res) => {
  const { dirPath } = req.query
  console.log(`[RENAME FOLDER] 开始获取文件夹内容 - 路径: ${dirPath || '根目录'}`)

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
      console.log(`[RENAME FOLDER] 获取磁盘列表成功 - 共 ${data.length} 个磁盘`)
      return res.success(data, '获取磁盘列表成功')
    } catch (error) {
      console.error('[RENAME FOLDER] 获取磁盘列表失败:', error.message)
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

    console.log(`[RENAME FOLDER] 获取文件夹内容成功 - 共 ${data.length} 项`)
    return res.success(data, '获取文件夹内容成功')
  } catch (error) {
    console.error(`[RENAME FOLDER] 获取文件夹内容失败 - 路径: ${dirPath}, 错误:`, error.message)
    return res.error('获取文件夹内容失败', error)
  }
})

// 批量重命名接口
router.post('/batch-rename', async (req, res) => {
  const renameList = req.body
  console.log(`[RENAME BATCH] 开始批量重命名 - 共 ${renameList.length} 项`)
  if (!Array.isArray(renameList)) {
    console.error('[RENAME BATCH] 请求体必须为数组')
    return res.error('请求体必须为数组')
  }
  const results = []
  let successCount = 0
  let errorCount = 0

  for (const item of renameList) {
    const { targetName, newName } = item
    if (!targetName || !newName) {
      console.warn(`[RENAME BATCH] 参数缺失 - 原文件: ${targetName}, 新文件: ${newName}`)
      results.push({
        name: path.basename(targetName),
        fullPath: targetName,
        newName,
        fileType: path.extname(targetName).slice(1),
        status: 'error',
        statusText: '参数缺失'
      })
      errorCount++
      continue
    }
    try {
      // 兼容多系统，路径直接用
      fs.renameSync(targetName, newName)
      console.log(`[RENAME BATCH] 重命名成功 - ${path.basename(targetName)} -> ${path.basename(newName)}`)
      results.push({
        name: path.basename(newName),
        fullPath: newName,
        newName: '',
        fileType: path.extname(newName).slice(1),
        status: 'success',
        statusText: '修改成功'
      })
      successCount++
    } catch (err) {
      console.error(
        `[RENAME BATCH] 重命名失败 - ${path.basename(targetName)} -> ${path.basename(newName)}, 错误:`,
        err.message
      )
      results.push({
        name: path.basename(targetName),
        fullPath: targetName,
        newName,
        fileType: path.extname(targetName).slice(1),
        status: 'error',
        statusText: err.message
      })
      errorCount++
    }
  }
  console.log(`[RENAME BATCH] 批量重命名完成 - 成功: ${successCount}, 失败: ${errorCount}`)
  return res.success(results, '批量重命名完成')
})

// 批量删除接口（仅支持文件，目录将判为失败；仅接受 fullPath 字符串数组）
router.post('/batch-delete', async (req, res) => {
  const deleteList = req.body
  console.log(`[RENAME DELETE] 开始批量删除 - 共 ${deleteList.length} 项`)
  if (!Array.isArray(deleteList)) {
    console.error('[RENAME DELETE] 请求体必须为数组')
    return res.error('请求体必须为数组')
  }
  let success = 0
  let failed = 0
  for (const fullPath of deleteList) {
    if (typeof fullPath !== 'string' || !fullPath) {
      console.warn(`[RENAME DELETE] 无效路径: ${fullPath}`)
      failed++
      continue
    }
    try {
      const stat = fs.statSync(fullPath)
      if (stat.isDirectory()) {
        // 不支持删除文件夹
        console.warn(`[RENAME DELETE] 跳过文件夹: ${fullPath}`)
        failed++
        continue
      }
      fs.unlinkSync(fullPath)
      console.log(`[RENAME DELETE] 删除成功: ${path.basename(fullPath)}`)
      success++
    } catch (err) {
      console.error(`[RENAME DELETE] 删除失败: ${path.basename(fullPath)}, 错误:`, err.message)
      failed++
    }
  }
  console.log(`[RENAME DELETE] 批量删除完成 - 成功: ${success}, 失败: ${failed}`)
  return res.success({ success, failed }, '批量删除完成')
})

export default router
