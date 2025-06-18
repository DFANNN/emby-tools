import { defineStore } from 'pinia'

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

  return {
    path,
    ruleForm,
    dialogVisible
  }
})
