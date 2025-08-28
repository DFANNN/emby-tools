<template>
  <div class="header-container">
    <div class="title-section">
      <div class="title-icon">📊</div>
      <div class="title-text">
        <h1>Emby 信息看板</h1>
        <p>
          <p v-if="layoutStore.linkEmbyStatus">
            <el-tag type="success" size="small">Emby 已连接</el-tag>
            <span style="margin-left: 8px" v-if="homeStore.isLoading">正在刷新数据…</span>
            <span style="margin-left: 8px" v-else>最后更新时间：{{ homeStore.lastUpdated }}</span>
          </p>
          <p v-else>
            <el-tag type="info" size="small">Emby 未连接</el-tag>
          </p>
        </p>
      </div>
    </div>
    <div class="header-actions">
      <el-button
        type="primary"
        :loading="homeStore.isLoading"
        :disabled="homeStore.isLoading || !layoutStore.linkEmbyStatus"
        @click="homeStore.getEmbyAllInfo()"
      >
        <el-icon><Refresh /></el-icon>
        刷新数据
      </el-button>
      <el-button @click="openEmbyWeb">
        <el-icon><Link /></el-icon>
        打开 Emby
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Refresh, Link } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const homeStore = useHomeStore()
const layoutStore = useLayoutStore()

const openEmbyWeb = () => {
  if (!layoutStore.linkEmbyStatus) {
    ElMessage.warning('未连接 Emby，请先在设置中完成连接配置')
    return
  }
  window.open(layoutStore.embyUserInfo.EmbyAddress)
}
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
    .title-icon {
      font-size: 2rem;
    }
    .title-text {
      h1 {
        font-size: 1.6rem;
        color: var(--el-text-color-primary);
        margin: 0;
        font-weight: 700;
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
}

@media (max-width: 768px) {
  .header-container {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
