<template>
  <div class="preview-rename-container">
    <div class="preview-header">
      <h2 class="header-name">预览重命名结果</h2>
      <div class="preview-operations">
        <el-button type="warning" @click="batchDelete" :disabled="!selectedFiles.length"> 批量移除 </el-button>
        <el-button
          type="danger"
          @click="batchDeleteFile(selectedFiles.map(item => item.fullPath))"
          :disabled="!selectedFiles.length"
        >
          批量删除
        </el-button>
        <el-button type="success" @click="executeRename" :disabled="!renameStore.renameFileList.length">
          执行重命名
        </el-button>
      </div>
    </div>

    <el-table
      :data="renameStore.renameFileList"
      border
      @selection-change="handleSelectionChange"
      :row-class-name="getRowClassName"
      style="height: calc(100vh - 59px - 40px - 48px - 35px - 24px - 1px)"
    >
      <el-table-column fixed type="selection" align="center" width="55" />
      <el-table-column fixed type="index" align="center" label="序号" width="60" />
      <el-table-column prop="name" label="原文件名" min-width="200">
        <template #default="{ row }">
          <el-tooltip :content="row.fullPath" placement="top">
            <span>{{ row.name }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="newName" label="新文件名" min-width="200">
        <template #default="{ row }">
          <div class="new-name-cell">
            <span :class="{ 'text-warning': row.status === 'warning', 'text-error': row.status === 'error' }">
              {{ row.newName }}
            </span>
            <el-tooltip v-if="row.statusText" :content="row.statusText" placement="top">
              <el-icon class="status-icon" :class="row.status">
                <Warning v-if="row.status === 'warning'" />
                <CircleClose v-if="row.status === 'error'" />
                <CircleCheck v-if="row.status === 'success'" />
              </el-icon>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="解析信息" min-width="150" v-if="renameStore.ruleForm.model === 'tv'">
        <template #default="{ row }">
          <div v-if="row.parseResult">
            <div>季：{{ row.parseResult.season !== undefined ? row.parseResult.season : '未知' }}</div>
            <div>集：{{ row.parseResult.episode !== undefined ? row.parseResult.episode : '未知' }}</div>
            <div>置信度：{{ (row.parseResult.confidence * 100).toFixed(0) }}%</div>
          </div>
          <span v-else>未解析</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="fileType"
        label="文件类型"
        width="100"
        :filters="renameStore.fileTypeList"
        :filter-method="filterType"
      />
      <el-table-column align="center" fixed="right" label="操作" width="120">
        <template #default="{ row }">
          <el-tooltip content="编辑" placement="top">
            <el-button type="primary" link @click="editFileName(row)">
              <el-icon><Edit /></el-icon>
            </el-button>
          </el-tooltip>
          <el-tooltip content="移除" placement="top">
            <el-button type="warning" link @click="deleteFile(row)">
              <el-icon><Remove /></el-icon>
            </el-button>
          </el-tooltip>
          <el-tooltip content="删除" placement="top">
            <el-button type="danger" link @click="batchDeleteFile([row.fullPath])">
              <el-icon><Delete /></el-icon>
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑文件名对话框 -->
    <el-dialog v-model="editDialogVisible" title="编辑文件名" width="35%">
      <el-form :model="editForm" label-width="100px">
        <el-form-item label="原文件名">
          <span>{{ editingFile?.name }}</span>
        </el-form-item>
        <el-form-item label="新文件名">
          <el-input v-model="editForm.newName" placeholder="直接输入完整的文件名" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmEdit">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { Delete, Edit, Warning, CircleClose, CircleCheck, Remove } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { IRenameFileItem } from '@/types/rename'
import { useRenameStore } from '@/stores/rename'

const renameStore = useRenameStore()
const selectedFiles = ref<IRenameFileItem[]>([])

// 编辑相关
const editDialogVisible = ref(false)
const editingFile = ref<IRenameFileItem | null>(null)
const editForm = ref({
  newName: ''
})

// 筛选类型
const filterType = (value: string, row: IRenameFileItem) => {
  return row.fileType === value
}

// selection改变事件
const handleSelectionChange = (newSelection: IRenameFileItem[]) => {
  selectedFiles.value = newSelection.sort((a, b) => a.id - b.id)
}

// 批量移除
const batchDelete = () => {
  ElMessageBox.confirm('确定从表格中移除选中文件吗？移除后仍可在数据源中找到。', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    renameStore.batchDeleteFiles(selectedFiles.value)
    ElMessage.success('移除成功')
    selectedFiles.value = []
  })
}

