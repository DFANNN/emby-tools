<template>
  <div class="rule-card-container">
    <div :class="{ 'rule-item': true, 'info-card': props.isUpdateOrDelete, active: props.isSelect }">
      <div class="rule-item-header">
        <span class="rule-name">{{ props.rules.name }}</span>
        <div class="rule-actions" v-if="props.isUpdateOrDelete">
          <el-button type="primary" link>
            <el-icon><Edit /></el-icon>
          </el-button>
          <el-button type="danger" link>
            <el-icon><Delete /></el-icon>
          </el-button>
        </div>
        <div class="rule-preview" v-else>
          <el-tag size="small" type="success">{{
            embyPosterStore.layoutList.find(item => item.value === props.rules.layout)?.name
          }}</el-tag>
          <el-tag size="small" type="warning">
            {{ props.rules.source === 'local' ? '本地媒体' : 'TMDB热门' }}
          </el-tag>
        </div>
      </div>
      <p class="rule-description">{{ props.rules.description || '暂无描述' }}</p>
      <div class="rule-preview-bottom" v-if="props.isUpdateOrDelete">
        <el-tag size="small" type="success">{{
          embyPosterStore.layoutList.find(item => item.value === props.rules.layout)?.name
        }}</el-tag>
        <el-tag size="small" type="warning">
          {{ props.rules.source === 'local' ? '本地媒体' : 'TMDB热门' }}
        </el-tag>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEmbyPosterStore } from '@/stores/embyPoster'
import { Edit, Delete } from '@element-plus/icons-vue'
import type { RuleForm } from '@/types/embyPoster'

const embyPosterStore = useEmbyPosterStore()

const props = defineProps({
  // 规则数组
  rules: {
    type: Object as PropType<RuleForm>,
    required: true
  },
  // 是否可编辑和删除
  isUpdateOrDelete: {
    type: Boolean,
    default: false
  },
  // 是否选中
  isSelect: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped lang="scss">
.rule-card-container {
  .rule-item {
    display: flex;
    flex-direction: column;
    padding: 1rem;
    background: var(--el-bg-color-page);
    border-radius: var(--el-border-radius-base);
    cursor: pointer;
    transition: all 0.3s ease;
    border: 1px solid var(--el-border-color-lighter);

    &.info-card {
      padding: 1.5rem 2rem;
      background: var(--el-bg-color-overlay);
      &:hover {
        border-color: var(--el-color-primary);
      }
      &.active {
        border-color: var(--el-color-primary);
        background: var(--el-color-primary-light-9);
      }
    }

    .rule-item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      .rule-name {
        font-size: 1rem;
        font-weight: 500;
      }
      .rule-preview {
        display: flex;
        gap: 0.5rem;
      }
      .rule-actions {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
      }
    }

    .rule-description {
      font-size: 13px;
      color: var(--el-text-color-secondary);
      line-height: 1.4;
    }

    .rule-preview-bottom {
      margin-top: 1rem;
      display: flex;
      gap: 0.5rem;
    }

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      // border-color: var(--el-color-primary);
    }
  }
}
</style>
