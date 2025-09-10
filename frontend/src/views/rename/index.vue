<template>
  <div class="index-container">
    <div class="left">
      <RenameRules />
    </div>
    <div class="right">
      <previewPoster />
    </div>
  </div>
</template>

<script setup lang="ts">
import RenameRules from '@/views/rename/renameRules.vue'
import previewPoster from '@/views/rename/previewRename.vue'
</script>

<style scoped lang="scss">
.index-container {
  width: 100%;
  height: 100%;
  display: flex;
  gap: 1rem;
  .left {
    width: 25%;
    min-width: 400px;
    flex-shrink: 0; // 防止left被压缩
  }
  .right {
    flex: 1;
    min-width: 0; // 确保flex子项可以正确收缩
  }
}
</style>
