<!-- 排行榜面板组件 -->
<template>
  <div class="top-charts-Panel-container">
    <div class="panel-header" :style="headerStyle">
      <EarLeftIcon class="ear-icon" />
      <h3 class="panel-title">{{ props.title }}</h3>
      <EarRightIcon class="ear-icon" />
    </div>
    <div class="panel-content">
      <div class="content-left">
        <div class="hero-media">
          <img :src="topItem?.backdrop_path || topItem?.poster_path" alt="" />
        </div>
        <div class="hero-info">
          <div class="rank-badge">TOP 1</div>
          <div class="hero-title">{{ displayName(topItem) }}</div>
          <div class="hero-meta">
            <span>{{ displayReleaseDate(topItem) }}</span>
            <span class="dot">·</span>
            <span class="score">{{ displayScore(topItem) }} ⭐</span>
          </div>
          <div class="hero-overview">{{ topItem?.overview }}</div>
        </div>
      </div>
      <div class="content-right">
        <div v-for="(item, index) in topTwoToSixList" :key="item.id" class="rank-item">
          <div class="rank-num" :class="{ hot: index < 3 }">{{ index + 2 }}</div>
          <img class="thumb" :src="item.poster_path" alt="" />
          <div class="rank-info">
            <div class="name">{{ displayName(item) }}</div>
            <div class="meta">
              <span class="date">{{ displayReleaseDate(item) }}</span>
              <span class="score">{{ displayScore(item) }} ⭐</span>
            </div>
          </div>
        </div>
        <div class="rank-more">
          <el-button link type="primary" @click="checkMore">查看更多</el-button>
        </div>
      </div>
    </div>

    <TopChartList :title="props.title" ref="topChartListRef" />
  </div>
</template>

<script setup lang="ts">
import EarLeftIcon from '@/components/icon/EarLeftIcon.vue'
import EarRightIcon from '@/components/icon/EarRightIcon.vue'
import TopChartList from '@/components/TopChartList.vue'
import type { ITrendItem } from '@/types/dailyRecommendation'

const props = defineProps({
  title: {
    required: true,
    type: String
  },
  topChartList: {
    required: true,
    type: Array as PropType<ITrendItem[]>
  }
})

const layoutStore = useLayoutStore()
const topChartListRef = useTemplateRef('topChartListRef')

// 动态设置背景和背景渐变
const headerStyle = computed(() => {
  const bg = props.topChartList[0]?.poster_path || ''
  let htmlClassName = ''
  if (layoutStore.themeMode === 'auto') {
    htmlClassName = document.documentElement.className
  } else {
    htmlClassName = layoutStore.themeMode
  }
  const overlay =
    htmlClassName === 'light'
      ? 'linear-gradient(180deg, rgba(255,255,255,0.0), rgba(255,255,255,0.75))'
      : 'linear-gradient(180deg, rgba(0,0,0,0.0), rgba(0,0,0,0.45))'
  return {
    backgroundImage: `${overlay},url(${bg})`
  }
})

// top1的数据
const topItem = computed(() => props.topChartList[0])
// top1-6
const topTwoToSixList = computed(() => props.topChartList.slice(1, 6))
// 显示名称
const displayName = (item: ITrendItem) => {
  return item?.title || item?.name || item?.original_name || '—'
}
// 显示时间
const displayReleaseDate = (item: ITrendItem) => item?.release_date || item?.first_air_date || '—'
// 显示名称
const displayScore = (item: ITrendItem) => ((item?.vote_average || 0) as number).toFixed(1)

const checkMore = () => {
  topChartListRef.value?.showDialog()
}
</script>

<style scoped lang="scss">
.top-charts-Panel-container {
  border-radius: 12px;
  overflow: hidden;
  .panel-header {
    position: relative;
    height: 180px;
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-size: cover;
    background-position: center;
    // 渐变过渡到下半部分纯色背景
    &::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: -1px;
      height: 48px;
      background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, var(--el-bg-color-overlay) 100%);
      pointer-events: none;
    }
    .ear-icon {
      width: 30px;
      height: 30px;
    }
    .panel-title {
      font-size: 22px;
      font-weight: 800;
      margin: 0;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
      color: var(--el-text-color-primary);
    }
  }
  .panel-content {
    display: grid;
    grid-template-columns: 1.2fr 1fr;
    gap: 1rem;
    padding: 12px 16px;

    .content-left {
      border-radius: 12px;
      overflow: hidden;
      .hero-media {
        width: 100%;
        aspect-ratio: 16 / 9;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
      }
      .hero-info {
        padding: 14px;
        display: flex;
        flex-direction: column;
        gap: 8px;

        .rank-badge {
          align-self: flex-start;
          font-weight: 800;
          font-size: 12px;
          padding: 2px 8px;
          border-radius: 999px;
          background: rgba(255, 215, 0, 0.18);
          color: #ffd700;
          border: 1px solid rgba(255, 215, 0, 0.35);
        }

        .hero-title {
          font-size: 18px;
          font-weight: 800;
          line-height: 1.35;
        }

        .hero-meta {
          font-size: 12px;
          color: var(--el-text-color-secondary);

          .dot {
            margin: 0 6px;
            opacity: 0.6;
          }

          .score {
            color: #ffd700;
            font-weight: 700;
          }
        }

        .hero-overview {
          font-size: 12px;
          color: var(--text-secondary);
          opacity: 0.9;
          line-height: 1.55;
          max-height: 3.1em;
          display: -webkit-box;
          line-clamp: 2;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      }
    }
    .content-right {
      display: flex;
      flex-direction: column;
      gap: 8px;
      .rank-item {
        display: grid;
        grid-template-columns: 36px 48px 1fr;
        gap: 10px;
        padding: 8px;
        border-radius: 10px;
        align-items: center;
        background: var(--el-bg-color-page);
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
          transform: translateY(-2px);
        }
        .rank-num {
          font-weight: 900;
          font-size: 18px;
          text-align: center;
          opacity: 0.9;

          &.hot {
            color: #ffd700;
            text-shadow: 0 0 18px rgba(255, 215, 0, 0.35);
          }
        }
        .thumb {
          width: 48px;
          height: 64px;
          object-fit: cover;
          border-radius: 6px;
        }
        .rank-info {
          display: flex;
          flex-direction: column;
          gap: 6px;
          .name {
            font-weight: 700;
            font-size: 14px;
            line-height: 1.35;
            display: -webkit-box;
            line-clamp: 1;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .meta {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 12px;
            color: var(--el-text-color-secondary);
            .score {
              color: #ffd700;
              font-weight: 700;
            }
          }
        }
      }
      .rank-more {
        display: flex;
        justify-content: center;
        padding: 6px 0 2px;
      }
    }
  }
}
</style>
