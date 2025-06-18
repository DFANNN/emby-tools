<template>
  <el-dialog v-model="renameStore.dialogVisible" title="选择文件夹" width="60%">
    <div class="current-path">当前路径：/path</div>
    <div class="select-folder-warp"></div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="renameStore.dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="renameStore.dialogVisible = false">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
const renameStore = useRenameStore()
</script>

<style scoped lang="scss">
.current-path {
  margin-bottom: 1rem;
}
.select-folder-warp {
  width: 100%;
  height: 50vh;
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
}
</style>
