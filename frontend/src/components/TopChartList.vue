<!-- 排行榜面板查看更多组件 -->
<template>
  <el-dialog
    v-model="dialogVisible"
    :align-center="true"
    :close-on-click-modal="false"
    :title="props.title"
    width="70vw"
  >
    <el-scrollbar height="70vh" @scroll="onScroll" ref="scrollbarRef">
      <div class="top-chart-list">
        <div v-for="item in topChartList" :key="item.id" class="grid-card" @click="openTmdb(item)">
          <img :src="item.poster_path" :alt="item.title || item.name || item.original_name" />
          <div class="name">{{ item.title || item.name || item.original_name }}</div>
          <div class="meta">
            <span class="date">{{ item.release_date || item.first_air_date }}</span>
            <span class="score">⭐ {{ (item.vote_average || 0).toFixed(1) }}</span>
          </div>
        </div>
      </div>

      <div class="list-footer">
        <div v-if="loading" class="loading">
          <el-icon class="is-loading"><Loading /></el-icon>
          <span>加载中...</span>
        </div>
        <div v-else-if="finished" class="finished">没有更多了</div>
      </div>
    </el-scrollbar>
  </el-dialog>
</template>

<script setup lang="ts">
import { openTmdb } from '@/utils/utils'
import { topRatedMovies, topRatedTV, moviePopular, tvPopular } from '@/api/dailyRecommendation'
import type { ITrendItem } from '@/types/dailyRecommendation'
import { Loading } from '@element-plus/icons-vue'

const props = defineProps({
  title: {
    required: true,
    type: String
  },
  type: {
    required: true,
    type: String
  }
})

const dialogVisible = ref(false)

const topChartList = ref<ITrendItem[]>([])
const page = ref(1)
const loading = ref(false)
const finished = ref(false)
const scrollbarRef = ref()

const mapRequest: Record<string, any> = {
  topRatedMovies,
  topRatedTV,
  moviePopular,
  tvPopular
}

const getTopChartList = async (pageNum: number = 1) => {
  if (loading.value || finished.value) return
  loading.value = true
  try {
    const { data: res } = await mapRequest[props.type](pageNum)
    if (res.code === 200) {
      const list: ITrendItem[] = res.data || []
      if (pageNum === 1) {
        topChartList.value = list
      } else {
        topChartList.value.push(...list)
      }
      if (!list.length) {
        finished.value = true
      }
      page.value = pageNum
    }
  } finally {
    loading.value = false
  }
}

const loadMore = () => {
  if (loading.value || finished.value) return
  getTopChartList(page.value + 1)
}

const onScroll = () => {
  const wrapEl: HTMLElement | undefined = scrollbarRef.value?.wrapRef
  if (!wrapEl) return
  const threshold = 80
  if (wrapEl.scrollTop + wrapEl.clientHeight >= wrapEl.scrollHeight - threshold) {
    loadMore()
  }
}

const ensureScrollable = async () => {
  const wrapEl: HTMLElement | undefined = scrollbarRef.value?.wrapRef
  if (!wrapEl || loading.value || finished.value) return
  if (wrapEl.scrollHeight <= wrapEl.clientHeight) {
    await getTopChartList(page.value + 1)
    await nextTick()
    await ensureScrollable()
  }
}

const showDialog = () => {
  // 重置状态并加载第一页
  page.value = 1
  finished.value = false
  topChartList.value = []
  dialogVisible.value = true
  getTopChartList(1).then(() => nextTick(() => ensureScrollable()))
}

defineExpose({ showDialog })
</script>

<style scoped lang="scss">
.top-chart-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 16px;

  .grid-card {
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 8px;
    border-radius: 10px;
    padding: 10px;
    transition: all 0.2s ease;
    &:hover {
      transform: translateY(-3px);
    }

    img {
      width: 100%;
      aspect-ratio: 2 / 3;
      object-fit: cover;
      border-radius: 8px;
    }

    .name {
      color: var(--el-text-color-primary);
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
      justify-content: space-between;
      font-size: 12px;
      .data {
        color: var(--el-text-color-secondary);
      }
      .score {
        color: #ffd700;
        font-weight: 700;
      }
    }
  }
}

.list-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 0 8px;
  color: var(--el-text-color-secondary);
  .loading {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
  .finished {
    font-size: 12px;
  }
}

/* 响应式：根据屏幕宽度增加卡片最小宽度，提高大屏利用率 */
@media (min-width: 1440px) {
  .top-chart-list {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }
}

@media (min-width: 1920px) {
  .top-chart-list {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}
</style>
