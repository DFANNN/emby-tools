<template>
  <div class="hero-carousel">
    <!-- 轮播图容器 -->
    <div class="carousel-container" ref="carouselContainer">
      <div
        v-for="(item, index) in carouselItems"
        :key="index"
        class="carousel-item"
        :class="{ active: currentIndex === index }"
        :style="{
          backgroundImage: `url(${item.backdrop_path})`,
          transform: `translateX(${(index - currentIndex) * 100}%)`
        }"
      >
        <!-- 渐变遮罩 -->
        <div class="overlay"></div>

        <!-- 内容区域 -->
        <div class="content">
          <div class="content-wrapper">
            <!-- 评分标签 -->
            <div class="rating-badge">
              <div class="rating-number">{{ item.vote_average?.toFixed(1) || '8.5' }}</div>
              <div class="rating-label">评分</div>
            </div>

            <!-- 标题 -->
            <h1 class="title">{{ item.title || item.name }}</h1>

            <!-- 简介 -->
            <p class="overview">{{ item.overview || '暂无简介' }}</p>

            <!-- 元信息 -->
            <div class="meta-info">
              <div class="meta-item">
                <span class="meta-icon">🎬</span>
                <span class="meta-text">{{ item.media_type === 'movie' ? '电影' : '剧集' }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-icon">📅</span>
                <span class="meta-text">{{ item.release_date?.split('-')[0] || '2024' }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-icon">🏷️</span>
                <span class="meta-text">{{ item.genre_ids?.[0] || '剧情' }}</span>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="actions">
              <button class="btn btn-primary">
                <div class="btn-content">
                  <span class="btn-icon">▶</span>
                  <span class="btn-text">立即观看</span>
                </div>
              </button>
              <button class="btn btn-secondary">
                <div class="btn-content">
                  <span class="btn-icon">❤</span>
                  <span class="btn-text">收藏</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 指示器 -->
    <div class="indicators">
      <button
        v-for="(item, index) in carouselItems"
        :key="index"
        class="indicator"
        :class="{ active: currentIndex === index }"
        @click="goToSlide(index)"
      ></button>
    </div>

    <!-- 导航按钮 -->
    <button class="nav-btn nav-prev" @click="prevSlide">
      <span class="nav-icon">‹</span>
    </button>
    <button class="nav-btn nav-next" @click="nextSlide">
      <span class="nav-icon">›</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// 轮播图数据（模拟TMDB今日趋势数据）
const carouselItems = ref([
  {
    id: 1,
    title: '奥本海默',
    name: '奥本海默',
    overview:
      '讲述了"原子弹之父"罗伯特·奥本海默的传奇人生，以及他参与曼哈顿计划研制原子弹的过程。影片深入探讨了科学、政治、道德和人性的复杂关系。',
    backdrop_path: 'https://image.tmdb.org/t/p/original/kMa1TSDj76zTSleXE7xsuZ4s3i0.jpg',
    vote_average: 8.5,
    media_type: 'movie',
    release_date: '2023-07-21',
    genre_ids: [18, 36]
  },
  {
    id: 2,
    title: '沙丘2',
    name: '沙丘2',
    overview: '保罗·厄崔迪与契妮和弗雷曼人联手，对毁灭他家族的阴谋者展开报复。他必须在至爱和已知宇宙命运之间做出选择。',
    backdrop_path: 'https://image.tmdb.org/t/p/original/uUVQCwBsWdQDMssXv1TRvYKnXgS.jpg',
    vote_average: 8.2,
    media_type: 'movie',
    release_date: '2024-03-01',
    genre_ids: [12, 878]
  },
  {
    id: 3,
    title: '死侍与金刚狼',
    name: '死侍与金刚狼',
    overview: '韦德·威尔逊与金刚狼联手，踏上了一段穿越多元宇宙的冒险之旅，他们将面对前所未有的挑战和敌人。',
    backdrop_path: 'https://image.tmdb.org/t/p/original/by8z9Fe8y7p4jo2YlW2SZDnptyT.jpg',
    vote_average: 7.8,
    media_type: 'movie',
    release_date: '2024-07-26',
    genre_ids: [28, 35, 878]
  }
])

// 当前轮播图索引
const currentIndex = ref(0)
const carouselContainer = ref<HTMLElement>()

// 自动轮播定时器
let autoPlayTimer: number | null = null

// 切换到下一张
const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % carouselItems.value.length
}

// 切换到上一张
const prevSlide = () => {
  currentIndex.value = currentIndex.value === 0 ? carouselItems.value.length - 1 : currentIndex.value - 1
}

// 跳转到指定幻灯片
const goToSlide = (index: number) => {
  currentIndex.value = index
}

// 开始自动播放
const startAutoPlay = () => {
  autoPlayTimer = setInterval(() => {
    nextSlide()
  }, 10000) // 5秒切换一次
}

// 停止自动播放
const stopAutoPlay = () => {
  if (autoPlayTimer) {
    clearInterval(autoPlayTimer)
    autoPlayTimer = null
  }
}

// 组件挂载后开始自动播放
onMounted(() => {
  startAutoPlay()
})

// 组件卸载前清理定时器
onUnmounted(() => {
  stopAutoPlay()
})
</script>

<style scoped>
.hero-carousel {
  position: relative;
  width: 100%;
  height: 80vh;
  min-height: 600px;
  overflow: hidden;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.carousel-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.carousel-item {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0.05) 50%,
    rgba(0, 0, 0, 0.3) 100%
  );
  backdrop-filter: blur(1px);
}

