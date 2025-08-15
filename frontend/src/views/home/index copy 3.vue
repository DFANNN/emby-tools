<template>
  <div class="emby-follow">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-left">
        <h1>📺 追剧关注</h1>
        <p>关注 Emby 库中的剧集，监控更新状态</p>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="showSearchDialog">
          <el-icon><Plus /></el-icon>
          搜索添加
        </el-button>
        <el-button @click="refreshData">
          <el-icon><Refresh /></el-icon>
          刷新状态
        </el-button>
      </div>
    </div>

    <!-- 关注列表 -->
    <div class="follow-list">
      <div v-for="show in followedShows" :key="show.id" class="follow-item">
        <!-- 剧集海报 -->
        <div class="show-poster">
          <img :src="show.posterPath || '/placeholder-poster.jpg'" :alt="show.name" @error="handleImageError" />
        </div>

        <!-- 剧集信息 -->
        <div class="show-info">
          <div class="show-header">
            <h3 class="show-name">{{ show.name }}</h3>
            <div class="show-actions">
              <el-button size="small" @click="refreshShowStatus(show)"> 刷新状态 </el-button>
              <el-button size="small" type="danger" @click="unfollowShow(show)"> 取消关注 </el-button>
            </div>
          </div>

          <!-- 集数对比信息 -->
          <div class="episode-comparison">
            <div class="comparison-item">
              <span class="label">Emby 库:</span>
              <span class="value">{{ show.embyEpisodes }}集</span>
            </div>
            <div class="comparison-item">
              <span class="label">TMDB 更新:</span>
              <span class="value">{{ show.tmdbEpisodes }}集</span>
            </div>
            <div class="comparison-item missing">
              <span class="label">缺少:</span>
              <span class="value">{{ show.missingEpisodes }}集</span>
            </div>
          </div>

          <!-- 状态指示 -->
          <div class="status-indicator">
            <el-tag v-if="show.missingEpisodes === 0" type="success"> 已完整 </el-tag>
            <el-tag v-else-if="show.missingEpisodes <= 3" type="warning"> 缺少{{ show.missingEpisodes }}集 </el-tag>
            <el-tag v-else type="danger"> 缺少{{ show.missingEpisodes }}集 </el-tag>
          </div>

          <!-- 剧集元信息 -->
          <div class="show-meta">
            <span class="meta-item">
              <el-icon><Calendar /></el-icon>
              {{ show.releaseYear }}
            </span>
            <span class="meta-item">
              <el-icon><Collection /></el-icon>
              第{{ show.currentSeason }}季
            </span>
            <span class="meta-item">
              <el-icon><Clock /></el-icon>
              关注于 {{ formatDate(show.followedAt) }}
            </span>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="followedShows.length === 0" class="empty-state">
        <el-empty description="暂无关注的剧集">
          <el-button type="primary" @click="showSearchDialog"> 添加第一个关注 </el-button>
        </el-empty>
      </div>
    </div>

    <!-- 搜索对话框 -->
    <el-dialog v-model="searchDialogVisible" title="搜索 Emby 库中的剧集" width="800px">
      <div class="search-dialog">
        <!-- 搜索框 -->
        <div class="search-section">
          <el-input
            v-model="searchQuery"
            placeholder="输入剧集名称搜索..."
            prefix-icon="Search"
            clearable
            @input="searchEmbyLibrary"
          />
        </div>

        <!-- 搜索结果 -->
        <div class="search-results" v-if="searchResults.length > 0">
          <h4>搜索结果</h4>
          <div class="result-list">
            <div v-for="result in searchResults" :key="result.id" class="result-item">
              <img :src="result.posterPath || '/placeholder-poster.jpg'" :alt="result.name" />
              <div class="result-info">
                <h5>{{ result.name }}</h5>
                <p>{{ result.releaseYear }} • 第{{ result.currentSeason }}季</p>
                <p>Emby库: {{ result.embyEpisodes }}集</p>
              </div>
              <div class="result-actions">
                <el-button type="primary" size="small" @click="addToFollows(result)"> 添加关注 </el-button>
              </div>
            </div>
          </div>
        </div>

        <!-- 搜索提示 -->
        <div v-else-if="searchQuery && !searching" class="search-tip">
          <p>未找到相关剧集，请尝试其他关键词</p>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Plus, Refresh, Search, Calendar, Collection, Clock } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 响应式数据
