import { defineStore } from 'pinia'
import { folderContent } from '@/api/rename'
import type { IDiskFolderItem } from '@/types/rename'
import { ElMessage } from 'element-plus'

export const useRenameStore = defineStore('rename', () => {
  // 重命名文件夹的路径
  const path = ref('')

  const ruleForm = ref({
    model: 'tv', // 更名模式
    newFileName: '', // 新文件名
    seasonNumber: 1, // 季号
    episodeNumber: 1, // 集数
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
  const renameFileList = ref<IDiskFolderItem[]>([])
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
    getRenameFileList()
  }

  // 返回跟目录
  const returnRoot = () => {
    currentPathList.value = []
    diskFolderList.value = []
    getFolderContent()
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
    getRenameFileList
  }
})