.content {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  padding: 0 8%;
  display: flex;
  align-items: center;
}

.content-wrapper {
  max-width: 700px;
  color: white;
  position: relative;
}

.rating-badge {
  position: absolute;
  top: -80px;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(20px);
  padding: 12px 20px;
  border-radius: 25px;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 2;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.rating-number {
  font-size: 1.8rem;
  font-weight: 800;
  color: #ffd700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.rating-label {
  font-size: 0.85rem;
  opacity: 0.9;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.title {
  font-size: 4rem;
  font-weight: 800;
  line-height: 1.1;
  margin: 0 0 24px 0;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.02em;
}

.overview {
  font-size: 1.3rem;
  line-height: 1.7;
  margin-bottom: 32px;
  opacity: 0.95;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  font-weight: 400;
  max-width: 600px;
}

.meta-info {
  display: flex;
  gap: 24px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.meta-item:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.meta-icon {
  font-size: 1.2rem;
}

.meta-text {
  opacity: 0.95;
  font-weight: 600;
}

.actions {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px 36px;
  border: none;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(20px);
  position: relative;
  overflow: hidden;
  min-width: 160px;
}

.btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.btn:hover::before {
  left: 100%;
}

.btn-primary {
  background: linear-gradient(135deg, #007aff 0%, #5856d6 100%);
  color: white;
  box-shadow: 0 12px 30px rgba(0, 122, 255, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-primary:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 122, 255, 0.5);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
}

.btn-content {
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
  z-index: 1;
}

.btn-icon {
  font-size: 1.3rem;
  transition: transform 0.3s ease;
}

.btn:hover .btn-icon {
  transform: scale(1.1);
}

.btn-text {
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.indicators {
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
  z-index: 3;
}

.indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.5);
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator.active {
  background: white;
  border-color: white;
  transform: scale(1.2);
}

.indicator:hover {
  border-color: white;
  background: rgba(255, 255, 255, 0.3);
}

.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 56px;
  height: 56px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-50%) scale(1.1);
}

.nav-prev {
  left: 24px;
}

.nav-next {
  right: 24px;
}

.nav-icon {
  font-size: 2rem;
  font-weight: 300;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero-carousel {
    height: 70vh;
    min-height: 500px;
    border-radius: 16px;
  }

  .content {
    padding: 0 6%;
  }

  .content-wrapper {
    max-width: 100%;
  }

  .rating-badge {
    top: -60px;
    right: 0;
    padding: 10px 16px;
  }

  .rating-number {
    font-size: 1.5rem;
  }

  .title {
    font-size: 2.8rem;
    margin-bottom: 20px;
  }

  .overview {
    font-size: 1.1rem;
    margin-bottom: 24px;
  }

  .meta-info {
    gap: 16px;
    margin-bottom: 32px;
  }

  .meta-item {
    padding: 6px 12px;
    font-size: 0.9rem;
  }

  .actions {
    flex-direction: column;
    gap: 16px;
  }

  .btn {
    padding: 16px 28px;
    min-width: 140px;
  }

  .nav-btn {
    width: 48px;
    height: 48px;
  }

  .nav-prev {
    left: 16px;
  }

  .nav-next {
    right: 16px;
  }
}

@media (max-width: 480px) {
  .hero-carousel {
    height: 60vh;
    min-height: 400px;
  }

  .content {
    padding: 0 4%;
  }

  .title {
    font-size: 2.2rem;
  }

  .overview {
    font-size: 1rem;
    line-height: 1.6;
  }

  .meta-info {
    flex-direction: column;
    gap: 12px;
  }

  .rating-badge {
    top: -50px;
    padding: 8px 14px;
  }

  .rating-number {
    font-size: 1.3rem;
  }
}
</style>
