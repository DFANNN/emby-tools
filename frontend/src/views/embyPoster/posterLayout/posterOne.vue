<template>
  <div class="cover-demo" :style="{ background: poster.backgroundGradient }">
    <div class="cover-left">
      <div class="cover-title">{{ poster.Name }}</div>
      <div class="cover-subtitle">
        {{ poster.CollectionType.toUpperCase() }}
      </div>
    </div>
    <div class="cover-right">
      <div class="cover-card" v-for="(url, i) in poster.imageUrls" :key="i">
        <img :src="url" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps(['poster'])
</script>

<style scoped lang="scss">
.cover-demo {
  display: flex;
  width: 640px;
  height: 360px;
  background: linear-gradient(120deg, #3a7bd5 0%, #00d2ff 100%);
  overflow: hidden;
  .cover-left {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    padding-left: 36px;
    min-width: 160px;
    .cover-title {
      font-size: 36px;
      color: #fff;
      font-family: 'FZLanTingHei', '微软雅黑', sans-serif;
      font-weight: bold;
      letter-spacing: 4px;
      margin-bottom: 4px;
      word-break: break-all;
      white-space: pre-wrap;
      overflow-wrap: break-word;
      max-width: 60%;
    }
    .cover-subtitle {
      font-size: 16px;
      color: #e0e0e0;
      letter-spacing: 6px;
      font-family: 'FZLanTingHei', 'Roboto Mono', monospace;
      margin-left: 4px;
    }
  }
  .cover-right {
    flex: 0.8;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    min-width: 280px;
    padding-right: 0;
    .cover-card {
      width: 120px;
      height: 160px;
      border-radius: 16px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18);
      overflow: hidden;
      background: #fff;
      transition: transform 0.2s;
      transform: rotate(20deg) !important;
      &:nth-child(1) {
        margin-top: -60px;
      }
      &:nth-child(2) {
        margin-top: -40px;
      }
      &:nth-child(3) {
        margin-top: -20px;
      }
      &:nth-child(4) {
        margin-top: -60px;
        margin-left: -60px;
      }
      &:nth-child(5) {
        margin-top: -40px;
        margin-left: -60px;
      }
      &:nth-child(6) {
        margin-top: -20px;
        margin-left: -60px;
      }
      &:nth-child(7) {
        margin-top: -60px;
        margin-left: -120px;
      }
      &:nth-child(8) {
        margin-top: -40px;
        margin-left: -120px;
      }
      &:nth-child(9) {
        margin-top: -20px;
        margin-left: -120px;
      }
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
}
</style>
