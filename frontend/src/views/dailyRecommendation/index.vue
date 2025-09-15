<template>
  <div>
    <HeroCarousel />
    <div class="top-rated-row">
      <TopChartsPanel
        title="热门电影"
        type="moviePopular"
        :top-chart-list="moviePopularList"
        :loading="moviePopularLoading"
        :error="moviePopularError"
        :on-retry="getMoviePopular"
      />
      <TopChartsPanel
        title="热门剧集"
        type="tvPopular"
        :top-chart-list="tvPopularList"
        :loading="tvPopularLoading"
        :error="tvPopularError"
        :on-retry="getTvPopular"
      />
      <TopChartsPanel
        title="高分电影"
        type="topRatedMovies"
        :top-chart-list="movieTopRatedList"
        :loading="movieTopRatedLoading"
        :error="movieTopRatedError"
        :on-retry="getMovieTopRated"
      />
      <TopChartsPanel
        title="高分剧集"
        type="topRatedTV"
        :top-chart-list="tvTopRatedList"
        :loading="tvTopRatedLoading"
        :error="tvTopRatedError"
        :on-retry="getTvTopRated"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { topRatedMovies, topRatedTV, moviePopular, tvPopular } from '@/api/dailyRecommendation'
import HeroCarousel from '@/views/dailyRecommendation/heroCarousel.vue'
import TopChartsPanel from '@/components/TopChartsPanel.vue'
import type { ITrendItem } from '@/types/dailyRecommendation'

const movieTopRatedList = ref<ITrendItem[]>([])
const tvTopRatedList = ref<ITrendItem[]>([])
const moviePopularList = ref<ITrendItem[]>([])
const tvPopularList = ref<ITrendItem[]>([])

// loading / error 状态
const moviePopularLoading = ref<boolean>(false)
const tvPopularLoading = ref<boolean>(false)
const movieTopRatedLoading = ref<boolean>(false)
const tvTopRatedLoading = ref<boolean>(false)

const moviePopularError = ref<string>('')
const tvPopularError = ref<string>('')
const movieTopRatedError = ref<string>('')
const tvTopRatedError = ref<string>('')

// 获取热门电影
const getMoviePopular = async () => {
  moviePopularLoading.value = true
  moviePopularError.value = ''
  try {
    const { data: res } = await moviePopular(1)
    if (res.code === 200) {
      moviePopularList.value = res.data
    } else {
      moviePopularError.value = res.message || '加载失败'
    }
  } catch (e) {
    moviePopularError.value = '请求失败或超时，请重试'
  } finally {
    moviePopularLoading.value = false
  }
}

// 获取热门电影
const getTvPopular = async () => {
  tvPopularLoading.value = true
  tvPopularError.value = ''
  try {
    const { data: res } = await tvPopular(1)
    if (res.code === 200) {
      tvPopularList.value = res.data
    } else {
      tvPopularError.value = res.message || '加载失败'
    }
  } catch (e) {
    tvPopularError.value = '请求失败或超时，请重试'
  } finally {
    tvPopularLoading.value = false
  }
}

// 获取高分电影
const getMovieTopRated = async () => {
  movieTopRatedLoading.value = true
  movieTopRatedError.value = ''
  try {
    const { data: res } = await topRatedMovies(1)
    if (res.code === 200) {
      movieTopRatedList.value = res.data
    } else {
      movieTopRatedError.value = res.message || '加载失败'
    }
  } catch (e) {
    movieTopRatedError.value = '请求失败或超时，请重试'
  } finally {
    movieTopRatedLoading.value = false
  }
}

// 获取高分剧集
const getTvTopRated = async () => {
  tvTopRatedLoading.value = true
  tvTopRatedError.value = ''
  try {
    const { data: res } = await topRatedTV(1)
    if (res.code === 200) {
      tvTopRatedList.value = res.data
    } else {
      tvTopRatedError.value = res.message || '加载失败'
    }
  } catch (e) {
    tvTopRatedError.value = '请求失败或超时，请重试'
  } finally {
    tvTopRatedLoading.value = false
  }
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
  gap: 1rem;
  margin-top: 16px;
}

@media (max-width: 1200px) {
  .top-rated-row {
    grid-template-columns: 1fr;
  }
}
</style>
