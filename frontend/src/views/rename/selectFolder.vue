<template>
  <el-dialog v-model="renameStore.dialogVisible" title="选择文件夹" width="60%" @close="renameStore.cancelDialog()">
    <div class="current-path">
      <div class="current-path-header">
        <el-tooltip content="返回根目录" placement="top">
          <el-icon class="root-icon" @click="renameStore.returnRoot()"><Monitor /></el-icon>
        </el-tooltip>
        <span>当前路径：</span>
      </div>
      <div
        v-for="(item, index) in renameStore.currentPathList"
        :key="index"
        @click="renameStore.goToPath(item.fullPath, index)"
        class="path-item"
      >
        <div class="path-name">{{ item.name }}</div>
        <div class="path-divide" v-if="renameStore.currentPathList.length - 1 !== index">\</div>
      </div>
    </div>
    <div class="select-folder-warp" v-if="renameStore.diskFolderList.length">
      <div
        v-for="(item, index) in renameStore.diskFolderList"
        :key="index"
        class="folder-item"
        @click="renameStore.selectFolderHandler(item)"
      >
        <div class="icon-warp">
          <DiskIcon v-if="item.type === 'disk'" />
          <el-icon v-if="item.type === 'folder'"><FolderOpened /></el-icon>
          <el-icon v-if="item.type === 'file'"><Document /></el-icon>
        </div>
        <div class="folder-name">{{ item.name }}</div>
      </div>
    </div>
    <div v-else class="folder-empty">
      <el-empty description="暂无文件..." />
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="renameStore.cancelDialog()">取消</el-button>
        <el-button type="primary" @click="renameStore.confirmDialog()">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { FolderOpened, Document, Monitor } from '@element-plus/icons-vue'
import DiskIcon from '@/components/icon/DiskIcon.vue'

const renameStore = useRenameStore()
</script>

<style scoped lang="scss">
.current-path {
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .current-path-header {
    display: flex;
    align-items: center;
    .root-icon {
      cursor: pointer;
      margin-right: 0.5rem;
      &:hover {
        color: var(--el-color-primary);
      }
    }
  }
  .path-item {
    display: flex;
    .path-name {
      cursor: pointer;
      max-width: 10rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      &:hover {
        color: var(--el-color-primary);
      }
    }
    .path-divide {
      margin: 0 10px;
    }
  }
}
.select-folder-warp {
  width: 100%;
  height: 50vh;
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  padding: 1rem;
  overflow-y: auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  gap: 0.5rem 1rem;
  grid-auto-rows: min-content; /* 自动调整行高 */
  .folder-item {
    display: flex;
    align-items: center;
    padding: 0.5rem;
    border-radius: 0.25rem;
    cursor: pointer;
    .icon-warp {
      display: flex;
      align-items: center;
      margin-right: 0.5rem;
    }
    .folder-name {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    &:hover {
      background: var(--el-border-color);
    }
  }
}
.folder-empty {
  width: 100%;
  height: 50vh;
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  padding: 1rem;
  overflow-y: auto;
}
</style>
