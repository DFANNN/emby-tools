<template>
  <div class="header-container">
    <div class="status-item">
      <span class="status-label">Emby 服务:</span>
      <el-tag :type="systemStatus.emby.status" size="small">
        {{ systemStatus.emby.message }}
      </el-tag>
    </div>
    <div class="status-item">
      <span class="status-label">磁盘健康:</span>
      <el-tag :type="systemStatus.disk.status" size="small">
        {{ systemStatus.disk.message }}
      </el-tag>
    </div>
    <div class="status-item">
      <span class="status-label">网络连接:</span>
      <el-tag :type="systemStatus.network.status" size="small">
        {{ systemStatus.network.message }}
      </el-tag>
    </div>
    <div class="status-item">
      <span class="status-label">最后更新:</span>
      <span class="status-time">{{ lastUpdateTime }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const lastUpdateTime = ref('2025-08-19 22:02:09')

// 系统状态
const systemStatus = ref<any>({
  emby: { status: 'success', message: '运行中' },
  disk: { status: 'warning', message: '注意' },
  network: { status: 'success', message: '正常' }
})
</script>

<style scoped lang="scss">
.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: var(--el-border-radius-base);
  padding: 1rem;
  box-shadow: var(--el-box-shadow-lighter);
  background: var(--el-bg-color-overlay);
  transition: all 0.3s ease;
  .status-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;

    .status-label {
      color: var(--el-text-color-secondary);
    }

    .status-time {
      font-size: 0.875rem;
      color: var(--el-color-primary);
    }
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--el-box-shadow-light);
  }
}

@media (max-width: 768px) {
  .header-container {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
