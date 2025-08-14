<template>
  <div class="library-overview">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1>媒体库概览</h1>
      <p>实时监控您的Emby媒体库状态</p>
    </div>

    <!-- 主要统计信息 -->
    <div class="main-stats">
      <div class="stats-grid">
        <!-- 电影总数 -->
        <div class="stat-card primary">
          <div class="stat-icon">
            <el-icon><Film /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-number">1,247</div>
            <div class="stat-label">电影总数</div>
            <div class="stat-trend positive">
              <el-icon><ArrowUp /></el-icon>
              <span>+12 本月新增</span>
            </div>
          </div>
        </div>

        <!-- 剧集总数 -->
        <div class="stat-card success">
          <div class="stat-icon">
            <el-icon><VideoPlay /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-number">3,892</div>
            <div class="stat-label">剧集总数</div>
            <div class="stat-trend positive">
              <el-icon><ArrowUp /></el-icon>
              <span>+45 本月新增</span>
            </div>
          </div>
        </div>

        <!-- 总存储空间 -->
        <div class="stat-card warning">
          <div class="stat-icon">
            <el-icon><Folder /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-number">2.4TB</div>
            <div class="stat-label">总存储空间</div>
            <div class="stat-trend neutral">
              <el-icon><InfoFilled /></el-icon>
              <span>剩余 156GB</span>
            </div>
          </div>
        </div>

        <!-- 观看时长 -->
        <div class="stat-card info">
          <div class="stat-icon">
            <el-icon><Clock /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-number">1,247h</div>
            <div class="stat-label">总观看时长</div>
            <div class="stat-trend positive">
              <el-icon><ArrowUp /></el-icon>
              <span>+23h 本周</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 详细统计信息 -->
    <div class="detailed-stats">
      <div class="stats-row">
        <!-- 左侧：收藏和列表 -->
        <div class="stats-column">
          <div class="stat-card secondary">
            <div class="stat-header">
              <h3>收藏与列表</h3>
            </div>
            <div class="stat-list">
              <div class="stat-item">
                <span class="item-label">收藏数量</span>
                <span class="item-value">89</span>
              </div>
              <div class="stat-item">
                <span class="item-label">待看列表</span>
                <span class="item-value">156</span>
              </div>
              <div class="stat-item">
                <span class="item-label">正在下载</span>
                <span class="item-value">12</span>
              </div>
              <div class="stat-item">
                <span class="item-label">已完结剧集</span>
                <span class="item-value">23</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧：评分统计 -->
        <div class="stats-column">
          <div class="stat-card secondary">
            <div class="stat-header">
              <h3>评分统计</h3>
            </div>
            <div class="stat-list">
              <div class="stat-item">
                <span class="item-label">平均评分</span>
                <span class="item-value">8.2</span>
              </div>
              <div class="stat-item">
                <span class="item-label">最高评分</span>
                <span class="item-value">9.8</span>
              </div>
              <div class="stat-item">
                <span class="item-label">最近观看</span>
                <span class="item-value">2小时前</span>
              </div>
              <div class="stat-item">
                <span class="item-label">本周观看</span>
                <span class="item-value">15部</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 趋势图表区域 -->
    <div class="trends-section">
      <div class="trends-header">
        <h2>增长趋势</h2>
        <div class="trends-filter">
          <el-radio-group v-model="timeRange" size="small">
            <el-radio-button label="week">本周</el-radio-button>
            <el-radio-button label="month">本月</el-radio-button>
            <el-radio-button label="year">本年</el-radio-button>
          </el-radio-group>
        </div>
      </div>

      <div class="trends-grid">
        <!-- 媒体库增长趋势 -->
        <div class="trend-card">
          <div class="trend-header">
            <h3>媒体库增长</h3>
            <span class="growth-rate positive">+15.2%</span>
          </div>
          <div class="trend-chart">
            <!-- 这里可以放图表组件 -->
            <div class="chart-placeholder">
              <div class="chart-bar" style="height: 60%"></div>
              <div class="chart-bar" style="height: 80%"></div>
              <div class="chart-bar" style="height: 45%"></div>
              <div class="chart-bar" style="height: 90%"></div>
              <div class="chart-bar" style="height: 70%"></div>
              <div class="chart-bar" style="height: 85%"></div>
              <div class="chart-bar" style="height: 95%"></div>
            </div>
          </div>
        </div>

        <!-- 观看习惯分析 -->
        <div class="trend-card">
          <div class="trend-header">
            <h3>观看习惯</h3>
            <span class="growth-rate neutral">稳定</span>
          </div>
          <div class="trend-chart">
            <div class="chart-placeholder">
              <div class="chart-line"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 快速操作 -->
    <div class="quick-actions">
      <h2>快速操作</h2>
      <div class="action-buttons">
        <el-button type="primary" size="large" @click="navigateToRename">
          <el-icon><EditPen /></el-icon>
          批量重命名
        </el-button>
        <el-button type="success" size="large" @click="navigateToPoster">
          <el-icon><Picture /></el-icon>
          管理封面
        </el-button>
        <el-button type="info" size="large">
          <el-icon><Refresh /></el-icon>
          刷新数据
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const timeRange = ref('month')

const navigateToRename = () => {
  router.push('/layouts/embyRename')
}

const navigateToPoster = () => {
  router.push('/layouts/embyPoster')
}
</script>

