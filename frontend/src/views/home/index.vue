<template>
  <div class="index-container">
    <HeaderComponent />
    <div class="content">
      <CountsComponents :countsInfo="mediaCountInfo" />
      <StorageComponents :storageInfo="embyStorageInfo" />
      <LatestAdd :recentList="embyLatestAddList" />
      <WatchStats :watchInfo="embyPlayTimeInfo" />
    </div>
    <FooterComponent />
  </div>
</template>

<script setup lang="ts">
import { mediaCount, embyStorage, embyPlayTime, embyLatestAdd } from '@/api/home'
import HeaderComponent from '@/views/home/header.vue'
import FooterComponent from '@/views/home/footer.vue'
import CountsComponents from '@/views/home/counts.vue'
import StorageComponents from '@/views/home/storage.vue'
import LatestAdd from '@/views/home/latestAdd.vue'
import WatchStats from '@/views/home/watchStats.vue'
import type { MediaCountInfoType, EmbyStorageInfoType, EmbyPlayTimeInfoType, EmbyLatestAddItemType } from '@/types/home'

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

onMounted(() => {
  getMediaCount()
  getEmbyStorage()
  getEmbyPlayTime()
  getEmbyLatestAdd()
})
</script>

<style scoped lang="scss">
.index-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  .content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
    gap: 2rem;
  }
}
@media (max-width: 768px) {
  .index-container {
    gap: 1rem;
    .content {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
  }
}
</style>