const searchDialogVisible = ref(false)
const searchQuery = ref('')
const searching = ref(false)
const searchResults = ref([])

// 关注的剧集列表
const followedShows = ref([
  {
    id: '1',
    name: '权力的游戏',
    posterPath: 'https://image.tmdb.org/t/p/original/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg',
    releaseYear: 2011,
    currentSeason: 8,
    embyEpisodes: 6, // Emby库中有6集
    tmdbEpisodes: 8, // TMDB显示总共8集
    missingEpisodes: 2, // 缺少2集
    followedAt: '2024-01-15'
  },
  {
    id: '2',
    name: '沙丘',
    posterPath: 'https://image.tmdb.org/t/p/original/kMa1TSDj76zTSleXE7xsuZ4s3i0.jpg',
    releaseYear: 2021,
    currentSeason: 2,
    embyEpisodes: 8, // Emby库中有8集
    tmdbEpisodes: 8, // TMDB显示总共8集
    missingEpisodes: 0, // 不缺少
    followedAt: '2024-03-01'
  }
])

// 计算属性
const totalShows = computed(() => followedShows.value.length)
const totalMissingEpisodes = computed(() => {
  return followedShows.value.reduce((total, show) => total + show.missingEpisodes, 0)
})

// 方法
const showSearchDialog = () => {
  searchDialogVisible.value = true
  searchQuery.value = ''
  searchResults.value = []
}

const searchEmbyLibrary = async () => {
  if (!searchQuery.value.trim()) {
    searchResults.value = []
    return
  }

  searching.value = true
  try {
    // 模拟搜索 Emby 库
    await new Promise(resolve => setTimeout(resolve, 500))

    // 模拟搜索结果
    searchResults.value = [
      {
        id: 'new1',
        name: '新剧集1',
        posterPath: 'https://image.tmdb.org/t/p/original/kMa1TSDj76zTSleXE7xsuZ4s3i0.jpg',
        releaseYear: 2024,
        currentSeason: 1,
        embyEpisodes: 5
      },
      {
        id: 'new2',
        name: '新剧集2',
        posterPath: 'https://image.tmdb.org/t/p/original/by8z9Fe8y7p4jo2YlW2SZDnptyT.jpg',
        releaseYear: 2024,
        currentSeason: 2,
        embyEpisodes: 8
      }
    ]
  } catch (error) {
    ElMessage.error('搜索失败，请重试')
  } finally {
    searching.value = false
  }
}

const addToFollows = async (show: any) => {
  try {
    // 获取 TMDB 信息来计算缺少的集数
    const tmdbInfo = await fetchTMDBInfo(show.name)

    const newFollow = {
      id: Date.now().toString(),
      name: show.name,
      posterPath: show.posterPath,
      releaseYear: show.releaseYear,
      currentSeason: show.currentSeason,
      embyEpisodes: show.embyEpisodes,
      tmdbEpisodes: tmdbInfo.totalEpisodes,
      missingEpisodes: Math.max(0, tmdbInfo.totalEpisodes - show.embyEpisodes),
      followedAt: new Date().toISOString()
    }

    followedShows.value.push(newFollow)
    ElMessage.success('添加关注成功')
    searchDialogVisible.value = false
  } catch (error) {
    ElMessage.error('添加失败，请重试')
  }
}

const fetchTMDBInfo = async (showName: string) => {
  // 模拟获取 TMDB 信息
  await new Promise(resolve => setTimeout(resolve, 300))

  // 模拟返回数据
  return {
    totalEpisodes: Math.floor(Math.random() * 5) + 8 // 8-12集随机
  }
}

const refreshShowStatus = async (show: any) => {
  try {
    // 重新获取 Emby 和 TMDB 信息
    const embyInfo = await fetchEmbyInfo(show.name)
    const tmdbInfo = await fetchTMDBInfo(show.name)

    show.embyEpisodes = embyInfo.episodes
    show.tmdbEpisodes = tmdbInfo.totalEpisodes
    show.missingEpisodes = Math.max(0, tmdbInfo.totalEpisodes - embyInfo.episodes)

    ElMessage.success('状态已刷新')
  } catch (error) {
    ElMessage.error('刷新失败，请重试')
  }
}

