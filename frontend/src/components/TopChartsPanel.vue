<!-- 排行榜面板组件 -->
<template>
  <div class="top-charts-Panel-container">
    <div class="panel-header" :style="headerStyle">
      <EarLeftIcon class="ear-icon" />
      <h3 class="panel-title">{{ props.title }}</h3>
      <EarRightIcon class="ear-icon" />
    </div>
  </div>
</template>

<script setup lang="ts">
import EarLeftIcon from '@/components/icon/EarLeftIcon.vue'
import EarRightIcon from '@/components/icon/EarRightIcon.vue'
import type { ITrendItem } from '@/types/dailyRecommendation'

const props = defineProps({
  title: {
    required: true,
    type: String
  },
  topChartList: {
    required: true,
    type: Array as PropType<ITrendItem[]>
  }
})

const headerStyle = computed(() => {
  const bg = props.topChartList[0]?.poster_path || ''
  return {
    backgroundImage: `url(${bg})`
  }
})
</script>

<style scoped lang="scss">
.top-charts-Panel-container {
  .panel-header {
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-size: cover;
    background-position: center;
    .ear-icon {
      width: 30px;
      height: 30px;
    }
    .panel-title {
      font-size: 22px;
      font-weight: 800;
      margin: 0;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
      color: var(--el-text-color-primary);
    }
  }
}
</style>
