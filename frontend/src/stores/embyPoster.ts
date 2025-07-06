// embyPoster的仓库
import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'
import { setEmbyUrl } from '@/utils/request'
import { linkEmby, embyMediaLibraryItems } from '@/api/embyPoster'
import type { IRuleForm, IEmbyMediaLibraryItem, IConnectionForm } from '@/types/embyPoster'

export const useEmbyPosterStore = defineStore('embyPoster', () => {
  // loading
  const loading = ref(false)
  const loadingText = ref('')

  // 连接emby数据的表单
  const connectionForm = ref<IConnectionForm>({
    protocol: 'http',
    ip: '',
    port: '8096',
    apiKey: ''
  })
  // 连接emby的方法
  const connectToEmby = async () => {
    const url = `${connectionForm.value.protocol}://${connectionForm.value.ip}:${connectionForm.value.port}`
    setEmbyUrl(url, connectionForm.value.apiKey)
    const res = await linkEmby()
    if (res.status === 200) {
      // 获取媒体库列表
      embyMediaLibraryList.value = res.data.Items.map((item: any) => {
        return {
          Id: item.Id, // 媒体库id
          Name: item.Name, // 媒体库名称
          CollectionType: item.CollectionType, // 媒体库类型
          ImageUrl: `${url}/Items/${item.Id}/Images/Primary` //封面图片地址
        }
      }).filter((item: any) => item.CollectionType !== 'music')
      // 默认全选需要生成封面的媒体库
      ruleForm.value.ids = embyMediaLibraryList.value.map(item => item.Id)
      // 获取需要生成封面的媒体库列表
      needGeneratePosterMediaLibraryList.value = embyMediaLibraryList.value.filter(item =>
        ruleForm.value.ids.includes(item.Id)
      )
      connectionStatus.value = true
      ElMessage.success('Emby连接成功')
    } else {
      ElMessage.error('Emby连接失败')
    }
  }
  // 从localStorage中获取emby的url和apiKey,并且设置到connectionForm中
  const getEmbyUrlAndApiKey = () => {
    const url = localStorage.getItem('emby_url')
    const apiKey = localStorage.getItem('emby_token')
    if (!url && !apiKey) return
    const embyUrl = new URL(url!)
    connectionForm.value.protocol = embyUrl.protocol.replace(':', '')
    connectionForm.value.ip = embyUrl.hostname
    connectionForm.value.port = embyUrl.port
    connectionForm.value.apiKey = apiKey!
  }

  // emby 媒体库列表
  const embyMediaLibraryList = ref<IEmbyMediaLibraryItem[]>([])
  // 连接状态
  const connectionStatus = ref(false)

  // 需要生成封面的媒体库id
  const ruleForm = ref<IRuleForm>({
    ids: []
  })
  // 获取需要生成封面的媒体库列表
  const needGeneratePosterMediaLibraryList = ref<IEmbyMediaLibraryItem[]>([])

  // 是否展示预览海报
  const showPreviewPoster = ref(false)

  // 精选渐变色数组
  const gradients = [
    // 柔和同色系深浅渐变
    'linear-gradient(120deg, #232526 0%, #414345 100%)',
    'linear-gradient(120deg, #283e51 0%, #485563 100%)',
    'linear-gradient(120deg, #373b44 0%, #4286f4 100%)',
    'linear-gradient(120deg, #1e3c72 0%, #2a5298 100%)',
    'linear-gradient(120deg, #41295a 0%, #2F0743 100%)',
    'linear-gradient(120deg, #232526 0%, #3a3a3a 100%)',
    'linear-gradient(120deg, #232526 0%, #485563 100%)',
    'linear-gradient(120deg, #232526 0%, #764ba2 100%)',
    'linear-gradient(120deg, #232526 0%, #3498db 100%)',
    'linear-gradient(120deg, #232526 0%, #b91d73 100%)',
    'linear-gradient(120deg, #232526 0%, #185a9d 100%)',
    'linear-gradient(120deg, #232526 0%, #43cea2 100%)',
    'linear-gradient(120deg, #232526 0%, #fa709a 100%)',
    'linear-gradient(120deg, #232526 0%, #30cfd0 100%)',
    'linear-gradient(120deg, #232526 0%, #a1c4fd 100%)',
    'linear-gradient(120deg, #232526 0%, #667eea 100%)',
    'linear-gradient(120deg, #232526 0%, #c471f5 100%)',
    'linear-gradient(120deg, #232526 0%, #48c6ef 100%)',
    'linear-gradient(120deg, #232526 0%, #9795f0 100%)',
    // 三色渐变，过渡更自然
    'linear-gradient(120deg, #232526 0%, #414345 50%, #6f86d6 100%)',
    'linear-gradient(120deg, #283e51 0%, #485563 50%, #6f86d6 100%)',
    'linear-gradient(120deg, #373b44 0%, #4286f4 50%, #6f86d6 100%)',
    'linear-gradient(120deg, #1e3c72 0%, #2a5298 50%, #6f86d6 100%)',
    'linear-gradient(120deg, #41295a 0%, #2F0743 50%, #764ba2 100%)',
    'linear-gradient(120deg, #232526 0%, #414345 50%, #3498db 100%)',
    'linear-gradient(120deg, #232526 0%, #414345 50%, #b91d73 100%)',
    'linear-gradient(120deg, #232526 0%, #414345 50%, #43cea2 100%)',
    'linear-gradient(120deg, #232526 0%, #414345 50%, #fa709a 100%)',
    'linear-gradient(120deg, #232526 0%, #414345 50%, #c471f5 100%)',
    // 经典蓝紫、蓝绿、粉紫等
    'linear-gradient(120deg, #30cfd0 0%, #330867 100%)',
    'linear-gradient(120deg, #5ee7df 0%, #b490ca 100%)',
    'linear-gradient(120deg, #a18cd1 0%, #fbc2eb 100%)',
    'linear-gradient(120deg, #43cea2 0%, #185a9d 100%)',
    'linear-gradient(120deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(120deg, #c471f5 0%, #fa71cd 100%)',
    'linear-gradient(120deg, #48c6ef 0%, #6f86d6 100%)',
    'linear-gradient(120deg, #9795f0 0%, #fbc7d4 100%)',
    'linear-gradient(120deg, #f093fb 0%, #f5576c 100%)',
    // 适当保留部分亮色但不过分极端的渐变
    'linear-gradient(120deg, #f7971e 0%, #ffd200 100%)',
    'linear-gradient(120deg, #f6d365 0%, #fda085 100%)',
    'linear-gradient(120deg, #fbc2eb 0%, #a6c1ee 100%)',
    'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)',
    'linear-gradient(120deg, #fcb69f 0%, #ffecd2 100%)',
    'linear-gradient(120deg, #f9d423 0%, #ff4e50 100%)',
    'linear-gradient(120deg, #00b4db 0%, #0083b0 100%)',
    'linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%)',
    // 新增柔和好看的渐变色
    'linear-gradient(120deg, #536976 0%, #292e49 100%)',
    'linear-gradient(120deg, #485563 0%, #29323c 100%)',
    'linear-gradient(120deg, #134e5e 0%, #71b280 100%)',
    'linear-gradient(120deg, #1f4037 0%, #99f2c8 100%)',
    'linear-gradient(120deg, #a770ef 0%, #cf8bf3 50%, #fdb99b 100%)',
    'linear-gradient(120deg, #f857a6 0%, #ff5858 100%)',
    'linear-gradient(120deg, #bdc3c7 0%, #2c3e50 100%)',
    'linear-gradient(120deg, #f7797d 0%, #FBD786 100%)',
    'linear-gradient(120deg, #f953c6 0%, #b91d73 100%)',
    'linear-gradient(120deg, #1a2980 0%, #26d0ce 100%)',
    'linear-gradient(120deg, #0f2027 0%, #2c5364 100%)',
    'linear-gradient(120deg, #000428 0%, #004e92 100%)',
    'linear-gradient(120deg, #f6d365 0%, #fda085 100%)',
    'linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%)',
    // 新增
    'linear-gradient(120deg, #eecda3 0%, #ef629f 100%)',
    'linear-gradient(120deg, #a1ffce 0%, #faffd1 100%)',
    'linear-gradient(120deg, #1e130c 0%, #9a8478 100%)',
    'linear-gradient(120deg, #141e30 0%, #243b55 100%)',
    'linear-gradient(120deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
    'linear-gradient(120deg, #1f1c2c 0%, #928dab 100%)',
    'linear-gradient(120deg, #4568dc 0%, #b06ab3 100%)',
    'linear-gradient(120deg, #fbc7d4 0%, #9796f0 100%)',
    'linear-gradient(120deg, #fceabb 0%, #f8b500 100%)',
    'linear-gradient(120deg, #fbd3e9 0%, #bb377d 100%)',
    'linear-gradient(120deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)',
    'linear-gradient(120deg, #c2e59c 0%, #64b3f4 100%)',
    'linear-gradient(120deg, #56ab2f 0%, #a8e063 100%)',
    'linear-gradient(120deg, #3ca55c 0%, #b5ac49 100%)',
    'linear-gradient(120deg, #00c9ff 0%, #92fe9d 100%)',
    'linear-gradient(120deg, #93a5cf 0%, #e4efe9 100%)',
    'linear-gradient(120deg, #dbe6f6 0%, #c5796d 100%)',
    'linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%)',
    'linear-gradient(120deg, #83a4d4 0%, #b6fbff 100%)',
    'linear-gradient(120deg, #4facfe 0%, #00f2fe 100%)',
    // 深色版本
    'linear-gradient(120deg, #0f2027 0%, #203a43 100%)',
    'linear-gradient(120deg, #2c3e50 0%, #4ca1af 100%)',
    'linear-gradient(120deg, #000000 0%, #434343 100%)',
    'linear-gradient(120deg, #1c1c1c 0%, #383838 100%)',
    'linear-gradient(120deg, #2b5876 0%, #4e4376 100%)',
    'linear-gradient(120deg, #1e130c 0%, #9a8478 100%)',
    'linear-gradient(120deg, #141e30 0%, #243b55 100%)',
    'linear-gradient(120deg, #3a6073 0%, #16222a 100%)',
    'linear-gradient(120deg, #2b2e4a 0%, #1f4068 100%)',
    'linear-gradient(120deg, #000428 0%, #004e92 100%)',
    'linear-gradient(120deg, #2e2e2e 0%, #1c1c1c 100%)',
    'linear-gradient(120deg, #1a1a1d 0%, #4e4e50 100%)',
    'linear-gradient(120deg, #3c3b3f 0%, #605c3c 100%)',
    'linear-gradient(120deg, #434343 0%, #000000 100%)',
    'linear-gradient(120deg, #4b6cb7 0%, #182848 100%)',
    'linear-gradient(120deg, #41295a 0%, #2f0743 100%)',
    'linear-gradient(120deg, #1c1c2b 0%, #2e2c3f 100%)',
    'linear-gradient(120deg, #485563 0%, #29323c 100%)'
  ]
  // 获取随机渐变色
  const getRandomGradient = () => {
    const idx = Math.floor(Math.random() * gradients.length)
    return gradients[idx]
  }

  /**
   * 生成随机数
   * @param max 生成随机数最大值
   * @param count 生成随机数个数
   * @returns 随机数列表
   */
  const getRandomNumber = (max: number, count: number = 4) => {
    let randomList = []
    for (let i = 0; i < count; i++) {
      const num = Math.floor(Math.random() * max)
      randomList.push(num)
    }
    return randomList
  }
  /**
   * 生成预览海报的展示图片url
   * 需要从emby媒体库中获取图片
   * @param id 媒体库id
   * @returns 图片url列表
   */
  const generatePreviewImageUrls = async (id: string) => {
    let imageUrls: string[] = []
    const url = localStorage.getItem('emby_url')
    const res = await embyMediaLibraryItems(id)
    // 随机获取4张图片
    if (res.status === 200 && res.data) {
      const randomList = getRandomNumber(res.data.TotalRecordCount, 9)
      imageUrls = randomList.map(item => {
        return `${url}/Items/${res.data.Items[item].Id}/Images/Primary`
      })
    }
    return imageUrls
  }

  // 清除数据
  const clearData = () => {
    showPreviewPoster.value = false
  }

  return {
    connectionForm,
    connectToEmby,
    getEmbyUrlAndApiKey,
    embyMediaLibraryList,
    connectionStatus,
    ruleForm,
    needGeneratePosterMediaLibraryList,
    showPreviewPoster,
    getRandomGradient,
    generatePreviewImageUrls,
    loading,
    loadingText,
    clearData
  }
})
