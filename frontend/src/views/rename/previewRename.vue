<template>
  <div class="preview-rename-container">
    <div class="preview-header">
      <h2>预览重命名结果</h2>
      <div>已选择 32 个文件</div>
      <el-button type="success">批量删除</el-button>
      <el-button type="success">执行修改</el-button>
    </div>

    <el-table
      :data="renameStore.renameFileList"
      border
      style="height: calc(100vh - 59px - 40px - 48px - 35px - 24px - 1px)"
    >
      <el-table-column fixed type="selection" align="center" width="55" />
      <el-table-column fixed type="index" align="center" label="序号" width="60" />
      <el-table-column prop="name" label="原文件名" />
      <el-table-column prop="newName" label="新文件名" />
      <el-table-column prop="fileType" label="文件类型" />
      <el-table-column align="center" fixed="right" label="操作" width="60">
        <template #default>
          <el-icon><Delete class="delete-icon" /></el-icon>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { Delete } from '@element-plus/icons-vue'

const renameStore = useRenameStore()
</script>

<style scoped lang="scss">
.preview-rename-container {
  width: 100%;
  height: 100%;
  background: var(--el-bg-color-overlay);
  border-radius: var(--el-border-radius-base);
  padding: 1.5rem;
  box-shadow: var(--el-box-shadow-light);
  .preview-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }
  .delete-icon {
    cursor: pointer;
  }
}
</style>
