<template>
  <div class="preview-poster-container">
    <div class="preview-header">
      <h2>预览效果</h2>
      <el-button type="success" @click="uploadPoster" :disabled="!hasGeneratedPosters">上传到 Emby</el-button>
    </div>
    <div class="preview-container">
      <div class="poster-grid">
        <div v-for="(poster, index) in previewPosters" :key="index" class="poster-card">
          <div class="poster-image">
            <img :src="poster.image" :alt="poster.title" />
            <div class="poster-overlay">
              <span class="poster-title">{{ poster.title }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const hasGeneratedPosters = ref(false)

// 模拟预览数据
const previewPosters = ref([
  { title: '电影 1', image: 'https://via.placeholder.com/300x450' },
  { title: '电影 2', image: 'https://via.placeholder.com/300x450' },
  { title: '电影 3', image: 'https://via.placeholder.com/300x450' },
  { title: '电影 4', image: 'https://via.placeholder.com/300x450' },
  { title: '电影 5', image: 'https://via.placeholder.com/300x450' },
  { title: '电影 6', image: 'https://via.placeholder.com/300x450' }
])

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
      .poster-card {
        width: 320px;
        height: 180px;
        background: linear-gradient(135deg, #dbeafe, #ede9fe);
        border-radius: 4px;
        transition: transform 0.3s ease;

        .poster-image {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: var(--el-border-radius-base);
          overflow: hidden;
          box-shadow: var(--el-box-shadow-light);
          img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }

        .poster-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 0.75rem;
          background: linear-gradient(transparent, rgba(0, 0, 0, 0.2));
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        &:hover {
          transform: scale(1.05);
          .poster-overlay {
            opacity: 1;
          }
        }
      }
    }
  }
}
</style>
