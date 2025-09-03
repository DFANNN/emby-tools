<template>
  <div class="top-rated-panel">
    <div class="panel-header" :style="headerStyle">
      <h3 class="panel-title">{{ title }}</h3>
      <el-button link type="primary" class="more-btn" @click="$emit('more')">查看更多</el-button>
    </div>
    <div class="panel-content">
      <div class="cards">
        <div v-for="item in previewList" :key="item.id" class="card" @click="$emit('select', item)">
          <div class="poster">
            <img :src="item.poster_path" :alt="item.title || item.name || item.original_name" />
          </div>
          <div class="info">
            <div class="name">{{ item.title || item.name || item.original_name }}</div>
            <div class="meta">
              <span class="date">{{ item.release_date || item.first_air_date }}</span>
              <span class="score">⭐ {{ (item.vote_average || 0).toFixed(1) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ITrendItem } from '@/types/dailyRecommendation'

const props = defineProps<{
  title: string
  list: ITrendItem[]
}>()

const previewList = computed(() => props.list.slice(0, 5))

const headerStyle = computed(() => {
  const bg = previewList.value[0]?.poster_path || ''
  return {
    backgroundImage: bg ? `linear-gradient(180deg, rgba(0,0,0,.0), rgba(0,0,0,.45)), url(${bg})` : undefined
  }
})
</script>

<style scoped lang="scss">
.top-rated-panel {
  position: relative;
  height: 420px;
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

@media (max-width: 1200px) {
  .top-rated-panel {
    height: auto;

    .panel-content .cards {
      grid-template-columns: repeat(3, 1fr);
    }
  }
}
</style>
