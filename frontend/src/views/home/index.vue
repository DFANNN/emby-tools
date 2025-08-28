<template>
  <div class="index-container">
    <HeaderComponent />
    <div class="content">
      <CountsComponents :countsInfo="homeStore.mediaCountInfo" />
      <StorageComponents :storageInfo="homeStore.embyStorageInfo" />
      <LatestAdd :recentList="homeStore.embyLatestAddList" />
      <WatchStats :watchInfo="homeStore.embyPlayTimeInfo" />
    </div>
  </div>
</template>

<script setup lang="ts">
import HeaderComponent from '@/views/home/header.vue'
import CountsComponents from '@/views/home/counts.vue'
import StorageComponents from '@/views/home/storage.vue'
import LatestAdd from '@/views/home/latestAdd.vue'
import WatchStats from '@/views/home/watchStats.vue'

const homeStore = useHomeStore()
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
