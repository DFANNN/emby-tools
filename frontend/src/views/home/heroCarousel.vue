<template>
  <el-carousel :interval="5000" trigger="click" height="550px">
    <el-carousel-item v-for="item in carouselItems" :key="item.id">
      <div class="carousel-item">
        <div class="carousel-item-img">
          <img :src="item.backdrop_path" alt="backdrop" />
        </div>
        <div class="carousel-item-content">
          <div class="content-header">
            <div class="logo-container">
              <img :src="item.logo_path" alt="logo" class="movie-logo" />
            </div>
          </div>

          <div class="content-meta">
            <div class="meta-info">
              <span class="release-date">{{ item.release_date }}</span>
              <span class="separator">•</span>
              <span class="genres">
                <span v-for="(id, index) in item.genre_ids" :key="id">
                  {{ genreMap[id] }}{{ index < item.genre_ids.length - 1 ? ' / ' : '' }}
                </span>
              </span>
              <span class="separator">•</span>
              <span class="rating-score">
                <span class="score-number">{{ item.vote_average.toFixed(1) }}</span>
                <span class="score-number">⭐</span>
              </span>
            </div>
          </div>

          <div class="content-details">
            <span class="movie-title">{{ `「 ${item.name}  」` }}</span>
            <span class="movie-overview">{{ item.overview }}</span>
          </div>
        </div>
      </div>
    </el-carousel-item>
  </el-carousel>
</template>

<script setup lang="ts">
const aaa = ref(8.5)

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

// 轮播图数据（模拟TMDB今日趋势数据）
const carouselItems = ref([
  {
    id: 1,
    title: '奥本海默奥本海默奥本海默奥本海默奥本海默',
    name: '奥本海默',
    overview:
      '讲述了"原子弹之父"罗伯特·奥本海默的传奇人生，以及他参与曼哈顿计划研制原子弹的过程。影片深入探讨了科学、政治、道德和人性的复杂关系。',
    backdrop_path: 'https://image.tmdb.org/t/p/original/kMa1TSDj76zTSleXE7xsuZ4s3i0.jpg',
    logo_path: 'https://image.tmdb.org/t/p/original/dZMplgKUsVYddUdv3T2BW4ZS5jQ.png',
    vote_average: 3.5,
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
    logo_path: 'https://image.tmdb.org/t/p/original/y9oRBehcnEwGmx9x4lnX821MNPH.png',
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
    logo_path: 'https://image.tmdb.org/t/p/original/kdijpG38B4C831l8aD7dQSY7DNj.png',
    vote_average: 7.8,
    media_type: 'movie',
    release_date: '2024-07-26',
    genre_ids: [28, 35, 878]
  }
])
</script>

<style scoped lang="scss">
.carousel-item {
  position: relative;
  width: 100%;
  height: 100%;
  .carousel-item-img {
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
    z-index: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 24px;
    color: #fff;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0) 40%, rgba(0, 0, 0, 0.65) 100%);
    .content-header {
      margin-bottom: 10px;
      .logo-container {
        width: 350px;
        height: 120px;
        margin-right: 40px;
        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.7));
        }
      }
      .rating-score {
        display: inline-flex;
        align-items: baseline;

        .score-number {
          font-size: 16px;
          font-weight: 700;
          color: #ffd700;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
          line-height: 1;
        }

        .score-max {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 500;
          margin-left: 2px;
        }
      }
    }
    .content-meta {
      margin-bottom: 10px;
      .meta-info {
        font-size: 14px;
        color: #fff;
        .release-date {
          font-weight: bold;
        }
        .separator {
          margin: 0 5px;
        }
        .genres {
          font-weight: bold;
        }
      }
    }
    .content-details {
      font-size: 16px;
      line-height: 1.6;
      color: #fff;
      opacity: 0.9;
    }

    // 响应式设计
    @media (max-width: 768px) {
      padding: 30px 20px;

      .content-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 15px;

        .logo-container {
          width: 280px;
          height: 90px;
          margin-right: 0;
        }

        .rating-score {
          .score-number {
            font-size: 14px;
          }

          .score-max {
            font-size: 12px;
          }
        }
      }
    }
  }
}
</style>
