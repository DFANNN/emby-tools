<template>
  <div class="preview-poster-container">
    <div class="preview-header">
      <h2>预览效果</h2>
      <el-button type="success" @click="uploadPoster" :disabled="!hasGeneratedPosters">上传到 Emby</el-button>
    </div>
    <div class="preview-container">
      <div class="poster-grid">
        <div v-for="(poster, index) in previewPosters" :key="index" class="poster-item">
          <PosterOne :poster="poster" />
          <div class="poster-title">{{ poster.title }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PosterOne from '@/views/embyPoster/posterLayout/posterOne.vue'
const hasGeneratedPosters = ref(false)

// 精选渐变色数组
const gradients = [
  'linear-gradient(120deg, #3a7bd5 0%, #00d2ff 100%)',
  'linear-gradient(120deg, #ff9966 0%, #ff5e62 100%)',
  'linear-gradient(120deg, #43cea2 0%, #185a9d 100%)',
  'linear-gradient(120deg, #a18cd1 0%, #fbc2eb 100%)',
  'linear-gradient(120deg, #f7971e 0%, #ffd200 100%)',
  'linear-gradient(120deg, #96fbc4 0%, #f9f586 100%)',
  'linear-gradient(120deg, #ff512f 0%, #2196f3 100%)',
  'linear-gradient(120deg, #f953c6 0%, #b91d73 100%)',
  'linear-gradient(120deg, #00c3ff 0%, #ffff1c 100%)',
  'linear-gradient(120deg, #f7797d 0%, #FBD786 100%)',
  'linear-gradient(120deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(120deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(120deg, #30cfd0 0%, #330867 100%)',
  'linear-gradient(120deg, #5ee7df 0%, #b490ca 100%)',
  'linear-gradient(120deg, #f6d365 0%, #fda085 100%)',
  'linear-gradient(120deg, #fbc2eb 0%, #a6c1ee 100%)',
  'linear-gradient(120deg, #fdcbf1 0%, #e6dee9 100%)',
  'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)',
  'linear-gradient(120deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%)',
  'linear-gradient(120deg, #fddb92 0%, #d1fdff 100%)',
  'linear-gradient(120deg, #fcb69f 0%, #ffecd2 100%)',
  'linear-gradient(120deg, #c471f5 0%, #fa71cd 100%)',
  'linear-gradient(120deg, #48c6ef 0%, #6f86d6 100%)',
  'linear-gradient(120deg, #9795f0 0%, #fbc7d4 100%)',
  'linear-gradient(120deg, #f5f7fa 0%, #c3cfe2 100%)',
  'linear-gradient(120deg, #f9d423 0%, #ff4e50 100%)',
  'linear-gradient(120deg, #00b4db 0%, #0083b0 100%)',
  'linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%)',
  'linear-gradient(120deg, #f093fb 0%, #f5576c 100%)'
]

function getRandomGradient() {
  const idx = Math.floor(Math.random() * gradients.length)
  return gradients[idx]
}

// 模拟预览数据
const previewPosters = ref([
  {
    title: '国产剧',
    subtitle: 'TVSHOW',
    imageUrls: [
      'https://picsum.photos/200/300?random=1',
      'https://picsum.photos/200/300?random=2',
      'https://picsum.photos/200/300?random=3',
      'https://picsum.photos/200/300?random=4'
    ],
    backgroundGradient: getRandomGradient()
  },
  {
    title: '动漫',
    subtitle: 'ANIME',
    imageUrls: [
      'https://picsum.photos/200/300?random=5',
      'https://picsum.photos/200/300?random=6',
      'https://picsum.photos/200/300?random=7',
      'https://picsum.photos/200/300?random=8'
    ],
    backgroundGradient: getRandomGradient()
  },
  {
    title: '电影',
    subtitle: 'MOVIE',
    imageUrls: [
      'https://picsum.photos/200/300?random=9',
      'https://picsum.photos/200/300?random=10',
      'https://picsum.photos/200/300?random=11',
      'https://picsum.photos/200/300?random=12'
    ],
    backgroundGradient: getRandomGradient()
  },
  {
    title: 'Netflix & Max',
    subtitle: 'TVSHOW',
    imageUrls: [
      'https://picsum.photos/200/300?random=13',
      'https://picsum.photos/200/300?random=14',
      'https://picsum.photos/200/300?random=15',
      'https://picsum.photos/200/300?random=16'
    ],
    backgroundGradient: getRandomGradient()
  }
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

      .poster-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
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
