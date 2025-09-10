<template>
  <el-dialog v-model="dialogVisible" :title="props.title" width="70vw">
    <div class="top-chart-list">
      <div v-for="item in topChartList" :key="item.id" class="grid-card">
        <img :src="item.poster_path" :alt="item.title || item.name || item.original_name" />
        <div class="name">{{ item.title || item.name || item.original_name }}</div>
        <div class="meta">
          <span class="date">{{ item.release_date || item.first_air_date }}</span>
          <span class="score">⭐ {{ (item.vote_average || 0).toFixed(1) }}</span>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { topRatedMovies, topRatedTV, moviePopular, tvPopular } from '@/api/dailyRecommendation'
import type { ITrendItem } from '@/types/dailyRecommendation'

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

const mapRequest: Record<string, any> = {
  topRatedMovies,
  topRatedTV,
  moviePopular,
  tvPopular
}

const getTopChartList = async (page: number = 1) => {
  const { data: res } = await mapRequest[props.type](page)
  if (res.code === 200) topChartList.value = res.data
}

const loadMore = () => {
  console.log(123)
}

const showDialog = () => {
  getTopChartList()
  dialogVisible.value = true
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
</style>
