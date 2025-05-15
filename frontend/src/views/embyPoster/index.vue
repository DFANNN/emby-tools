<template>
  <div class="index-container">
    <div class="left">
      <linkEmby />
    </div>
    <div class="right">
      <previewPoster />
    </div>
    <!-- <RightComponent /> -->
    <!-- <div class="left">
      <LeftComponent />
    </div>
    <div class="right">
      <RightComponent />
    </div> -->
  </div>
</template>

<script setup lang="ts">
import linkEmby from '@/views/embyPoster/linkEmby.vue'
import previewPoster from '@/views/embyPoster/previewPoster.vue'
</script>

<style scoped lang="scss">
.index-container {
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  height: calc(100vh - 60px - 40px);
  .left {
    width: 30%;
    min-width: 400px;
  }
  .right {
    flex: 1;
  }
}
</style>
