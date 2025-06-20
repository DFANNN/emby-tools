<template>
  <div class="index-container">
    <div class="left">
      <PosterRules />
    </div>
    <div class="right">
      <PreviewPoster />
    </div>
  </div>
  <LinkEmbyConfig ref="linkEmbyConfigRef" />
</template>

<script setup lang="ts">
import LinkEmbyConfig from '@/views/embyPoster/linkEmbyConfig.vue'
import PreviewPoster from '@/views/embyPoster/previewPoster.vue'
import PosterRules from '@/views/embyPoster/posterRules.vue'

const embyPosterStore = useEmbyPosterStore()

// ref
const linkEmbyConfigRef = useTemplateRef('linkEmbyConfigRef')

onMounted(() => {
  embyPosterStore.getEmbyUrlAndApiKey()
  if (embyPosterStore.connectionForm.ip && embyPosterStore.connectionForm.apiKey) {
    embyPosterStore.connectToEmby()
  } else {
    linkEmbyConfigRef.value?.showDialog()
  }
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
