<template>
  <div class="preview-poster-container">
    <div class="preview-header">
      <h2>预览效果</h2>
      <el-button type="success" @click="uploadPoster">上传到 Emby</el-button>
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
          <PosterOne :poster="poster" :media-id="poster.Id" class="poster-jpg" />
          <div class="poster-title">{{ poster.Name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import html2canvas from 'html2canvas'
import { embyReplaceMediaLibraryPoster } from '@/api/embyPoster'
import PosterOne from '@/views/embyPoster/posterLayout/posterOne.vue'

const embyPosterStore = useEmbyPosterStore()

const uploadPoster = async () => {
  // TODO: 实现封面上传
  const posterElements = document.querySelectorAll('.poster-jpg')
  for (const posterElement of posterElements) {
    // 获取当前海报的媒体库ID
    const mediaLibraryId = posterElement.getAttribute('media-id')
    // 当前海报html转换为canvas
    const canvas = await html2canvas(posterElement as HTMLElement, {
      useCORS: true,
      allowTaint: false
    })
    // 转换为 Base64 图片（默认 PNG 格式）
    let base64Image = canvas.toDataURL('image/png')
    base64Image = base64Image.replace('data:image/png;base64,', '')
    // 上传到 Emby
    const res = await embyReplaceMediaLibraryPoster(mediaLibraryId!, base64Image)
    console.log(`res->`, res)
  }
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
