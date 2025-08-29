<template>
  <div class="watch-stats-container">
    <div class="header">
      <span class="header-icon">📺</span>
      <h3>观看统计</h3>
      <el-tag :type="layoutStore.linkEmbyStatus ? 'success' : 'info'" size="small">{{
        layoutStore.linkEmbyStatus ? '统计中' : '未连接'
      }}</el-tag>
    </div>
    <div class="content">
      <div class="watch-overview">
        <div class="watch-total">{{ props.watchInfo.TotalTime }}小时</div>
        <div class="watch-label">总观看时长</div>
        <!-- <div class="watch-count">89部已观看</div> -->
      </div>
      <div class="watch-categories">
        <div class="category-item">
          <span>电影</span>
          <el-progress :percentage="moviePlayTimePercent" :stroke-width="6" color="#1890ff" />
          <span class="category-time">{{ props.watchInfo.MovieTime }}小时</span>
        </div>

        <div class="category-item">
          <span>剧集</span>
          <el-progress :percentage="episodePlayTimePercent" :stroke-width="6" color="#52c41a" />
          <span class="category-time">{{ props.watchInfo.EpisodeTime }}小时</span>
        </div>

        <div class="category-item">
          <span>音乐</span>
          <el-progress :percentage="audioPlayTimePercent" :stroke-width="6" color="#faad14" />
          <span class="category-time">{{ props.watchInfo.AudioTime }}小时</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { EmbyPlayTimeInfoType } from '@/types/home'

const layoutStore = useLayoutStore()

const moviePlayTimePercent = computed(() => {
  if (!props.watchInfo.MovieTime) return 0
  return Number(((props.watchInfo.MovieTime / props.watchInfo.TotalTime) * 100).toFixed(2))
})
const episodePlayTimePercent = computed(() => {
  if (!props.watchInfo.EpisodeTime) return 0
  return Number(((props.watchInfo.EpisodeTime / props.watchInfo.TotalTime) * 100).toFixed(2))
})
const audioPlayTimePercent = computed(() => {
  if (!props.watchInfo.AudioTime) return 0
  return Number(((props.watchInfo.AudioTime / props.watchInfo.TotalTime) * 100).toFixed(2))
})

const props = defineProps({
  watchInfo: {
    required: true,
    type: Object as PropType<EmbyPlayTimeInfoType>
  }
})
</script>

<style scoped lang="scss">
.watch-stats-container {
  background: var(--el-bg-color-overlay);
  border-radius: var(--el-border-radius-base);
  padding: 1.5rem;
  box-shadow: var(--el-box-shadow-lighter);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--el-box-shadow-light);
  }

  .header {
    display: flex;
    align-items: center;
    margin-bottom: 1.5rem;
    .header-icon {
      font-size: 1.5rem;
      margin-right: 0.75rem;
    }
    h3 {
      color: var(--el-text-color-primary);
      font-size: 1.25rem;
      font-weight: 600;
      flex: 1;
    }
  }

  .content {
    .watch-overview {
      display: flex;
      flex-direction: column;
      align-items: center;
      .watch-total {
        font-size: 2rem;
        font-weight: 700;
        color: var(--el-color-primary);
      }
      .watch-label {
        font-size: 0.875rem;
        color: var(--el-text-color-secondary);
        margin-bottom: 0.5rem;
      }
      .watch-count {
        font-size: 0.875rem;
        color: #52c41a;
      }
    }
    .watch-categories {
      margin-bottom: 1.5rem;

      .category-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;

        span:first-child {
          width: 40px;
          font-size: 0.875rem;
          color: var(--el-text-color-secondary);
        }

        .el-progress {
          flex: 1;
        }

        .category-time {
          width: 100px;
          font-size: 0.875rem;
          color: var(--el-color-primary);
          text-align: right;
        }
      }
    }
  }
}
</style>
