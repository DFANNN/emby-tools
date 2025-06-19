<template>
  <div class="preview-rename-container">
    <div class="preview-header">
      <h2>预览重命名结果</h2>
      <div class="preview-operations">
        <el-button type="success" class="ml-8">批量删除</el-button>
        <el-button type="success" class="ml-8">执行修改</el-button>
      </div>
    </div>

    <el-table
      :data="renameStore.renameFileList"
      border
      @selection-change="handleSelectionChange"
      style="height: calc(100vh - 59px - 40px - 48px - 35px - 24px - 1px)"
    >
      <el-table-column fixed type="selection" align="center" width="55" />
      <el-table-column fixed type="index" align="center" label="序号" width="60" />
      <el-table-column prop="name" label="原文件名" />
      <el-table-column prop="newName" label="新文件名" />
      <el-table-column
        prop="fileType"
        label="文件类型"
        :filters="renameStore.fileTypeList"
        :filter-method="filterType"
      />
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

// 筛选类型
const filterType = (value: string, row: any) => {
  return row.fileType === value
}

// selection改变事件
const handleSelectionChange = (newSelection: any[]) => {
  // 根据id排序
  newSelection.sort((a, b) => a.id - b.id)
  renameStore.selectRenameList = newSelection
}
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
    .preview-operations {
      display: flex;
      align-items: center;
      .ml-8 {
        margin-left: 0.5rem;
      }
    }
  }
  .delete-icon {
    cursor: pointer;
  }
}
</style>
