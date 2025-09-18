<template>
  <div class="header-container">
    <div class="title-section">
      <div class="title-text">
        <div class="title">
          <div class="title-icon">📊</div>
          <h1>Emby 信息看板</h1>
        </div>
        <div>
          <p v-if="layoutStore.linkEmbyStatus">
            <el-tag type="success" size="small">Emby 已连接</el-tag>
            <span style="margin-left: 8px" v-if="homeStore.isLoading">正在刷新数据…</span>
            <span style="margin-left: 8px" v-else>最后更新时间：{{ homeStore.lastUpdated }}</span>
          </p>
          <p v-else>
            <el-tag type="info" size="small">Emby 未连接</el-tag>
          </p>
        </div>
      </div>
    </div>
    <div class="header-actions">
      <el-button
        type="primary"
        :loading="homeStore.isLoading"
        :disabled="homeStore.isLoading || !layoutStore.linkEmbyStatus"
        @click="homeStore.getEmbyAllInfo()"
      >
        <el-icon class="refresh-icon"><Refresh /></el-icon>
        刷新数据
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Refresh } from '@element-plus/icons-vue'

const homeStore = useHomeStore()
const layoutStore = useLayoutStore()
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
  .title-section {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    flex-shrink: 0;
    .title-text {
      .title {
        display: flex;
        align-items: center;
        gap: 0.6rem;
        h1 {
          font-size: 1.6rem;
          color: var(--el-text-color-primary);
          margin: 0;
          font-weight: 700;
        }
        .title-icon {
          font-size: 2rem;
        }
      }
      p {
        margin: 0.25rem 0 0 0;
        font-size: 0.875rem;
        color: var(--el-text-color-secondary);
      }
    }
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--el-box-shadow-light);
  }

  .refresh-icon {
    margin-right: 0.4rem;
  }
}

@media (max-width: 768px) {
  .header-container {
    flex-direction: column;
    gap: 1rem;
    .title {
      justify-content: center;
    }
  }
}
</style>
