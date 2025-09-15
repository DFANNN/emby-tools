<template>
  <div>
    <!-- 加载骨架屏 -->
    <div v-if="loading" class="carousel-skeleton" style="height: 70vh">
      <div class="skeleton-bg">
        <el-skeleton animated>
          <template #template>
            <el-skeleton-item variant="image" class="bg-image" />
          </template>
        </el-skeleton>
      </div>
      <div class="skeleton-content">
        <div class="content-header">
          <div class="logo-container">
            <el-skeleton animated>
              <template #template>
                <el-skeleton-item variant="image" class="logo-image" />
              </template>
            </el-skeleton>
          </div>
        </div>
        <div class="content-body">
          <el-skeleton animated>
            <template #template>
              <el-skeleton-item variant="text" class="title-line" />
              <div class="meta-lines">
                <el-skeleton-item variant="text" style="width: 80px; height: 16px" />
                <el-skeleton-item variant="text" style="width: 12px; height: 16px" />
                <el-skeleton-item variant="text" style="width: 180px; height: 16px" />
                <el-skeleton-item variant="text" style="width: 12px; height: 16px" />
                <el-skeleton-item variant="text" style="width: 90px; height: 28px; border-radius: 25px" />
              </div>
              <div class="overview-lines">
                <el-skeleton-item variant="text" style="width: 90%" />
                <el-skeleton-item variant="text" style="width: 85%" />
                <el-skeleton-item variant="text" style="width: 70%" />
              </div>
            </template>
          </el-skeleton>
        </div>
      </div>
    </div>

    <!-- 错误态 -->
    <div v-else-if="error" class="carousel-empty" style="height: 70vh">
      <div class="empty-title">加载失败</div>
      <div class="empty-desc">{{ error }}</div>
      <el-button type="primary" size="small" @click="handleRetry">重试</el-button>
    </div>

    <!-- 空态 -->
    <div v-else-if="!trendList.length" class="carousel-empty" style="height: 70vh">
      <div class="empty-title">暂无数据</div>
      <div class="empty-desc">稍后再来看看，或点击重试</div>
      <el-button type="primary" size="small" @click="handleRetry">重试</el-button>
    </div>

    <!-- 正常内容 -->
    <el-carousel v-else :interval="10000" trigger="click" height="70vh">
      <el-carousel-item v-for="item in trendList" :key="item.id" @click="openTmdb(item)" class="carousel-item-wrapper">
        <div class="carousel-item">
          <div class="carousel-item-background image-fade" :class="{ 'is-loaded': isBackdropLoaded(item.id) }">
            <el-image
              :src="item.backdrop_path"
              fit="cover"
              style="width: 100%; height: 100%"
              @load="onBackdropLoad(item.id)"
            >
              <template #placeholder>
                <el-skeleton-item variant="image" class="bg-image" />
              </template>
              <template #error>
                <div class="bg-fallback"></div>
              </template>
            </el-image>
          </div>
          <div class="carousel-item-content">
            <div class="content-header">
              <div class="logo-container">
                <el-image
                  :src="item.logo_path"
                  fit="contain"
                  style="width: 100%; height: 100%"
                  class="image-fade"
                  :class="{ 'is-loaded': isLogoLoaded(item.id) }"
                  @load="onLogoLoad(item.id)"
                >
                  <template #placeholder>
                    <el-skeleton-item variant="image" class="logo-image" />
                  </template>
                  <template #error>
                    <div class="logo-fallback"></div>
                  </template>
                </el-image>
              </div>
            </div>
            <div class="content-body">
              <div class="movie-title">{{ `「 ${item.name || item.title || item.original_name}  」` }}</div>
              <div class="movie-meta">
                <div class="movie-release-date">{{ item.first_air_date || item.release_date }}</div>
                <div class="separator">•</div>
                <div class="movie-genres">
                  <span v-for="(id, index) in item.genre_ids" :key="id">
                    {{ genreMap[id] }}{{ index < item.genre_ids.length - 1 ? ' / ' : '' }}
                  </span>
                </div>
                <div class="separator">•</div>
                <div class="movie-rating">
                  <span class="score-icon">⭐</span>
                  <span class="score-number">{{ item.vote_average.toFixed(1) }}</span>
                </div>
              </div>
              <div class="movie-overview">{{ item.overview.trim() }}</div>
            </div>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script setup lang="ts">
