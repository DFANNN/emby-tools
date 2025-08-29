<template>
  <div class="storage">
    <div class="header">
      <span class="header-icon">💾</span>
      <h3>存储空间</h3>
      <el-tag :type="layoutStore.linkEmbyStatus ? 'success' : 'info'" size="small">{{
        layoutStore.linkEmbyStatus ? '监控中' : '未连接'
      }}</el-tag>
    </div>
    <div class="storage-overview">
      <div class="storage-main">
        <div class="storage-used">{{ props.storageInfo.TotalSize }}GB</div>
        <div class="storage-total">/ {{ props.storageInfo.DiskSize }}GB</div>
      </div>
      <div class="storage-percentage">{{ storagePercent }}%</div>
    </div>

    <el-progress :percentage="storagePercent" :color="getStorageColor(storagePercent)" :stroke-width="8" />

    <div class="storage-details">
      <!-- <div class="storage-item">
        <span>剩余空间:</span>
        <span class="storage-value">1.5TB</span>
      </div> -->
      <div class="storage-item">
        <span>电影占用:</span>
        <span class="storage-value">{{ props.storageInfo.MovieSize }}GB</span>
      </div>
      <div class="storage-item">
        <span>剧集占用:</span>
        <span class="storage-value">{{ props.storageInfo.EpisodeSize }}GB</span>
      </div>
      <div class="storage-item">
        <span>音乐占用:</span>
        <span class="storage-value">{{ props.storageInfo.AudioSize }}GB</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { EmbyStorageInfoType } from '@/types/home'

const layoutStore = useLayoutStore()

const storagePercent = computed(() => {
  if (!props.storageInfo.TotalSize || !props.storageInfo.DiskSize) return 0
  return Number(((props.storageInfo.TotalSize / props.storageInfo.DiskSize) * 100).toFixed(2))
})

const props = defineProps({
  storageInfo: {
    required: true,
    type: Object as PropType<EmbyStorageInfoType>
  }
})

// 获取存储空间颜色
const getStorageColor = (percentage: number) => {
  if (percentage < 70) return '#52c41a'
  if (percentage < 90) return '#faad14'
  return '#f5222d'
}
</script>

<style scoped lang="scss">
.storage {
  background: var(--el-bg-color-overlay);
  border-radius: var(--el-border-radius-base);
  padding: 1.5rem;
  box-shadow: var(--el-box-shadow-lighter);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--el-box-shadow-light);
  }
  .header {
    display: flex;
    align-items: center;
    margin-bottom: 1.5rem;
    .header-icon {
      font-size: 1.5rem;
      margin-right: 0.75rem;
    }
    h3 {
      color: var(--el-text-color-primary);
      font-size: 1.25rem;
      font-weight: 600;
      flex: 1;
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
        color: var(--el-text-color-secondary);
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
        color: var(--el-color-primary);
      }
    }
  }
}
</style>
