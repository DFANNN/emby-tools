<template>
  <div class="emby-dashboard">
    <!-- 页面标题（对齐 seriesTracker 样式） -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <div class="title-icon">📊</div>
          <div class="title-text">
            <h1>Emby 信息看板</h1>
            <p>实时监控你的媒体库状态</p>
          </div>
        </div>
        <div class="header-actions">
          <el-button type="primary" @click="refreshData" :loading="loading">
            <el-icon><Refresh /></el-icon>
            刷新数据
          </el-button>
          <el-button @click="openEmbyWeb">
            <el-icon><Link /></el-icon>
            打开 Emby
          </el-button>
        </div>
      </div>
    </div>

    <!-- 信息卡片网格 -->
    <div class="dashboard-grid">
      <!-- 基础数量统计 -->
      <div class="info-card count-stats">
        <div class="card-header">
          <span class="card-icon">��</span>
          <h3>媒体库概览</h3>
          <el-tag type="success" size="small">实时</el-tag>
        </div>
        <div class="card-content">
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-number">{{ libraryCounts.movies }}</div>
              <div class="stat-label">电影</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">{{ libraryCounts.tvShows }}</div>
              <div class="stat-label">剧集</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">{{ libraryCounts.music }}</div>
              <div class="stat-label">音乐</div>
            </div>
            <div class="stat-item total">
              <div class="stat-number">{{ libraryCounts.total }}</div>
              <div class="stat-label">总计</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 存储空间统计 -->
      <div class="info-card storage-stats">
        <div class="card-header">
          <span class="card-icon">��</span>
          <h3>存储空间</h3>
          <el-tag type="warning" size="small">监控中</el-tag>
        </div>
        <div class="card-content">
          <div class="storage-overview">
            <div class="storage-main">
              <div class="storage-used">{{ storageInfo.totalUsed }}</div>
              <div class="storage-total">/ {{ storageInfo.totalSpace }}</div>
            </div>
            <div class="storage-percentage">{{ storageInfo.usagePercentage }}%</div>
          </div>

          <el-progress
            :percentage="storageInfo.usagePercentage"
            :color="getStorageColor(storageInfo.usagePercentage)"
            :stroke-width="8"
          />

          <div class="storage-details">
            <div class="storage-item">
              <span>剩余空间:</span>
              <span class="storage-value">{{ storageInfo.freeSpace }}</span>
            </div>
            <div class="storage-item">
              <span>电影占用:</span>
              <span class="storage-value">{{ storageInfo.movies?.size || '0GB' }}</span>
            </div>
            <div class="storage-item">
              <span>剧集占用:</span>
              <span class="storage-value">{{ storageInfo.tvShows?.size || '0GB' }}</span>
            </div>
            <div class="storage-item">
              <span>音乐占用:</span>
              <span class="storage-value">{{ storageInfo.music?.size || '0GB' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 最新添加 -->
      <div class="info-card latest-added">
        <div class="card-header">
          <span class="card-icon">��</span>
          <h3>最新添加</h3>
          <el-tag type="info" size="small">{{ latestItems.length }}项</el-tag>
        </div>
        <div class="card-content">
          <div class="latest-list">
            <div
              v-for="item in latestItems.slice(0, 5)"
              :key="item.id"
              class="latest-item"
              @click="openItemDetail(item)"
            >
              <div class="item-poster">
                <img :src="item.posterPath || '/placeholder-poster.jpg'" :alt="item.name" @error="handleImageError" />
              </div>
              <div class="item-info">
                <div class="item-name">{{ item.name }}</div>
                <div class="item-meta">
                  <span class="item-type">{{ getTypeLabel(item.type) }}</span>
                  <span class="item-date">{{ formatDate(item.addedDate) }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="latest-more" v-if="latestItems.length > 5">
            <el-button text @click="showAllLatest"> 查看全部 ({{ latestItems.length }}) </el-button>
          </div>
        </div>
      </div>

      <!-- 观看统计 -->
      <div class="info-card watch-stats">
        <div class="card-header">
          <span class="card-icon">⏱️</span>
          <h3>观看统计</h3>
          <el-tag type="primary" size="small">统计中</el-tag>
        </div>
        <div class="card-content">
          <div class="watch-overview">
            <div class="watch-main">
              <div class="watch-total">{{ watchStats.totalWatchTime }}</div>
              <div class="watch-label">总观看时长</div>
            </div>
            <div class="watch-count">{{ watchStats.totalWatchedItems }} 部已观看</div>
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

          <div class="watch-time-stats">
            <div class="time-item">
              <span class="time-label">本月</span>
              <span class="time-value">{{ watchStats.thisMonth }}</span>
            </div>
            <div class="time-item">
              <span class="time-label">本周</span>
              <span class="time-value">{{ watchStats.thisWeek }}</span>
            </div>
            <div class="time-item">
              <span class="time-label">今日</span>
              <span class="time-value">{{ watchStats.today }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 系统状态栏 -->
    <div class="system-status">
      <div class="status-item">
        <span class="status-label">Emby 服务:</span>
        <el-tag :type="systemStatus.emby.status" size="small">
          {{ systemStatus.emby.message }}
        </el-tag>
      </div>
      <div class="status-item">
        <span class="status-label">磁盘健康:</span>
        <el-tag :type="systemStatus.disk.status" size="small">
          {{ systemStatus.disk.message }}
        </el-tag>
      </div>
      <div class="status-item">
        <span class="status-label">网络连接:</span>
        <el-tag :type="systemStatus.network.status" size="small">
          {{ systemStatus.network.message }}
        </el-tag>
      </div>
      <div class="status-item">
        <span class="status-label">最后更新:</span>
        <span class="status-time">{{ lastUpdateTime }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Refresh, Link } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// 类型定义
type TagType = 'success' | 'warning' | 'info' | 'primary' | 'danger'

interface LatestItem {
  id: string
  name: string
  type: 'Movie' | 'Series' | 'Audio'
  addedDate: string
  posterPath: string
}

interface SystemStatus {
  emby: { status: TagType; message: string }
  disk: { status: TagType; message: string }
  network: { status: TagType; message: string }
}

// 响应式数据
const loading = ref(false)
const lastUpdateTime = ref('')

// 媒体库数量统计
const libraryCounts = ref({
  movies: 0,
  tvShows: 0,
  music: 0,
  total: 0
})

// 存储空间信息
const storageInfo = ref({
  totalUsed: '0GB',
  totalSpace: '0GB',
  freeSpace: '0GB',
  usagePercentage: 0,
  movies: { size: '0GB', percentage: 0 },
  tvShows: { size: '0GB', percentage: 0 },
  music: { size: '0GB', percentage: 0 }
})

// 最新添加项目
const latestItems = ref<LatestItem[]>([])

// 观看统计
const watchStats = ref({
  totalWatchTime: '0小时',
  totalWatchedItems: 0,
  movies: { watchTime: '0小时', percentage: 0 },
  tvShows: { watchTime: '0小时', percentage: 0 },
  music: { listenTime: '0小时', percentage: 0 },
  thisMonth: '0小时',
  thisWeek: '0小时',
  today: '0小时'
})

// 系统状态
const systemStatus = ref<SystemStatus>({
  emby: { status: 'success', message: '运行中' },
  disk: { status: 'warning', message: '注意' },
  network: { status: 'success', message: '正常' }
})

// 定时器
let refreshTimer: ReturnType<typeof setInterval> | null = null

// 获取存储空间颜色
const getStorageColor = (percentage: number) => {
  if (percentage < 70) return '#52c41a'
  if (percentage < 90) return '#faad14'
  return '#f5222d'
}

// 获取类型标签
const getTypeLabel = (type: LatestItem['type']) => {
  const typeMap: Record<LatestItem['type'], string> = {
    Movie: '电影',
    Series: '剧集',
    Audio: '音乐'
  }
  return typeMap[type] || type
}

// 格式化日期
const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 1) return '昨天'
  if (diffDays < 7) return `${diffDays}天前`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}周前`
  return date.toLocaleDateString()
}

// 处理图片加载错误
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/placeholder-poster.jpg'
}

// 刷新数据
const refreshData = async () => {
  loading.value = true
  try {
    await fetchEmbyData()
    lastUpdateTime.value = new Date().toLocaleString()
    ElMessage.success('数据刷新成功')
  } catch (error) {
    ElMessage.error('数据刷新失败')
    console.error('刷新数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 获取 Emby 数据
const fetchEmbyData = async () => {
  // 模拟 API 调用
  await new Promise(resolve => setTimeout(resolve, 1000))

  // 模拟数据
  libraryCounts.value = {
    movies: 1234,
    tvShows: 567,
    music: 89,
    total: 1890
  }

  storageInfo.value = {
    totalUsed: '2.5TB',
    totalSpace: '4TB',
    freeSpace: '1.5TB',
    usagePercentage: 62.5,
    movies: { size: '1.8TB', percentage: 45 },
    tvShows: { size: '600GB', percentage: 15 },
    music: { size: '100GB', percentage: 2.5 }
  }

  latestItems.value = [
    {
      id: '1',
      name: '沙丘2',
      type: 'Movie',
      addedDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      posterPath: 'https://image.tmdb.org/t/p/original/kMa1TSDj76zTSleXE7xsuZ4s3i0.jpg'
    },
    {
      id: '2',
      name: '死侍与金刚狼',
      type: 'Movie',
      addedDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      posterPath: 'https://image.tmdb.org/t/p/original/by8z9Fe8y7p4jo2YlW2SZDnptyT.jpg'
    },
    {
      id: '3',
      name: '权力的游戏',
      type: 'Series',
      addedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      posterPath: 'https://image.tmdb.org/t/p/original/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg'
    }
  ]

  watchStats.value = {
    totalWatchTime: '156小时',
    totalWatchedItems: 89,
    movies: { watchTime: '45小时', percentage: 29 },
    tvShows: { watchTime: '98小时', percentage: 63 },
    music: { listenTime: '13小时', percentage: 8 },
    thisMonth: '12小时',
    thisWeek: '3小时',
    today: '0.5小时'
  }
}

// 打开 Emby Web
const openEmbyWeb = () => {
  window.open('http://localhost:8096', '_blank')
}

// 打开项目详情
const openItemDetail = (item: any) => {
  console.log('打开项目详情:', item)
  // 这里可以跳转到 Emby 详情页
}

// 显示所有最新项目
const showAllLatest = () => {
  console.log('显示所有最新项目')
  // 这里可以打开一个模态框显示所有项目
}

// 定时刷新
const startAutoRefresh = () => {
  refreshTimer = setInterval(() => {
    refreshData()
  }, 5 * 60 * 1000) // 5分钟刷新一次
}

// 停止定时刷新
const stopAutoRefresh = () => {
  if (refreshTimer) {
    clearInterval(refreshTimer)
    refreshTimer = null
  }
}

// 生命周期
onMounted(() => {
  refreshData()
  startAutoRefresh()
})

onUnmounted(() => {
  stopAutoRefresh()
})
</script>

<style scoped lang="scss">
.emby-dashboard {
  padding: 2rem;
  background: #f5f7fa;
  min-height: 100vh;

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
    padding: 0.8rem 0;
    background: white;
    border-radius: 12px;
    padding: 1rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      width: 100%;
      gap: 1rem;
    }

    .title-section {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      flex-shrink: 0;

      .title-icon {
        font-size: 2rem;
        color: #409eff;
      }

      .title-text {
        h1 {
          font-size: 1.6rem;
          color: #1a1a1a;
          margin: 0;
          font-weight: 700;
        }

        p {
          margin: 0.25rem 0 0 0;
          font-size: 0.875rem;
          color: #666;
        }
      }
    }

    .header-actions {
      display: flex;
      gap: 0.6rem;
      flex-shrink: 0;

      .el-button {
        font-size: 0.85rem;
        padding: 0.4rem 0.8rem;
      }
    }
  }

  .dashboard-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
    margin-bottom: 2rem;

    .info-card {
      background: white;
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      border: 1px solid #f0f0f0;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
      }

      .card-header {
        display: flex;
        align-items: center;
        margin-bottom: 1.5rem;

        .card-icon {
          font-size: 1.5rem;
          margin-right: 0.75rem;
        }

        h3 {
          margin: 0;
          color: #1a1a1a;
          font-size: 1.25rem;
          font-weight: 600;
          flex: 1;
        }
      }

      .card-content {
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;

          .stat-item {
            text-align: center;
            padding: 1rem;
            background: #f8f9fa;
            border-radius: 12px;

            &.total {
              grid-column: span 2;
              background: #e6f7ff;
              border: 1px solid #91d5ff;
            }

            .stat-number {
              font-size: 2rem;
              font-weight: 700;
              color: #1890ff;
              margin-bottom: 0.5rem;
            }

            .stat-label {
              font-size: 0.875rem;
              color: #666;
            }
          }
        }

        .storage-overview {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;

          .storage-main {
            display: flex;
            align-items: baseline;

            .storage-used {
              font-size: 1.5rem;
              font-weight: 700;
              color: #1890ff;
            }

            .storage-total {
              font-size: 1rem;
              color: #666;
              margin-left: 0.5rem;
            }
          }

          .storage-percentage {
            font-size: 1.25rem;
            font-weight: 600;
            color: #52c41a;
          }
        }

        .storage-details {
          margin-top: 1rem;

          .storage-item {
            display: flex;
            justify-content: space-between;
            padding: 0.5rem 0;
            border-bottom: 1px solid #f0f0f0;

            &:last-child {
              border-bottom: none;
            }

            .storage-value {
              font-weight: 600;
              color: #1890ff;
            }
          }
        }

        .latest-list {
          .latest-item {
            display: flex;
            align-items: center;
            padding: 0.75rem;
            border-radius: 8px;
            cursor: pointer;
            transition: background-color 0.2s ease;

            &:hover {
              background: #f5f5f5;
            }

            .item-poster {
              width: 50px;
              height: 75px;
              margin-right: 1rem;
              border-radius: 6px;
              overflow: hidden;

              img {
                width: 100%;
                height: 100%;
                object-fit: cover;
              }
            }

            .item-info {
              flex: 1;

              .item-name {
                font-weight: 600;
                color: #1a1a1a;
                margin-bottom: 0.25rem;
                line-height: 1.3;
              }

              .item-meta {
                display: flex;
                gap: 1rem;
                font-size: 0.875rem;
                color: #666;

                .item-type {
                  color: #1890ff;
                }
              }
            }
          }
        }

        .latest-more {
          text-align: center;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #f0f0f0;
        }

        .watch-overview {
          text-align: center;
          margin-bottom: 1.5rem;

          .watch-main {
            margin-bottom: 0.5rem;

            .watch-total {
              font-size: 2rem;
              font-weight: 700;
              color: #1890ff;
            }

            .watch-label {
              font-size: 0.875rem;
              color: #666;
            }
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
              color: #666;
            }

            .el-progress {
              flex: 1;
            }

            .category-time {
              width: 60px;
              font-size: 0.875rem;
              color: #1890ff;
              text-align: right;
            }
          }
        }

        .watch-time-stats {
          display: flex;
          justify-content: space-around;

          .time-item {
            text-align: center;

            .time-label {
              display: block;
              font-size: 0.75rem;
              color: #666;
              margin-bottom: 0.25rem;
            }

            .time-value {
              font-size: 1rem;
              font-weight: 600;
              color: #1a1a1a;
            }
          }
        }
      }
    }
  }

  .system-status {
    background: white;
    border-radius: 12px;
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);

    .status-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;

      .status-label {
        font-size: 0.875rem;
        color: #666;
      }

      .status-time {
        font-size: 0.875rem;
        color: #1890ff;
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .emby-dashboard {
    padding: 1rem;

    .page-header {
      padding: 0.8rem;

      .header-content {
        flex-direction: column;
        gap: 0.8rem;
        align-items: stretch;
      }

      .title-section {
        justify-content: center;
        text-align: center;
      }

      .header-actions {
        align-self: center;
        flex-direction: column;
      }

      h1 {
        font-size: 1.4rem;
      }
    }

    .dashboard-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .system-status {
      flex-direction: column;
      gap: 1rem;
      text-align: center;
    }
  }
}
</style>
