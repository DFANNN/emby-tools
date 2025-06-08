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
import domtoimage from 'dom-to-image'
import { embyReplaceMediaLibraryPoster } from '@/api/embyPoster'
import PosterOne from '@/views/embyPoster/posterLayout/posterOne.vue'

const embyPosterStore = useEmbyPosterStore()

const uploadPoster = async () => {
  const posterElements = document.querySelectorAll('.poster-jpg')

  for (const posterElement of posterElements) {
    // 获取当前媒体库id
    const mediaId = posterElement.getAttribute('media-id')
    // 生成png图片
    const domImage = await domtoimage.toPng(posterElement as HTMLElement, {
      // 画布的宽高
      width: 640 * 2,
      height: 360 * 2,
      style: {
        transform: 'scale(2)',
        transformOrigin: 'top left',
        // 元素的真是宽高
        width: '640px',
        height: '360px'
      }
    })
    // 删除base64图片的前缀
    const base64Image = domImage.replace('data:image/png;base64,', '')
    // 上传到emby
    const res = await embyReplaceMediaLibraryPoster(mediaId!, base64Image)
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
    height: calc(100vh - 59px - 40px - 48px - 35px - 24px - 1px);
    overflow-y: auto;
    padding: 1rem;
    background: var(--el-bg-color);
    border-radius: var(--el-border-radius-base);
    .poster-grid {
      display: grid;
      gap: 1.5rem;
      grid-template-columns: repeat(auto-fill, minmax(640px, 1fr));

      .poster-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        .original-img {
          width: 640px;
          height: 360px;
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
