import { defineStore } from 'pinia'
import { mediaCount, embyStorage, embyPlayTime, embyLatestAdd } from '@/api/home'
import type { MediaCountInfoType, EmbyStorageInfoType, EmbyPlayTimeInfoType, EmbyLatestAddItemType } from '@/types/home'

export const useHomeStore = defineStore('home', () => {
  const isLoading = ref(false)
  const lastUpdated = ref<string>('')
  const mediaCountInfo = ref<MediaCountInfoType>({
    MovieCount: 0,
    SeriesCount: 0,
    SongCount: 0,
    TotalCount: 0
  })

  const embyStorageInfo = ref<EmbyStorageInfoType>({
    AudioSize: 0,
    DiskSize: 0,
    EpisodeSize: 0,
    MovieSize: 0,
    TotalSize: 0
  })

  const embyPlayTimeInfo = ref<EmbyPlayTimeInfoType>({
    AudioTime: 0,
    EpisodeTime: 0,
    MovieTime: 0,
    TotalTime: 0
  })

  const embyLatestAddList = ref<EmbyLatestAddItemType[]>([])

  // 获取媒体库概览
  const getMediaCount = async () => {
    const { data: res } = await mediaCount()
    if (res.code === 200) mediaCountInfo.value = res.data
  }

  // 获取存储占用空间
  const getEmbyStorage = async () => {
    const { data: res } = await embyStorage()
    if (res.code === 200) embyStorageInfo.value = res.data
  }

  // 获取播放时长
  const getEmbyPlayTime = async () => {
    const { data: res } = await embyPlayTime()
    if (res.code === 200) embyPlayTimeInfo.value = res.data
  }

  // 获取最近添加
  const getEmbyLatestAdd = async () => {
    const { data: res } = await embyLatestAdd()
    if (res.code === 200) embyLatestAddList.value = res.data
  }

  // 获取Emby所有的信息看板
  const getEmbyAllInfo = async () => {
    try {
      isLoading.value = true
      await Promise.all([getMediaCount(), getEmbyStorage(), getEmbyPlayTime(), getEmbyLatestAdd()])
      lastUpdated.value = new Date().toLocaleString()
    } finally {
      isLoading.value = false
    }
  }

  return {
    mediaCountInfo,
    embyStorageInfo,
    embyLatestAddList,
    embyPlayTimeInfo,
    isLoading,
    lastUpdated,
    getEmbyAllInfo
  }
})