// 移除单个文件
const deleteFile = (file: IRenameFileItem) => {
  ElMessageBox.confirm('确定从表格中移除该文件吗？移除后仍可在数据源中找到。', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    renameStore.deleteFile(file)
    ElMessage.success('移除成功')
  })
}

// 批量删除文件
const batchDeleteFile = (fullPathList: string[]) => {
  ElMessageBox.confirm('确定要删除选中文件吗？此操作会从系统中彻底移除文件，请谨慎操作。', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const res = await renameStore.deleteFileBatch(fullPathList)
    if (res) selectedFiles.value = []
  })
}

// 更新预览文件名
const updatePreviewName = () => {
  if (!editingFile.value) return

  // 尝试从新文件名中解析季和集
  const match = editForm.value.newName.match(/S(\d{1,2})E(\d{1,2})/i)
  const parseResult = match
    ? {
        season: parseInt(match[1]),
        episode: parseInt(match[2]),
        confidence: 1
      }
    : {
        confidence: 1
      }

  renameStore.renameFileList.forEach(item => {
    if (item.id === editingFile.value?.id) {
      item.newName = editForm.value.newName
      item.parseResult = parseResult
      item.status = 'success'
      item.statusText = '手动编辑'
    }
  })
}

// 编辑文件名
const editFileName = (file: IRenameFileItem) => {
  editingFile.value = file
  editForm.value = {
    newName: file.newName || file.name // 如果没有新文件名，使用原文件名
  }
  editDialogVisible.value = true
}

// 确认编辑
const confirmEdit = () => {
  if (editForm.value.newName.trim() === '') {
    ElMessage.warning('新文件名不能为空')
    return
  }
  if (!editingFile.value) return
  // 最后一次更新，确保所有变更都已应用
  updatePreviewName()
  editDialogVisible.value = false
  ElMessage.success('更新成功')
}

// 执行重命名
const executeRename = () => {
  ElMessageBox.confirm('确认执行重命名操作吗？此操作不可撤销！', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    renameStore.executeRename()
  })
}

// 获取行的类名
const getRowClassName = (row: { row: IRenameFileItem }) => {
  if (!row.row.parseResult) return ''
  const confidence = row.row.parseResult.confidence
  if (confidence < 0.5) return 'low-confidence-row'
  if (confidence < 0.8) return 'medium-confidence-row'
  return ''
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
    .header-name {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .preview-operations {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  }

  .new-name-cell {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    .text-warning {
      color: var(--el-color-warning);
    }

    .text-error {
      color: var(--el-color-danger);
    }

    .status-icon {
      font-size: 16px;

      &.warning {
        color: var(--el-color-warning);
      }

      &.error {
        color: var(--el-color-danger);
      }

      &.success {
        color: var(--el-color-success);
      }
    }
  }
}

:deep(.low-confidence-row) {
  background-color: var(--el-color-danger-light-9);
  &:hover > td {
    background-color: var(--el-color-danger-light-8) !important;
  }
  td {
    background-color: var(--el-color-danger-light-9) !important;
  }
}

:deep(.medium-confidence-row) {
  background-color: var(--el-color-warning-light-9);
  &:hover > td {
    background-color: var(--el-color-warning-light-8) !important;
  }
  td {
    background-color: var(--el-color-warning-light-9) !important;
  }
}

// 确保斑马纹样式不会覆盖我们的状态样式
:deep(.el-table__row) {
  &.el-table__row--striped {
    &.low-confidence-row td,
    &.medium-confidence-row td {
      background-color: inherit !important;
    }
  }
}
</style>
