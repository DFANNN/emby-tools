<template>
  <el-dialog v-model="dialogVisible" :title="props.title" width="70vw">
    <span>This is a message</span>
  </el-dialog>
</template>

<script setup lang="ts">
import type { ITrendItem } from '@/types/dailyRecommendation'

const dialogVisible = ref(false)

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

const showDialog = () => {
  dialogVisible.value = true
}

defineExpose({ showDialog })
</script>

<style></style>
