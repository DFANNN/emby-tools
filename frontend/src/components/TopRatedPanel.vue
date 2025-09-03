<template>
  <div class="top-rated-panel">
    <div class="panel-header" :style="headerStyle">
      <h3 class="panel-title">{{ title }}</h3>
      <el-button v-if="layoutComputed !== 'ranked'" link type="primary" class="more-btn" @click="$emit('more')"
        >查看更多</el-button
      >
    </div>

    <!-- ranked 布局：左侧焦点大卡 + 右侧排行榜 -->
    <div v-if="layoutComputed === 'ranked'" class="panel-content ranked">
      <div class="hero" v-if="topItem" @click="$emit('select', topItem)">
        <div class="hero-media">
          <img :src="topItem.backdrop_path || topItem.poster_path" :alt="displayName(topItem)" />
        </div>
        <div class="hero-info">
          <div class="rank-badge">TOP 1</div>
          <div class="hero-title">{{ displayName(topItem) }}</div>
          <div class="hero-meta">
            <span>{{ topItem.release_date || topItem.first_air_date || '—' }}</span>
            <span class="dot">·</span>
            <span class="score">⭐ {{ displayScore(topItem) }}</span>
          </div>
          <div class="hero-overview" v-if="topItem.overview">{{ topItem.overview }}</div>
        </div>
      </div>

      <div class="rank-list">
        <div v-for="(item, idx) in rankedList" :key="item.id" class="rank-item" @click="$emit('select', item)">
          <div class="rank-num" :class="{ hot: idx < 3 }">{{ idx + 2 }}</div>
          <img class="thumb" :src="item.poster_path" :alt="displayName(item)" loading="lazy" />
          <div class="rank-info">
            <div class="name">{{ displayName(item) }}</div>
            <div class="meta">
              <span class="date">{{ item.release_date || item.first_air_date || '—' }}</span>
              <span class="score">⭐ {{ displayScore(item) }}</span>
            </div>
          </div>
        </div>
        <div class="rank-more">
          <el-button link type="primary" @click="$emit('more')">查看更多</el-button>
        </div>
      </div>
    </div>

    <!-- grid 卡片网格（保留原有风格） -->
    <div v-else class="panel-content">
      <div class="cards">
        <div v-for="item in previewList" :key="item.id" class="card" @click="$emit('select', item)">
          <div class="poster">
            <img :src="item.poster_path" :alt="displayName(item)" loading="lazy" />
          </div>
          <div class="info">
            <div class="name">{{ displayName(item) }}</div>
            <div class="meta">
              <span class="date">{{ item.release_date || item.first_air_date || '—' }}</span>
              <span class="score">⭐ {{ displayScore(item) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ITrendItem } from '@/types/dailyRecommendation'

const props = defineProps<{
  title: string
  list: ITrendItem[]
  layout?: 'grid' | 'ranked'
}>()

const layoutComputed = computed(() => props.layout ?? 'ranked')

const previewList = computed(() =>
  layoutComputed.value === 'ranked' ? props.list.slice(0, 6) : props.list.slice(0, 5)
)

const topItem = computed(() => (layoutComputed.value === 'ranked' ? previewList.value[0] : null))
const rankedList = computed(() => (layoutComputed.value === 'ranked' ? previewList.value.slice(1) : []))

const headerStyle = computed(() => {
  const bg = previewList.value[0]?.poster_path || ''
  return {
    backgroundImage: bg ? `linear-gradient(180deg, rgba(0,0,0,.0), rgba(0,0,0,.45)), url(${bg})` : undefined
  }
})

const displayName = (item: ITrendItem) => item.title || item.name || item.original_name || '—'
const displayScore = (item: ITrendItem) => ((item.vote_average || 0) as number).toFixed(1)
</script>

<style scoped lang="scss">
.top-rated-panel {
  position: relative;
  // height: 420px;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  color: #fff;

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
      background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, #0e0e0e 100%);
      pointer-events: none;
    }

    .panel-title {
      font-size: 22px;
      font-weight: 800;
      margin: 0;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
    }

    .more-btn {
      position: absolute;
      right: 16px;
      top: 14px;
    }
  }

  .panel-content {
    background: #0e0e0e;
    padding: 12px 16px 16px;
    flex: 1;
    display: flex;
    align-items: stretch;

    .cards {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 12px;
      width: 100%;
      align-content: start;

      .card {
        background: rgba(255, 255, 255, 0.04);
        border-radius: 10px;
        overflow: hidden;
        cursor: pointer;
        transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
        display: flex;
        flex-direction: column;

        &:hover {
          transform: translateY(-3px);
          background: rgba(255, 255, 255, 0.08);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
        }

        .poster {
          width: 100%;
          aspect-ratio: 2 / 3;
          background: #111;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
          }
        }

        .info {
          padding: 10px;

          .name {
            font-weight: 700;
            font-size: 14px;
            line-height: 1.35;
            margin-bottom: 8px;
            display: -webkit-box;
            line-clamp: 2;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .meta {
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            color: #ddd;

            .score {
              color: #ffd700;
              font-weight: 700;
              background: rgba(255, 215, 0, 0.15);
              border: 1px solid rgba(255, 215, 0, 0.35);
              padding: 2px 8px;
              border-radius: 999px;
            }
          }
        }
      }
    }
  }
}

/* ranked 布局样式 */
.panel-content.ranked {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 14px;

  .hero {
    position: relative;
    border-radius: 12px;
    overflow: hidden;
    background: #111;
    cursor: pointer;
    display: flex;
    flex-direction: column;

    .hero-media {
      position: relative;
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
        color: #ddd;

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
        color: #eaeaea;
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

  .rank-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    overflow: hidden auto;

    .rank-item {
      display: grid;
      grid-template-columns: 36px 48px 1fr;
      gap: 10px;
      align-items: center;
      padding: 8px;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.04);
      cursor: pointer;
      transition: transform 0.2s ease, background 0.2s ease;

      &:hover {
        transform: translateY(-2px);
        background: rgba(255, 255, 255, 0.08);
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
        background: #111;
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
          gap: 10px;
          font-size: 12px;
          color: #ddd;

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

@media (max-width: 1200px) {
  .top-rated-panel {
    height: auto;

    .panel-content .cards {
      grid-template-columns: repeat(3, 1fr);
    }
  }
}
</style>
