<template>
  <div class="index-container">
    <div class="left">
      <LeftComponent />
    </div>
    <div class="right">
      <RightComponent />
    </div>
  </div>
</template>

<script setup lang="ts">
import LeftComponent from '@/views/embyPoster/left.vue'
import RightComponent from '@/views/embyPoster/right.vue'
</script>

<style scoped lang="scss">
.index-container {
  display: flex;
  justify-content: space-between;
  .left {
    width: 38%;
    height: calc(100vh - 60px - 40px);
    border: 1px solid var(--el-menu-border-color);
    border-radius: 8px;
  }
  .right {
    width: 60%;
    height: calc(100vh - 60px - 40px);
    border: 1px solid var(--el-menu-border-color);
    border-radius: 8px;
    margin-left: 2%;
  }
}
</style>