import { openTmdb } from '@/utils/utils'
import { todayTrend } from '@/api/dailyRecommendation'
import type { ITrendItem } from '@/types/dailyRecommendation'

const trendList = ref<ITrendItem[]>([])
const loading = ref<boolean>(false)
const error = ref<string>('')

// 图片加载淡入控制
const loadedBackdropIds = ref<Set<number>>(new Set())
const loadedLogoIds = ref<Set<number>>(new Set())
const onBackdropLoad = (id: number) => loadedBackdropIds.value.add(id)
const onLogoLoad = (id: number) => loadedLogoIds.value.add(id)
const isBackdropLoaded = (id: number) => loadedBackdropIds.value.has(id)
const isLogoLoaded = (id: number) => loadedLogoIds.value.has(id)

// 电影/电视剧类型
const genreMap: Record<number, string> = {
  // movie
  28: '动作',
  12: '冒险',
  16: '动画',
  35: '喜剧',
  80: '犯罪',
  99: '纪录',
  18: '剧情',
  10751: '家庭',
  14: '奇幻',
  36: '历史',
  27: '恐怖',
  10402: '音乐',
  9648: '悬疑',
  10749: '爱情',
  878: '科幻',
  10770: '电视电影',
  53: '惊悚',
  10752: '战争',
  37: '西部',

  // tv
  10759: '动作冒险',
  10762: '儿童',
  10763: '新闻',
  10764: '真人秀',
  10765: '科幻 & 奇幻',
  10766: '肥皂剧',
  10767: '脱口秀',
  10768: '战争与政治'
}

const getTrendList = async () => {
  loading.value = true
  error.value = ''
  try {
    const { data: res } = await todayTrend()
    if (res.code === 200) {
      trendList.value = res.data
    } else {
      error.value = res.message || '加载失败'
    }
  } catch (e) {
    error.value = '请求失败或超时，请重试'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  getTrendList()
})

const handleRetry = () => {
  getTrendList()
}
</script>

