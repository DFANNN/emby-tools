<template>
  <div>
    <HeroCarousel />
    <MediaSlider title="影院上映中" :mediaList="nowPlayingList" />
    <MediaSlider title="本周趋势" :mediaList="weekTrendList" />
  </div>
</template>

<script setup lang="ts">
import { weekTrend, nowPlaying } from '@/api/dailyRecommendation'
import HeroCarousel from '@/views/dailyRecommendation/heroCarousel.vue'
import MediaSlider from '@/components/MediaSlider.vue'
import type { ITrendItem } from '@/types/dailyRecommendation'

const weekTrendList = ref<ITrendItem[]>([])
const nowPlayingList = ref<ITrendItem[]>([])

// 获取本周趋势
const getWeekTrend = async () => {
  const { data: res } = await weekTrend()
  if (res.code === 200) weekTrendList.value = res.data
}

// 获取影院上映中
const getNowPlaying = async () => {
  const { data: res } = await nowPlaying()
  if (res.code === 200) nowPlayingList.value = res.data
}

onMounted(() => {
  getWeekTrend()
  getNowPlaying()
})
</script>

<style></style>