<style scoped lang="scss">
.library-overview {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;

  .page-header {
    text-align: center;
    margin-bottom: 3rem;

    h1 {
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--el-text-color-primary);
      margin-bottom: 0.5rem;
    }

    p {
      font-size: 1.1rem;
      color: var(--el-text-color-regular);
      margin: 0;
    }
  }

  .main-stats {
    margin-bottom: 2rem;

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
    }

    .stat-card {
      background: var(--el-bg-color);
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      border: 1px solid var(--el-border-color-light);
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 1rem;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      }

      &.primary {
        border-left: 4px solid var(--el-color-primary);
      }

      &.success {
        border-left: 4px solid var(--el-color-success);
      }

      &.warning {
        border-left: 4px solid var(--el-color-warning);
      }

      &.info {
        border-left: 4px solid var(--el-color-info);
      }

      .stat-icon {
        width: 60px;
        height: 60px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        color: white;

        .primary & {
          background: var(--el-color-primary);
        }

        .success & {
          background: var(--el-color-success);
        }

        .warning & {
          background: var(--el-color-warning);
        }

        .info & {
          background: var(--el-color-info);
        }
      }

      .stat-content {
        flex: 1;

        .stat-number {
          font-size: 2rem;
          font-weight: 700;
          color: var(--el-text-color-primary);
          margin-bottom: 0.25rem;
        }

        .stat-label {
          font-size: 0.9rem;
          color: var(--el-text-color-regular);
          margin-bottom: 0.5rem;
        }

        .stat-trend {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.8rem;
          font-weight: 500;

          &.positive {
            color: var(--el-color-success);
          }

          &.negative {
            color: var(--el-color-danger);
          }

          &.neutral {
            color: var(--el-text-color-regular);
          }
        }
      }
    }
  }

  .detailed-stats {
    margin-bottom: 2rem;

    .stats-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 1.5rem;
    }

    .stat-card.secondary {
      background: var(--el-bg-color);
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      border: 1px solid var(--el-border-color-light);

      .stat-header {
        margin-bottom: 1rem;

        h3 {
          font-size: 1.2rem;
          font-weight: 600;
          color: var(--el-text-color-primary);
          margin: 0;
        }
      }

      .stat-list {
        .stat-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 0;
          border-bottom: 1px solid var(--el-border-color-lighter);

          &:last-child {
            border-bottom: none;
          }

          .item-label {
            color: var(--el-text-color-regular);
            font-size: 0.9rem;
          }

          .item-value {
            font-weight: 600;
            color: var(--el-text-color-primary);
            font-size: 1rem;
          }
        }
      }
    }
  }

  .trends-section {
    margin-bottom: 2rem;

    .trends-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;

      h2 {
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--el-text-color-primary);
        margin: 0;
      }
    }

    .trends-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 1.5rem;
    }

    .trend-card {
      background: var(--el-bg-color);
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      border: 1px solid var(--el-border-color-light);

      .trend-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;

        h3 {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--el-text-color-primary);
          margin: 0;
        }

        .growth-rate {
          font-size: 0.9rem;
          font-weight: 600;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;

          &.positive {
            background: rgba(var(--el-color-success-rgb), 0.1);
            color: var(--el-color-success);
          }

          &.negative {
            background: rgba(var(--el-color-danger-rgb), 0.1);
            color: var(--el-color-danger);
          }

          &.neutral {
            background: rgba(var(--el-color-info-rgb), 0.1);
            color: var(--el-color-info);
          }
        }
      }

      .trend-chart {
        height: 120px;
        display: flex;
        align-items: end;
        gap: 0.5rem;

        .chart-placeholder {
          display: flex;
          align-items: end;
          gap: 0.5rem;
          width: 100%;
          height: 100%;

          .chart-bar {
            flex: 1;
            background: linear-gradient(to top, var(--el-color-primary), var(--el-color-primary-light-3));
            border-radius: 4px 4px 0 0;
            min-height: 20px;
            transition: all 0.3s ease;

            &:hover {
              background: linear-gradient(to top, var(--el-color-primary), var(--el-color-primary-light-5));
            }
          }

          .chart-line {
            width: 100%;
            height: 2px;
            background: var(--el-color-primary);
            border-radius: 1px;
            position: relative;

            &::before {
              content: '';
              position: absolute;
              top: -4px;
              left: 0;
              width: 100%;
              height: 10px;
              background: linear-gradient(to bottom, transparent, rgba(var(--el-color-primary-rgb), 0.1));
              border-radius: 1px;
            }
          }
        }
      }
    }
  }

  .quick-actions {
    text-align: center;

    h2 {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--el-text-color-primary);
      margin-bottom: 1.5rem;
    }

    .action-buttons {
      display: flex;
      justify-content: center;
      gap: 1rem;
      flex-wrap: wrap;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .library-overview {
    padding: 1rem;

    .page-header h1 {
      font-size: 2rem;
    }

    .main-stats .stats-grid {
      grid-template-columns: 1fr;
    }

    .detailed-stats .stats-row {
      grid-template-columns: 1fr;
    }

    .trends-section .trends-grid {
      grid-template-columns: 1fr;
    }

    .trends-header {
      flex-direction: column;
      gap: 1rem;
      align-items: flex-start;
    }

    .quick-actions .action-buttons {
      flex-direction: column;
      align-items: center;
    }
  }
}

@media (max-width: 480px) {
  .library-overview {
    .stat-card {
      flex-direction: column;
      text-align: center;

      .stat-icon {
        margin-bottom: 1rem;
      }
    }
  }
}
</style>