const fetchEmbyInfo = async (showName: string) => {
  // 模拟获取 Emby 信息
  await new Promise(resolve => setTimeout(resolve, 300))

  return {
    episodes: Math.floor(Math.random() * 5) + 5 // 5-9集随机
  }
}

const unfollowShow = async (show: any) => {
  try {
    await ElMessageBox.confirm(`确定要取消关注《${show.name}》吗？`, '确认取消关注', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const index = followedShows.value.findIndex(s => s.id === show.id)
    if (index > -1) {
      followedShows.value.splice(index, 1)
      ElMessage.success('取消关注成功')
    }
  } catch {
    // 用户取消操作
  }
}

const refreshData = () => {
  ElMessage.success('数据已刷新')
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString()
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/placeholder-poster.jpg'
}

// 生命周期
onMounted(() => {
  // 初始化数据
})
</script>

<style scoped lang="scss">
.emby-follow {
  padding: 2rem;
  background: #f5f7fa;
  min-height: 100vh;

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 2rem;

    .header-left {
      h1 {
        font-size: 2.5rem;
        color: #1a1a1a;
        margin-bottom: 0.5rem;
        font-weight: 700;
      }

      p {
        font-size: 1.1rem;
        color: #666;
        margin: 0;
      }
    }

    .header-actions {
      display: flex;
      gap: 1rem;
    }
  }

  .follow-list {
    .follow-item {
      background: white;
      border-radius: 16px;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      border: 1px solid #f0f0f0;
      display: flex;
      gap: 1.5rem;

      .show-poster {
        flex-shrink: 0;

        img {
          width: 120px;
          height: 180px;
          border-radius: 8px;
          object-fit: cover;
        }
      }

      .show-info {
        flex: 1;

        .show-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.5rem;

          .show-name {
            margin: 0;
            font-size: 1.5rem;
            color: #1a1a1a;
            font-weight: 600;
          }

          .show-actions {
            display: flex;
            gap: 0.5rem;
          }
        }

        .episode-comparison {
          display: flex;
          gap: 2rem;
          margin-bottom: 1.5rem;

          .comparison-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;

            .label {
              font-size: 0.875rem;
              color: #666;
            }

            .value {
              font-size: 1.5rem;
              font-weight: 700;
              color: #1890ff;
            }

            &.missing .value {
              color: #f56c6c;
            }
          }
        }

        .status-indicator {
          margin-bottom: 1.5rem;
        }

        .show-meta {
          display: flex;
          gap: 1.5rem;

          .meta-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.875rem;
            color: #666;
          }
        }
      }
    }
  }

  .empty-state {
    text-align: center;
    padding: 4rem 2rem;
  }
}

.search-dialog {
  .search-section {
    margin-bottom: 2rem;
  }

  .search-results {
    h4 {
      margin-bottom: 1rem;
      color: #1a1a1a;
    }

    .result-list {
      .result-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        border: 1px solid #f0f0f0;
        border-radius: 8px;
        margin-bottom: 1rem;

        img {
          width: 60px;
          height: 90px;
          border-radius: 6px;
          object-fit: cover;
        }

        .result-info {
          flex: 1;

          h5 {
            margin: 0 0 0.5rem 0;
            color: #1a1a1a;
          }

          p {
            margin: 0.25rem 0;
            color: #666;
            font-size: 0.875rem;
          }
        }
      }
    }
  }

  .search-tip {
    text-align: center;
    color: #666;
    padding: 2rem;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .emby-follow {
    padding: 1rem;

    .page-header {
      flex-direction: column;
      gap: 1rem;
      align-items: flex-start;

      h1 {
        font-size: 2rem;
      }
    }

    .follow-list {
      .follow-item {
        flex-direction: column;
        gap: 1rem;

        .show-poster {
          align-self: center;
        }

        .episode-comparison {
          flex-direction: column;
          gap: 1rem;
        }
      }
    }
  }
}
</style>
