<template>
  <div class="index-container" v-loading="embyPosterStore.loading" :element-loading-text="embyPosterStore.loadingText">
    <div class="left">
      <PosterRules />
    </div>
    <div class="right">
      <PreviewPoster />
    </div>
  </div>
</template>

<script setup lang="ts" name="embyPoster">
import PreviewPoster from '@/views/embyPoster/previewPoster.vue'
import PosterRules from '@/views/embyPoster/posterRules.vue'

defineOptions({ name: 'embyPoster' })
const embyPosterStore = useEmbyPosterStore()

onMounted(() => {
  embyPosterStore.getEmbyMediaLibraryList()
})

onBeforeUnmount(() => {
  embyPosterStore.clearData()
})
</script>

<style scoped lang="scss">
.index-container {
  display: flex;
  gap: 1rem;
  width: 100%;
  .left {
    width: 400px;
    flex-shrink: 0; // 防止left被压缩
  }
  .right {
    flex: 1;
    min-width: 0; // 确保flex子项可以正确收缩
  }
}
</style>
