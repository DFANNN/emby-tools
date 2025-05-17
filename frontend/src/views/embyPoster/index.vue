<template>
  <div class="index-container">
    <div class="left">
      <LinkEmby />
      <PosterRules />
    </div>
    <div class="right">
      <PreviewPoster />
    </div>
  </div>
</template>

<script setup lang="ts">
import LinkEmby from '@/views/embyPoster/linkEmby.vue'
import PreviewPoster from '@/views/embyPoster/previewPoster.vue'
import PosterRules from '@/views/embyPoster/posterRules.vue'
</script>

<style scoped lang="scss">
.index-container {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  .left {
    width: 360px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  .right {
    flex: 1;
  }
}
</style>
