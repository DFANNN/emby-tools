<template>
  <div class="preview-poster-container">
    <div class="preview-header">
      <h2 class="header-name">预览效果</h2>
      <el-button type="primary" @click="downloadPoster">下载封面图</el-button>
      <el-button type="success" @click="executeUpload">上传到 Emby</el-button>
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
import { ElMessageBox, ElMessage } from 'element-plus'

const embyPosterStore = useEmbyPosterStore()

// 执行上传
const executeUpload = () => {
  ElMessageBox.confirm('确认执行上传到Emby操作吗？此操作会覆盖原有的封面图！', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    uploadPoster()
  })
}

// 上传封面到emby
const uploadPoster = async () => {
  const posterElements = document.querySelectorAll('.poster-jpg')
  if (!posterElements.length) {
    ElMessage.warning('没有可上传的封面！')
    return
  }
  embyPosterStore.loading = true
  embyPosterStore.loadingText = '正在上传中，请勿离开页面...'

  try {
    for (let i = 0; i < posterElements.length; i++) {
      const posterElement = posterElements[i] as HTMLElement
      try {
        const mediaId = posterElement.getAttribute('media-id')
        const domImage = await domtoimage.toPng(posterElement, {
          width: 640 * 2,
          height: 360 * 2,
          style: {
            transform: 'scale(2)',
            transformOrigin: 'top left',
            width: '640px',
            height: '360px'
          }
        })
        const base64Image = domImage.replace('data:image/png;base64,', '')
        await embyReplaceMediaLibraryPoster(mediaId!, base64Image)
      } catch (error) {
        ElMessage.error('上传封面失败')
        embyPosterStore.loading = false
        return
      }
    }
    ElMessage.success('全部封面上传成功！')
  } finally {
    embyPosterStore.loading = false
  }
}

// 下载封面图方法
const downloadPoster = async () => {
  const posterElements = document.querySelectorAll('.poster-jpg')
  if (!posterElements.length) {
    ElMessage.warning('没有可下载的封面！')
    return
  }
  embyPosterStore.loading = true
  embyPosterStore.loadingText = '正在下载中，请勿离开页面...'
  try {
    for (let i = 0; i < posterElements.length; i++) {
      const posterElement = posterElements[i] as HTMLElement
      try {
        const name = posterElement.getAttribute('media-id') || 'poster'
        const domImage = await domtoimage.toPng(posterElement, {
          width: 640 * 2,
          height: 360 * 2,
          style: {
            transform: 'scale(2)',
            transformOrigin: 'top left',
            width: '640px',
            height: '360px'
          }
        })
        const link = document.createElement('a')
        link.href = domImage
        link.download = `${name}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } catch (error) {
        ElMessage.error('下载封面失败')
        embyPosterStore.loading = false
        return
      }
    }
    ElMessage.success('全部封面下载完成！')
  } finally {
    embyPosterStore.loading = false
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
    .header-name {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
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
