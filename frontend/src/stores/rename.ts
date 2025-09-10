import { defineStore } from 'pinia'
import { folderContent, batchRename, batchDeleteFile } from '@/api/rename'
import { getSeriesNameFromPath } from '@/utils/utils'
import { ElMessage } from 'element-plus'
import type { IDiskFolderItem, IRenameFileItem, IParseResult } from '@/types/rename'

// 文件名解析模式
const EPISODE_PATTERNS = [
  /[Ss](\d{1,2})[Ee](\d{1,2})/, // S01E02
  /(\d{1,2})x(\d{1,2})/, // 1x02
  /[第](\d{1,2})[季集].*?(\d{1,2})/, // 第1季第2集
  /[Ee][Pp]\.?(\d{1,2})/, // EP02
  /[\[\(](\d{1,2})[\]\)]/, // [02] 或 (02)
  /\b(\d{1,2})\b/ // 单纯数字（最后匹配）
]

export const useRenameStore = defineStore('rename', () => {
  // 重命名文件夹的路径
  const path = ref('')

  const ruleForm = ref({
    model: 'tv', // 更名模式
    newFileName: '', // 新文件名
    seasonNumber: undefined, // 季号
    targetName: '', // 查找文本
    replaceName: '', // 替换文本
    insertText: '', // 插入文本
    insertPosition: '' // 插入位置，'start' 或 'end'
  })

  // dialog对话框开关
  const dialogVisible = ref(false)

  // 磁盘or文件夹列表
  const diskFolderList = ref<IDiskFolderItem[]>([])

  // 当前用户正在操作的路径列表
  const currentPathList = ref<IDiskFolderItem[]>([])

  // 重命名文件list（绑定表格）
  const renameFileList = ref<IRenameFileItem[]>([])
  // 文件类型列表 （表格筛选用）
  const fileTypeList = computed(() => {
    let fileTypes = renameFileList.value.filter(item => item.fileType).map(item => item.fileType)
    return [...new Set(fileTypes)].map(item => {
      return {
        text: item,
        value: item
      }
    })
  })
  // 选中要更名的文件列表(用于更名发请求)
  const selectRenameList = ref<IDiskFolderItem[]>([])

  // 获取文件夹内容
  const getFolderContent = async (path: string = '') => {
    const { data: res } = await folderContent(path)
    if (res.code === 200) diskFolderList.value = res.data
  }

  // 展示对话框
  const showDialog = () => {
    getFolderContent()
    dialogVisible.value = true
  }

  // 点击文件夹事件
  const selectFolderHandler = (data: IDiskFolderItem) => {
    if (data.type === 'file') return
    currentPathList.value.push(data)
    getFolderContent(data.fullPath)
  }

  // 点击当前路径时，跳转到某个路径的回调
  const goToPath = (path: string, index: number) => {
    currentPathList.value.splice(index + 1)
    getFolderContent(path)
  }

  // 对话框取消
  const cancelDialog = () => {
    dialogVisible.value = false
    diskFolderList.value = []
    currentPathList.value = []
  }

  // 获取重命名文件列表
  const getRenameFileList = async () => {
    const { data: res } = await folderContent(path.value)
    if (res.code === 200) {
      renameFileList.value = res.data
      cancelDialog()
    }
  }

  // 对话框确定
  const confirmDialog = async () => {
    if (!currentPathList.value.length) {
      ElMessage.warning('请选择一个文件夹')
      return
    }
    // 拿到当前path
    path.value = JSON.parse(JSON.stringify(currentPathList.value[currentPathList.value.length - 1]?.fullPath || ''))
    // 截取文件路径中的名字
    ruleForm.value.newFileName = getSeriesNameFromPath(path.value) || ''
    getRenameFileList()
  }

  // 返回跟目录
  const returnRoot = () => {
    currentPathList.value = []
    diskFolderList.value = []
    getFolderContent()
  }

  // 解析文件名
  const parseFileName = (fileName: string): IParseResult => {
    let result: IParseResult = {
      confidence: 0
    }

    // 移除扩展名
    const nameWithoutExt = fileName.replace(/\.[^/.]+$/, '')

    for (const pattern of EPISODE_PATTERNS) {
      const match = nameWithoutExt.match(pattern)
      if (match) {
        if (match.length === 3) {
          result.season = parseInt(match[1])
          result.episode = parseInt(match[2])
          result.confidence = 0.9
        } else if (match.length === 2) {
          result.episode = parseInt(match[1])
          result.confidence = 0.7
        }
        break
      }
    }

    return result
  }

  // 重新解析所有文件
  const reanalyzeFiles = () => {
    renameFileList.value = renameFileList.value.map(file => {
      const parseResult = parseFileName(file.name)
      // 如果设置了默认季号，优先使用默认季号，否则才使用解析结果
      if (ruleForm.value.seasonNumber) {
        parseResult.season = ruleForm.value.seasonNumber
      }
      return {
        ...file,
        parseResult,
        status: parseResult.confidence > 0.5 ? 'success' : 'warning',
        statusText: parseResult.confidence > 0.5 ? '解析成功' : '低置信度，请检查'
      }
    })
    generateNewNames()
  }

  // 生成新文件名
  const generateNewNames = () => {
    renameFileList.value = renameFileList.value.map(file => {
      if (!file.parseResult) return file

      const season = file.parseResult.season
      const episode = file.parseResult.episode

      // 如果没有解析出季号，则跳过重命名
      if (season === undefined) {
        return {
          ...file,
          status: 'warning',
          statusText: '无法解析季号，请手动编辑'
        }
      }

      // 如果没有解析出集号，则跳过重命名
      if (episode === undefined) {
        return {
          ...file,
          status: 'warning',
          statusText: '无法解析集号，请手动编辑'
        }
      }

      let newName = ''

      // 使用解析结果中的季号（已在reanalyzeFiles中处理过默认季号）
      const seasonPart = season !== undefined ? `S${String(season).padStart(2, '0')}` : ''
      newName = `${ruleForm.value.newFileName} ${seasonPart}E${String(episode).padStart(2, '0')}`

      // 保持原始扩展名
      const ext = file.name.split('.').pop()
      newName = `${newName}.${ext}`

      return {
        ...file,
        newName,
        status: 'success',
        statusText: '准备重命名'
      }
    })
  }

  // 移除单个文件
  const deleteFile = (file: IRenameFileItem) => {
    const index = renameFileList.value.findIndex(f => f.id === file.id)
    if (index !== -1) {
      renameFileList.value.splice(index, 1)
    }
  }

  // 批量移除文件
  const batchDeleteFiles = (files: IRenameFileItem[]) => {
    const ids = new Set(files.map(f => f.id))
    renameFileList.value = renameFileList.value.filter(f => !ids.has(f.id))
  }

  // 批量删除文件
  const deleteFileBatch = async (fullPathList: string[]) => {
    const { data: res } = await batchDeleteFile(fullPathList)
    if (res.code === 200) {
      let message = ''
      if (res.data.success) message += `删除成功${res.data.success}个`
      if (res.data.failed) message += ` 删除失败${res.data.failed}个`
      ElMessage.success(message)
      getRenameFileList()
      return true
    }
    return false
  }

  // 替换模式预览
  const previewReplace = () => {
    renameFileList.value = renameFileList.value.map(file => {
      const newName = file.name.replace(ruleForm.value.targetName, ruleForm.value.replaceName)
      return {
        ...file,
        newName,
        status: 'success',
        statusText: '准备重命名'
      }
    })
  }

  // 插入模式预览
  const previewInsert = () => {
    renameFileList.value = renameFileList.value.map(file => {
      let newName = ''
      if (ruleForm.value.insertPosition === 'start') {
        newName = `${ruleForm.value.insertText}${file.name}`
      } else {
        newName = `${file.name}${ruleForm.value.insertText}`
      }
      return {
        ...file,
        newName,
        status: 'success',
        statusText: '准备重命名'
      }
    })
  }

  // 执行重命名
  const executeRename = async () => {
    const everyNewName = renameFileList.value.every(file => file.newName)
    if (!everyNewName) {
      ElMessage.warning('有文件未生成新名称，请检查文件重命名预览')
      return
    }

    // 整理数据
    const params = renameFileList.value.map(file => {
      return {
        targetName: file.fullPath,
        newName: file.fullPath.replace(file.name, file.newName as string)
      }
    })
    const { data: res } = await batchRename(params)
    if (res.code === 200 && res.data) {
      renameFileList.value = res.data
    }
    ElMessage.success(res.message)
  }

  return {
    path,
    ruleForm,
    dialogVisible,
    diskFolderList,
    currentPathList,
    renameFileList,
    fileTypeList,
    selectRenameList,
    showDialog,
    selectFolderHandler,
    goToPath,
    cancelDialog,
    returnRoot,
    confirmDialog,
    getRenameFileList,
    reanalyzeFiles,
    deleteFile,
    batchDeleteFiles,
    executeRename,
    previewReplace,
    previewInsert,
    deleteFileBatch
  }
})
