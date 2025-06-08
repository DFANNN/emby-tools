// embyPoster的仓库
import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'
import { setEmbyUrl } from '@/utils/request'
import { linkEmby, embyMediaLibraryItems } from '@/api/embyPoster'
import type { IRuleForm, IEmbyMediaLibraryItem, IConnectionForm } from '@/types/embyPoster'

export const useEmbyPosterStore = defineStore('embyPoster', () => {
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
    console.log(res)
    if (res.status === 200) {
      // 获取媒体库列表
      embyMediaLibraryList.value = res.data.Items.map((item: any) => {
        return {
          Id: item.Id, // 媒体库id
          Name: item.Name, // 媒体库名称
          CollectionType: item.CollectionType, // 媒体库类型
          ImageUrl: `${url}/Items/${item.Id}/Images/Primary` //封面图片地址
        }
      })
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
    ids: [],
    posterTemplate: '',
    pictureSource: ''
  })
  // 获取需要生成封面的媒体库列表
  const needGeneratePosterMediaLibraryList = ref<IEmbyMediaLibraryItem[]>([])

  // 是否展示预览海报
  const showPreviewPoster = ref(false)

  // 精选渐变色数组
  const gradients = [
    'linear-gradient(120deg, #3a7bd5 0%, #00d2ff 100%)',
    'linear-gradient(120deg, #ff9966 0%, #ff5e62 100%)',
    'linear-gradient(120deg, #43cea2 0%, #185a9d 100%)',
    'linear-gradient(120deg, #a18cd1 0%, #fbc2eb 100%)',
    'linear-gradient(120deg, #f7971e 0%, #ffd200 100%)',
    'linear-gradient(120deg, #96fbc4 0%, #f9f586 100%)',
    'linear-gradient(120deg, #ff512f 0%, #2196f3 100%)',
    'linear-gradient(120deg, #f953c6 0%, #b91d73 100%)',
    'linear-gradient(120deg, #00c3ff 0%, #ffff1c 100%)',
    'linear-gradient(120deg, #f7797d 0%, #FBD786 100%)',
    'linear-gradient(120deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(120deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(120deg, #30cfd0 0%, #330867 100%)',
    'linear-gradient(120deg, #5ee7df 0%, #b490ca 100%)',
    'linear-gradient(120deg, #f6d365 0%, #fda085 100%)',
    'linear-gradient(120deg, #fbc2eb 0%, #a6c1ee 100%)',
    'linear-gradient(120deg, #fdcbf1 0%, #e6dee9 100%)',
    'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)',
    'linear-gradient(120deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%)',
    'linear-gradient(120deg, #fddb92 0%, #d1fdff 100%)',
    'linear-gradient(120deg, #fcb69f 0%, #ffecd2 100%)',
    'linear-gradient(120deg, #c471f5 0%, #fa71cd 100%)',
    'linear-gradient(120deg, #48c6ef 0%, #6f86d6 100%)',
    'linear-gradient(120deg, #9795f0 0%, #fbc7d4 100%)',
    'linear-gradient(120deg, #f5f7fa 0%, #c3cfe2 100%)',
    'linear-gradient(120deg, #f9d423 0%, #ff4e50 100%)',
    'linear-gradient(120deg, #00b4db 0%, #0083b0 100%)',
    'linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%)',
    'linear-gradient(120deg, #f093fb 0%, #f5576c 100%)'
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

  // 布局样式
  const layoutList = ref([
    { name: '样式一', value: '1' },
    { name: '样式二', value: '2' },
    { name: '样式三', value: '3' }
  ])

  //图片来源
  const sourceList = ref([
    { name: '本地媒体库', value: 'local' },
    { name: 'TMDB 热门', value: 'tmdb' }
  ])

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
    layoutList,
    sourceList
  }
})
