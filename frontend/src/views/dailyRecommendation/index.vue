<template>
  <div>
    <HeroCarousel />
    <div class="top-rated-row">
      <TopRatedPanel title="热门电影" :list="moviePopularList" @more="movieDialogVisible = true" />
      <TopRatedPanel title="热门剧集" :list="tvPopularList" @more="tvDialogVisible = true" />
      <TopRatedPanel title="高分电影" :list="movieTopRatedList" @more="movieDialogVisible = true" />
      <TopRatedPanel title="高分剧集" :list="tvTopRatedList" @more="tvDialogVisible = true" />
    </div>

    <el-dialog v-model="movieDialogVisible" title="高分电影" width="80%">
      <TopRatedList :list="movieTopRatedList" />
    </el-dialog>
    <el-dialog v-model="tvDialogVisible" title="高分剧集" width="80%">
      <TopRatedList :list="tvTopRatedList" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { topRated as topRatedMovies, topRatedTV, moviePopular, tvPopular } from '@/api/dailyRecommendation'
import HeroCarousel from '@/views/dailyRecommendation/heroCarousel.vue'
import TopRatedPanel from '@/components/TopRatedPanel.vue'
import TopRatedList from '@/components/TopRatedList.vue'
import type { ITrendItem } from '@/types/dailyRecommendation'

const movieTopRatedList = ref<ITrendItem[]>([])
const tvTopRatedList = ref<ITrendItem[]>([])
const moviePopularList = ref<ITrendItem[]>([])
const tvPopularList = ref<ITrendItem[]>([])
const movieDialogVisible = ref(false)
const tvDialogVisible = ref(false)

// 获取热门电影
const getMoviePopular = async () => {
  const { data: res } = await moviePopular()
  if (res.code === 200) moviePopularList.value = res.data
}

// 获取热门电影
const getTvPopular = async () => {
  const { data: res } = await tvPopular()
  if (res.code === 200) tvPopularList.value = res.data
}

// 获取高分电影
const getMovieTopRated = async () => {
  const { data: res } = await topRatedMovies()
  if (res.code === 200) movieTopRatedList.value = res.data
}

// 获取高分剧集
const getTvTopRated = async () => {
  const { data: res } = await topRatedTV()
  if (res.code === 200) tvTopRatedList.value = res.data
}

onMounted(() => {
  getMoviePopular()
  getTvPopular()
  getMovieTopRated()
  getTvTopRated()
})
</script>

<style scoped lang="scss">
.top-rated-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 16px;
}

@media (max-width: 1200px) {
  .top-rated-row {
    grid-template-columns: 1fr;
  }
}
</style>
