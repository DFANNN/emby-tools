<template>
  <div class="watch-stats-container">
    <div class="header">
      <span class="header-icon">⏱️</span>
      <h3>观看统计</h3>
      <el-tag type="success" size="small">统计中</el-tag>
    </div>
    <div class="content">
      <div class="watch-overview">
        <div class="watch-total">156小时</div>
        <div class="watch-label">总观看时长</div>
        <div class="watch-count">89部已观看</div>
      </div>
      <div class="watch-categories">
        <div class="category-item">
          <span>电影</span>
          <el-progress :percentage="watchStats.movies.percentage" :stroke-width="6" color="#1890ff" />
          <span class="category-time">{{ watchStats.movies.watchTime }}</span>
        </div>

        <div class="category-item">
          <span>剧集</span>
          <el-progress :percentage="watchStats.tvShows.percentage" :stroke-width="6" color="#52c41a" />
          <span class="category-time">{{ watchStats.tvShows.watchTime }}</span>
        </div>

        <div class="category-item">
          <span>音乐</span>
          <el-progress :percentage="watchStats.music.percentage" :stroke-width="6" color="#faad14" />
          <span class="category-time">{{ watchStats.music.listenTime }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const watchStats = ref({
  totalWatchTime: '156小时',
  totalWatchedItems: 89,
  movies: { watchTime: '45小时', percentage: 29 },
  tvShows: { watchTime: '98小时', percentage: 63 },
  music: { listenTime: '13小时', percentage: 8 },
  thisMonth: '12小时',
  thisWeek: '3小时',
  today: '0.5小时'
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
          width: 60px;
          font-size: 0.875rem;
          color: var(--el-color-primary);
          text-align: right;
        }
      }
    }
  }
}
</style>
