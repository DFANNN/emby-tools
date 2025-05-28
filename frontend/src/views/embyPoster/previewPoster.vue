<template>
  <div class="preview-poster-container">
    <div class="preview-header">
      <h2>预览效果</h2>
      <el-button type="success" @click="uploadPoster" :disabled="!hasGeneratedPosters">上传到 Emby</el-button>
    </div>
    <div class="preview-container">
      <div class="poster-grid">
        <!-- 原始海报 -->
        <div
          v-for="item in embyPosterStore.needGeneratePosterMediaLibraryList"
          :key="item.Id"
          class="poster-item"
          v-if="!embyPosterStore.showPreviewPoster"
        >
          <img :src="item.ImageUrl" alt="" class="original-img" />
          <div class="poster-title">{{ item.Name }}</div>
        </div>
        <!-- 预览海报一 -->
        <div
          v-for="(poster, index) in embyPosterStore.needGeneratePosterMediaLibraryList"
          :key="index"
          class="poster-item"
          v-else
        >
          <PosterOne :poster="poster" />
          <div class="poster-title">{{ poster.Name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PosterOne from '@/views/embyPoster/posterLayout/posterOne.vue'

const embyPosterStore = useEmbyPosterStore()

const hasGeneratedPosters = ref(false)

const uploadPoster = async () => {
  // TODO: 实现封面上传
}
</script>

<style scoped lang="scss">
.preview-poster-container {
  height: 100%;
  overflow-y: auto;
  background: var(--el-bg-color-overlay);
  border-radius: var(--el-border-radius-base);
  padding: 1.5rem;
  box-shadow: var(--el-box-shadow-light);
  .preview-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }
  .preview-container {
    overflow-y: auto;
    padding: 1rem;
    background: var(--el-bg-color);
    border-radius: var(--el-border-radius-base);
    .poster-grid {
      display: grid;
      gap: 1.5rem;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));

      .poster-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        .original-img {
          width: 320px;
          height: 180px;
        }
      }
      .poster-title {
        margin-top: 0.4rem;
        font-size: 1rem;
        font-weight: 500;
        color: #555;
        text-align: center;
        letter-spacing: 1.5px;
        font-family: 'PingFang SC', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
        line-height: 1.3;
      }
    }
  }
}
</style>