<style scoped lang="scss">
.carousel-item-wrapper {
  cursor: pointer;
}
.carousel-item {
  position: relative;
  width: 100%;
  height: 100%;

  .carousel-item-background {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .carousel-item-content {
    position: relative;
    height: 100%;
    z-index: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    color: #fff;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.4) 40%, rgba(0, 0, 0, 0.85) 100%);
    padding: 2rem 0;

    .content-header {
      padding: 0 3rem;
      display: flex;
      justify-content: flex-end;
      margin-bottom: 1rem;

      .logo-container {
        width: 220px;
        height: 110px;
        transition: transform 0.3s ease;

        &:hover {
          transform: scale(1.05);
        }

        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }
    }

    .content-body {
      padding: 0 3rem 2rem;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;

      .movie-title {
        font-size: 2.2rem;
        margin-bottom: 1rem;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-rendering: optimizeLegibility;
        font-weight: 700;
        margin-bottom: 1.2rem;
        text-shadow: 0 2px 6px rgba(0, 0, 0, 0.9);
        letter-spacing: 0.5px;
        line-height: 1.2;
        color: #ffffff;
        font-smooth: never;
      }

      .movie-meta {
        font-size: 16px;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 12px;
        margin-bottom: 1.5rem;

        .movie-release-date {
          font-weight: 600;
          color: #f0f0f0;
        }

        .separator {
          color: rgba(255, 255, 255, 0.7);
          font-weight: 400;
          font-size: 18px;
        }

        .movie-genres {
          font-weight: 500;
          color: #e0e0e0;
        }

        .movie-rating {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 215, 0, 0.2);
          padding: 8px 16px;
          border-radius: 25px;
          border: 1px solid rgba(255, 215, 0, 0.4);
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;

          &:hover {
            background: rgba(255, 215, 0, 0.25);
            border-color: rgba(255, 215, 0, 0.5);
            transform: translateY(-2px);
          }

          .score-number {
            font-size: 18px;
            font-weight: 700;
            color: #ffd700;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.6);
          }

          .score-icon {
            font-size: 16px;
            color: #ffd700;
          }
        }
      }

      .movie-overview {
        font-size: 17px;
        line-height: 1.8;
        margin: 0;
        display: -webkit-box;
        line-clamp: 3;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
        color: #f5f5f5;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.7);
        max-width: 600px;
      }
    }

    // 响应式设计 - 桌面端优化
    @media (max-width: 1440px) {
      padding: 1.8rem 0;

      .content-header {
        padding: 0 2.5rem;

        .logo-container {
          width: 200px;
          height: 100px;
        }
      }

      .content-body {
        padding: 0 2.5rem 1.8rem;

        .movie-title {
          font-size: 2.3rem;
          margin-bottom: 1.1rem;
        }

        .movie-meta {
          font-size: 15.5px;
          gap: 11px;
          margin-bottom: 1.3rem;
        }

        .movie-overview {
          font-size: 16.5px;
          max-width: 550px;
        }
      }
    }

    @media (max-width: 1200px) {
      padding: 1.5rem 0;

      .content-header {
        padding: 0 2rem;

        .logo-container {
          width: 180px;
          height: 90px;
        }
      }

      .content-body {
        padding: 0 2rem 1.5rem;

        .movie-title {
          font-size: 2.2rem;
          margin-bottom: 1rem;
        }

        .movie-meta {
          font-size: 15px;
          gap: 10px;
          margin-bottom: 1.2rem;
        }

        .movie-overview {
          font-size: 16px;
          max-width: 500px;
        }
      }
    }

    @media (min-width: 1921px) {
      padding: 2.5rem 0;

      .content-header {
        padding: 0 4rem;

        .logo-container {
          width: 280px;
          height: 140px;
        }
      }

      .content-body {
        padding: 0 4rem 2.5rem;

        .movie-title {
          font-size: 3rem;
          margin-bottom: 1.5rem;
        }

        .movie-meta {
          font-size: 18px;
          gap: 15px;
          margin-bottom: 2rem;
        }

        .movie-overview {
          font-size: 19px;
          line-height: 1.9;
          max-width: 700px;
        }
      }
    }
  }
}

.image-fade :deep(.el-image__inner) {
  opacity: 0;
  transform: scale(1.02);
  transition: opacity 380ms ease, transform 6s ease;
}
.image-fade.is-loaded :deep(.el-image__inner) {
  opacity: 1;
  transform: scale(1.08);
}

/* 激活页内容淡入 */
:deep(.el-carousel__item.is-active) .carousel-item-content {
  animation: contentFadeIn 480ms ease both;
}
@keyframes contentFadeIn {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.carousel-skeleton {
  position: relative;
  width: 100%;
  height: 70vh;
  overflow: hidden;

  .skeleton-bg {
    position: absolute;
    inset: 0;
    .bg-image {
      width: 100%;
      height: 100%;
      display: block;
    }
  }

  .skeleton-content {
    position: relative;
    z-index: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.35) 40%, rgba(0, 0, 0, 0.8) 100%);

    .content-header {
      padding: 0 3rem;
      display: flex;
      justify-content: flex-end;
      margin-top: 1rem;

      .logo-container {
        width: 220px;
        height: 110px;
        .logo-image {
          width: 100%;
          height: 100%;
          border-radius: 8px;
        }
      }
    }

    .content-body {
      padding: 0 3rem 2rem;
      .title-line {
        width: 420px;
        height: 36px;
        border-radius: 6px;
        margin-bottom: 16px;
      }

      .meta-lines {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 18px;
      }

      .overview-lines {
        display: grid;
        gap: 10px;
        max-width: 600px;
      }
    }
  }
}

/* 骨架闪光，柔和一些 */
.carousel-skeleton :deep(.el-skeleton__item) {
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.06));
  background-size: 200% 100%;
  animation: shimmer 1.6s ease-in-out infinite;
}
@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.carousel-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  text-align: center;
  background: var(--el-bg-color);
  color: var(--el-text-color-secondary);

  .empty-title {
    font-size: 18px;
    font-weight: 700;
    color: var(--el-text-color-primary);
  }

  .empty-desc {
    font-size: 13px;
  }
}
</style>
