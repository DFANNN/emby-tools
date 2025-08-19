<!-- 追剧关注功能 -->
<template>
  <div class="emby-follow">
    <!-- 页面标题和搜索 -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <div class="title-icon">🎬</div>
          <div class="title-text">
            <h1>我的关注</h1>
          </div>
        </div>
        <div class="search-filter-inline">
          <div class="search-input-wrapper">
            <el-input
              v-model="searchQuery"
              placeholder="搜索剧集..."
              prefix-icon="Search"
              clearable
              @input="filterFollowedShows"
              class="search-input"
            />
          </div>
          <div class="filter-container">
            <div class="filter-tabs">
              <div
                v-for="tab in filterTabs"
                :key="tab.value"
                class="filter-tab"
                :class="{ active: activeStatus === tab.value }"
                @click="filterByStatus(tab.value)"
              >
                <span class="tab-label">{{ tab.label }}</span>
                <span class="tab-count">{{ tab.count }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="header-actions">
          <el-button type="primary" @click="showAddFollow" class="add-btn">
            <el-icon><Plus /></el-icon>
            添加关注
          </el-button>
          <el-button @click="refreshData" class="refresh-btn">
            <el-icon><Refresh /></el-icon>
          </el-button>
        </div>
      </div>
    </div>

    <!-- 关注列表 -->
    <div class="follow-list">
      <div class="follow-grid">
        <div v-for="show in filteredShows" :key="show.id" class="follow-card" :class="show.status">
          <!-- 剧集海报 -->
          <div class="show-poster">
            <img :src="show.posterPath || '/placeholder-poster.jpg'" :alt="show.name" @error="handleImageError" />
            <div class="status-badge" :class="show.status">
              {{ getStatusLabel(show.status) }}
            </div>
          </div>

          <!-- 剧集信息 -->
          <div class="show-info">
            <h3 class="show-name">{{ show.name }}</h3>

            <!-- 集数信息 -->
            <div class="episode-stats">
              <div class="stat-item">
                <span class="stat-label">库</span>
                <span class="stat-value">{{ show.embyEpisodes }}集</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">TMDB</span>
                <span class="stat-value">{{ show.tmdbEpisodes }}集</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">状态</span>
                <span class="stat-value" :class="getUpdateStatusClass(show.embyEpisodes, show.tmdbEpisodes)">
                  {{ getUpdateStatusText(show.embyEpisodes, show.tmdbEpisodes) }}
                </span>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="card-actions">
              <el-button size="small" @click="editFollow(show)">设置</el-button>
              <el-button size="small" type="danger" @click="unfollowShow(show)">取消关注</el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="filteredShows.length === 0" class="empty-state">
        <el-empty description="暂无关注的剧集" :image-size="200">
          <el-button type="primary" @click="showAddFollow"> 添加第一个关注 </el-button>
        </el-empty>
      </div>
    </div>

    <!-- 添加关注对话框 -->
    <el-dialog v-model="addFollowVisible" title="添加关注" width="800px" :close-on-click-modal="false">
      <div class="add-follow-dialog">
        <!-- 搜索 Emby 库 -->
        <div class="search-section">
          <h4>搜索 Emby 库</h4>
          <el-input
            v-model="searchEmbyQuery"
            placeholder="输入剧集名称搜索..."
            prefix-icon="Search"
            clearable
            @input="searchEmbyLibrary"
          />
        </div>

        <!-- 搜索结果 -->
        <div class="search-results" v-if="embySearchResults.length > 0">
          <h4>搜索结果</h4>
          <div class="result-list">
            <div v-for="result in embySearchResults" :key="result.id" class="result-item">
              <img :src="result.posterPath || '/placeholder-poster.jpg'" :alt="result.name" />
              <div class="result-info">
                <h5>{{ result.name }}</h5>
                <p>{{ result.releaseYear }} • {{ result.totalSeasons }}季</p>
                <p v-if="result.overview">{{ result.overview }}</p>
              </div>
              <div class="result-actions">
                <el-button type="primary" size="small" @click="addToFollows(result)"> 添加关注 </el-button>
              </div>
            </div>
          </div>
        </div>

        <!-- 关注设置 -->
        <div class="follow-settings" v-if="selectedShow">
          <h4>关注设置</h4>
          <el-form :model="followForm" label-width="100px">
            <el-form-item label="关注状态">
              <el-select v-model="followForm.status" placeholder="选择关注状态">
                <el-option label="可更新" value="updatable" />
                <el-option label="已同步" value="synced" />
              </el-select>
            </el-form-item>

            <el-form-item label="优先级">
              <el-select v-model="followForm.priority" placeholder="选择优先级">
                <el-option label="高" value="high" />
                <el-option label="中" value="medium" />
                <el-option label="低" value="low" />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addFollowVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmAddFollow" :disabled="!selectedShow"> 确认添加 </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 编辑关注对话框 -->
    <el-dialog v-model="editFollowVisible" title="编辑关注" width="600px">
      <el-form :model="editForm" label-width="100px">
        <el-form-item label="关注状态">
          <el-select v-model="editForm.status" placeholder="选择关注状态">
            <el-option label="可更新" value="updatable" />
            <el-option label="已同步" value="synced" />
          </el-select>
        </el-form-item>

        <el-form-item label="优先级">
          <el-select v-model="editForm.priority" placeholder="选择优先级">
            <el-option label="高" value="high" />
            <el-option label="中" value="medium" />
            <el-option label="低" value="low" />
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editFollowVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmEditFollow"> 确认修改 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Plus, Refresh, Search, Calendar, Collection } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 类型定义
interface Show {
  id: string
  name: string
  status: 'synced' | 'updatable'
  priority: 'high' | 'medium' | 'low'
  posterPath: string
  releaseYear: number
  totalSeasons: number
  embyEpisodes: number
  tmdbEpisodes: number
  overview?: string
  followedAt: string
  lastUpdated: string
}

interface EmbySearchResult {
  id: string
  name: string
  posterPath: string
  releaseYear: number
  totalSeasons: number
  overview?: string
}

// 响应式数据
const searchQuery = ref('')
const activeStatus = ref('all')
const addFollowVisible = ref(false)
const editFollowVisible = ref(false)
const searchEmbyQuery = ref('')
const selectedShow = ref<EmbySearchResult | null>(null)
const currentEditingShow = ref<Show | null>(null)

// 关注列表数据
const followedShows = ref<Show[]>([
  {
    id: '1',
    name: '权力的游戏',
    status: 'synced',
    priority: 'high',
    posterPath: 'https://image.tmdb.org/t/p/original/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg',
    releaseYear: 2011,
    totalSeasons: 8,
    embyEpisodes: 73,
    tmdbEpisodes: 73,
    overview: '改编自乔治·R·R·马丁的奇幻小说《冰与火之歌》...',
    followedAt: '2024-01-15',
    lastUpdated: '2024-12-10'
  },
  {
    id: '2',
    name: '沙丘',
    status: 'updatable',
    priority: 'medium',
    posterPath: 'https://image.tmdb.org/t/p/original/kMa1TSDj76zTSleXE7xsuZ4s3i0.jpg',
    releaseYear: 2021,
    totalSeasons: 2,
    embyEpisodes: 18,
    tmdbEpisodes: 20,
    overview: '讲述保罗·厄崔迪的传奇故事...',
    followedAt: '2024-03-01',
    lastUpdated: '2024-12-08'
  },
  {
    id: '3',
    name: '死侍',
    status: 'synced',
    priority: 'low',
    posterPath: 'https://image.tmdb.org/t/p/original/by8z9Fe8y7p4jo2YlW2SZDnptyT.jpg',
    releaseYear: 2016,
    totalSeasons: 1,
    embyEpisodes: 1,
    tmdbEpisodes: 1,
    overview: '韦德·威尔逊的超级英雄故事...',
    followedAt: '2024-06-15',
    lastUpdated: '2024-11-20'
  }
])

// Emby 搜索结果
const embySearchResults = ref<EmbySearchResult[]>([])

// 表单数据
const followForm = ref({
  status: 'updatable' as const,
  priority: 'medium' as const
})

const editForm = ref({
  status: 'updatable' as Show['status'],
  priority: 'medium' as Show['priority']
})

// 计算属性
const filteredShows = computed(() => {
  let shows = followedShows.value

  // 按状态筛选
  if (activeStatus.value !== 'all') {
    shows = shows.filter(show => show.status === activeStatus.value)
  }

  // 按搜索关键词筛选
  if (searchQuery.value) {
    shows = shows.filter(show => show.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
  }

  return shows
})

const totalCount = computed(() => followedShows.value.length)
const syncedCount = computed(() => followedShows.value.filter(s => s.status === 'synced').length)
const updatableCount = computed(() => followedShows.value.filter(s => s.status === 'updatable').length)

const filterTabs = computed(() => [
  { label: '全部', value: 'all', count: totalCount.value },
  { label: '已同步', value: 'synced', count: syncedCount.value },
  { label: '可更新', value: 'updatable', count: updatableCount.value }
])

// 自动识别可更新的剧集
const autoDetectUpdatable = () => {
  followedShows.value.forEach(show => {
    // 如果 Emby 库集数少于 TMDB 集数，标记为可更新
    if (show.embyEpisodes < show.tmdbEpisodes) {
      show.status = 'updatable'
    } else if (show.embyEpisodes === show.tmdbEpisodes) {
      // 如果集数相等，标记为已同步
      show.status = 'synced'
    }
  })
}

// 方法
const getStatusLabel = (status: Show['status']) => {
  const statusMap: Record<Show['status'], string> = {
    synced: '已同步',
    updatable: '可更新'
  }
  return statusMap[status]
}

const getPriorityLabel = (priority: Show['priority']) => {
  const priorityMap: Record<Show['priority'], string> = {
    high: '高',
    medium: '中',
    low: '低'
  }
  return priorityMap[priority]
}

const getUpdateStatusClass = (embyEpisodes: number, tmdbEpisodes: number) => {
  if (embyEpisodes === tmdbEpisodes) return 'status-up-to-date'
  if (embyEpisodes < tmdbEpisodes) return 'status-needs-update'
  return 'status-ahead'
}

const getUpdateStatusText = (embyEpisodes: number, tmdbEpisodes: number) => {
  if (embyEpisodes === tmdbEpisodes) return '已同步'
  if (embyEpisodes < tmdbEpisodes) return `需更新 ${tmdbEpisodes - embyEpisodes}集`
  return '领先更新'
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString()
}

const formatTime = (date: Date) => {
  return date.toLocaleTimeString()
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/placeholder-poster.jpg'
}

const filterFollowedShows = () => {
  // 搜索逻辑已在计算属性中实现
}

const filterByStatus = (status: string | number) => {
  activeStatus.value = status as string
}

const showAddFollow = () => {
  addFollowVisible.value = true
  searchEmbyQuery.value = ''
  embySearchResults.value = []
  selectedShow.value = null
}

const searchEmbyLibrary = async () => {
  if (!searchEmbyQuery.value.trim()) {
    embySearchResults.value = []
    return
  }

  try {
    // 模拟 API 调用
    await new Promise(resolve => setTimeout(resolve, 500))

    // 模拟搜索结果
    embySearchResults.value = [
      {
        id: 'new1',
        name: '新剧集1',
        posterPath: 'https://image.tmdb.org/t/p/original/kMa1TSDj76zTSleXE7xsuZ4s3i0.jpg',
        releaseYear: 2024,
        totalSeasons: 1,
        overview: '这是一个新的剧集...'
      },
      {
        id: 'new2',
        name: '新剧集2',
        posterPath: 'https://image.tmdb.org/t/p/original/by8z9Fe8y7p4jo2YlW2SZDnptyT.jpg',
        releaseYear: 2024,
        totalSeasons: 2,
        overview: '这是另一个新剧集...'
      }
    ]
  } catch (error) {
    console.error('搜索失败:', error)
    ElMessage.error('搜索失败，请重试')
  }
}

const addToFollows = (show: EmbySearchResult) => {
  selectedShow.value = show
  followForm.value = {
    status: 'updatable',
    priority: 'medium'
  }
}

const confirmAddFollow = () => {
  if (!selectedShow.value) return

  const newFollow: Show = {
    id: Date.now().toString(),
    name: selectedShow.value.name,
    status: followForm.value.status,
    priority: followForm.value.priority,
    posterPath: selectedShow.value.posterPath,
    releaseYear: selectedShow.value.releaseYear,
    totalSeasons: selectedShow.value.totalSeasons,
    embyEpisodes: 0,
    tmdbEpisodes: 0,
    overview: selectedShow.value.overview,
    followedAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString()
  }

  followedShows.value.push(newFollow)
  ElMessage.success('添加关注成功')
  addFollowVisible.value = false
}

const editFollow = (show: Show) => {
  currentEditingShow.value = show
  editForm.value = {
    status: show.status,
    priority: show.priority
  }
  editFollowVisible.value = true
}

const confirmEditFollow = () => {
  if (!currentEditingShow.value) return

  const updatedShow = {
    ...currentEditingShow.value,
    status: editForm.value.status,
    priority: editForm.value.priority
  }

  const index = followedShows.value.findIndex(s => s.id === updatedShow.id)
  if (index > -1) {
    followedShows.value[index] = updatedShow
    ElMessage.success('修改成功')
  } else {
    ElMessage.error('未找到该关注')
  }

  editFollowVisible.value = false
  currentEditingShow.value = null
}

const unfollowShow = async (show: Show) => {
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

// 生命周期
onMounted(() => {
  autoDetectUpdatable() // 自动识别可更新的剧集
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
      }
    }

    .search-filter-inline {
      display: flex;
      gap: 0.8rem;
      align-items: center;
      flex: 1;
      max-width: 600px;

      .search-input-wrapper {
        flex: 1;
        min-width: 200px;
      }

      .filter-container {
        flex-shrink: 0;

        .filter-tabs {
          display: flex;
          gap: 0.4rem;
          background: #f8f9fa;
          border-radius: 16px;
          padding: 0.15rem;

          .filter-tab {
            display: flex;
            align-items: center;
            gap: 0.3rem;
            padding: 0.25rem 0.5rem;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 0.75rem;

            &:hover {
              background: #e9ecef;
            }

            &.active {
              background: #409eff;
              color: white;
            }

            .tab-label {
              font-size: 0.75rem;
              font-weight: 500;
            }

            .tab-count {
              background: #e6f7ff;
              color: #409eff;
              padding: 0.1rem 0.3rem;
              border-radius: 6px;
              font-size: 0.6rem;
              font-weight: 600;
            }
          }
        }
      }
    }

    .header-actions {
      display: flex;
      gap: 0.6rem;
      flex-shrink: 0;

      .add-btn,
      .refresh-btn {
        font-size: 0.85rem;
        padding: 0.4rem 0.8rem;
      }
    }
  }

  .follow-list {
    .follow-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.2rem;
      margin-bottom: 2rem;
    }

    .follow-card {
      background: white;
      border-radius: 16px;
      padding: 1.2rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      border: 1px solid #f8f9fa;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, #409eff, #67c23a);
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
        border-color: #e1f5fe;

        &::before {
          opacity: 1;
        }
      }

      &.updatable {
        border-color: #fff3cd;
        background: linear-gradient(135deg, #ffffff 0%, #fffbf0 100%);
      }

      &.synced {
        border-color: #e8f5e8;
        background: linear-gradient(135deg, #ffffff 0%, #f8fff8 100%);
      }

      .show-poster {
        position: relative;
        margin-bottom: 1rem;
        text-align: center;

        img {
          width: 100%;
          height: 180px;
          border-radius: 12px;
          object-fit: cover;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .status-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          padding: 0.4rem 0.8rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          color: white;
          backdrop-filter: blur(10px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

          &.updatable {
            background: linear-gradient(135deg, #ffc107, #ffdb4d);
            color: #1a1a1a;
          }

          &.synced {
            background: linear-gradient(135deg, #67c23a, #85ce61);
          }
        }
      }

      .show-info {
        .show-name {
          margin: 0 0 1rem 0;
          font-size: 1.3rem;
          color: #1a1a1a;
          font-weight: 600;
          line-height: 1.3;
          text-align: center;
        }

        .episode-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.8rem;
          margin-bottom: 1.2rem;

          .stat-item {
            text-align: center;
            padding: 0.8rem 0.6rem;
            background: #f8f9fa;
            border-radius: 10px;
            transition: all 0.3s ease;

            &:hover {
              background: #e9ecef;
              transform: translateY(-2px);
            }

            .stat-label {
              display: block;
              font-size: 0.75rem;
              color: #6c757d;
              font-weight: 500;
              margin-bottom: 0.3rem;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }

            .stat-value {
              display: block;
              font-size: 1.1rem;
              font-weight: 700;
              color: #1a1a1a;

              &.status-up-to-date {
                color: #28a745;
              }

              &.status-needs-update {
                color: #dc3545;
              }

              &.status-ahead {
                color: #17a2b8;
              }
            }
          }
        }

        .card-actions {
          display: flex;
          gap: 0.8rem;
          justify-content: center;

          .el-button {
            flex: 1;
            border-radius: 8px;
            font-weight: 500;
            font-size: 0.85rem;
            padding: 0.5rem 0.8rem;
            transition: all 0.3s ease;

            &:hover {
              transform: translateY(-1px);
            }
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

.add-follow-dialog {
  .search-section {
    margin-bottom: 2rem;

    h4 {
      margin-bottom: 1rem;
      color: #1a1a1a;
    }
  }

  .search-results {
    margin-bottom: 2rem;

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

  .follow-settings {
    h4 {
      margin-bottom: 1rem;
      color: #1a1a1a;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .emby-follow {
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

      .search-filter-inline {
        flex-direction: column;
        gap: 0.8rem;
        max-width: none;

        .search-input-wrapper {
          min-width: auto;
        }

        .filter-container {
          align-self: center;

          .filter-tabs {
            flex-wrap: wrap;
            justify-content: center;
            gap: 0.3rem;

            .filter-tab {
              padding: 0.2rem 0.4rem;
              font-size: 0.7rem;
            }
          }
        }
      }

      h1 {
        font-size: 1.4rem;
      }
    }

    .follow-list {
      .follow-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .follow-card {
        padding: 1rem;

        .show-poster {
          img {
            height: 160px;
          }
        }

        .show-info {
          .show-name {
            font-size: 1.2rem;
          }

          .episode-stats {
            grid-template-columns: 1fr;
            gap: 0.7rem;

            .stat-item {
              padding: 0.7rem 0.5rem;
            }
          }

          .card-actions {
            flex-direction: column;
            gap: 0.7rem;

            .el-button {
              width: 100%;
              font-size: 0.8rem;
              padding: 0.4rem 0.7rem;
            }
          }
        }
      }
    }
  }
}
</style>
