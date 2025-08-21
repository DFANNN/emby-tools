<template>
  <div class="counts-container">
    <div class="header">
      <span class="header-icon">⏱️</span>
      <h3>媒体库概览</h3>
      <el-tag type="success" size="small">实时</el-tag>
    </div>
    <div class="content">
      <div v-for="item in countList" :class="{ 'count-item': true, total: item.title === '总计' }">
        <div class="count-number">{{ item.count }}</div>
        <div class="count-label">{{ item.title }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const countList = ref([
  { count: 1234, title: '电影' },
  { count: 567, title: '剧集' },
  { count: 89, title: '音乐' },
  { count: 1890, title: '总计' }
])
</script>

<style scoped lang="scss">
.counts-container {
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
  .content {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;

    .count-item {
      text-align: center;
      padding: 1rem;
      background: var(--el-bg-color-page);
      border-radius: 12px;

      &.total {
        grid-column: span 2;
        background: var(--el-color-primary-light-8);
        border: 1px solid #91d5ff;
      }
      .count-number {
        font-size: 2rem;
        font-weight: 700;
        color: var(--el-color-primary);
        margin-bottom: 0.5rem;
      }
      .count-label {
        font-size: 0.875rem;
        color: var(--el-text-color-secondary);
      }
    }
  }
}
</style>
