<template>
  <el-carousel :interval="10000" trigger="click" height="70vh">
    <el-carousel-item v-for="item in trendList" :key="item.id" class="carousel-item-wrapper">
      <div class="carousel-item">
        <div class="carousel-item-background">
          <img :src="item.backdrop_path" alt="backdrop" />
        </div>
        <div class="carousel-item-content">
          <div class="content-header">
            <div class="logo-container">
              <img :src="item.logo_path" alt="" />
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
</template>

<script setup lang="ts">
import { todayTrend } from '@/api/dailyRecommendation'
import type { ITrendItem } from '@/types/dailyRecommendation'

const trendList = ref<ITrendItem[]>([])

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
  const { data: res } = await todayTrend()
  if (res.code === 200) {
    trendList.value = res.data
  }
}

onMounted(() => {
  getTrendList()
})
</script>

<style scoped lang="scss">
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
</style>
