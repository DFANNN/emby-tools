<template>
  <div class="preview-rename-container">
    <div class="preview-header">
      <h2>预览重命名结果</h2>
      <div>已选择 32 个文件</div>
      <el-button type="success">批量删除</el-button>
      <el-button type="success">执行修改</el-button>
    </div>

    <el-table :data="tableData" border style="height: calc(100vh - 59px - 40px - 48px - 35px - 24px - 1px)">
      <el-table-column fixed type="selection" align="center" width="55" />
      <el-table-column fixed type="index" align="center" label="序号" width="60" />
      <el-table-column prop="name" label="原文件名" />
      <el-table-column prop="state" label="新文件名" />
      <el-table-column prop="address" label="文件类型" />
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
const tableData = [
  {
    date: '2016-05-03',
    name: 'TTomTm',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
    tag: 'Home'
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
    tag: 'Office'
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
    tag: 'Home'
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
    tag: 'Office'
  }
]
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
