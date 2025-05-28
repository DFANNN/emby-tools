<template>
  <div class="cover-demo" :style="{ background: poster.backgroundGradient }">
    <div class="cover-left">
      <div class="cover-title">{{ poster.Name }}</div>
      <div class="cover-subtitle">{{ poster.CollectionType }}</div>
    </div>
    <div class="cover-right">
      <div class="cover-card" v-for="(url, i) in poster.imageUrls" :key="i" :style="getImageStyle(i)">
        <img :src="url" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps(['poster'])

const getImageStyle = (index: number) => {
  const positions = [
    { top: '10px', left: '30px', rotate: 'rotate(-10deg)', zIndex: 4 },
    { top: '30px', left: '70px', rotate: 'rotate(6deg)', zIndex: 3 },
    { top: '60px', left: '50px', rotate: 'rotate(-4deg)', zIndex: 2 },
    { top: '90px', left: '100px', rotate: 'rotate(8deg)', zIndex: 1 }
  ]
  const style = positions[index] || positions[0]
  return {
    top: style.top,
    left: style.left,
    transform: style.rotate,
    zIndex: style.zIndex
  }
}
</script>

<style scoped lang="scss">
.cover-demo {
  display: flex;
  width: 320px;
  height: 180px;
  background: linear-gradient(120deg, #3a7bd5 0%, #00d2ff 100%);
  .cover-left {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    padding-left: 18px;
    min-width: 80px;
    .cover-title {
      font-size: 18px;
      color: #fff;
      font-family: 'FZLanTingHei', '微软雅黑', sans-serif;
      font-weight: bold;
      letter-spacing: 2px;
      margin-bottom: 2px;
    }
    .cover-subtitle {
      font-size: 8px;
      color: #e0e0e0;
      letter-spacing: 3px;
      font-family: 'Roboto Mono', monospace;
    }
  }
  .cover-right {
    flex: 2.2;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    min-width: 140px;
    padding-right: 0;
    .cover-card {
      position: absolute;
      width: 60px;
      height: 80px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
      overflow: hidden;
      background: #fff;
      transition: transform 0.2s;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
}
</style>
