<template>
  <div class="cover-demo">
    <div class="cover-left">
      <div class="cover-title">动漫</div>
      <div class="cover-subtitle">ANIME</div>
    </div>
    <div class="cover-right">
      <div
        class="cover-card"
        v-for="(img, i) in images"
        :key="i"
        :style="{ top: img.top, left: img.left, transform: img.rotate }"
      >
        <img :src="img.url" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const images = [
  {
    url: 'https://img1.imgtp.com/2023/07/21/0Qw1Qw1Q.jpg',
    top: '0px',
    left: '0px',
    rotate: 'rotate(-8deg)'
  },
  {
    url: 'https://img1.imgtp.com/2023/07/21/1Qw1Qw1Q.jpg',
    top: '80px',
    left: '120px',
    rotate: 'rotate(6deg)'
  },
  {
    url: 'https://img1.imgtp.com/2023/07/21/2Qw1Qw1Q.jpg',
    top: '180px',
    left: '60px',
    rotate: 'rotate(-4deg)'
  },
  {
    url: 'https://img1.imgtp.com/2023/07/21/3Qw1Qw1Q.jpg',
    top: '260px',
    left: '180px',
    rotate: 'rotate(10deg)'
  }
]
</script>

<style scoped>
.cover-demo {
  display: flex;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(120deg, #3a7bd5 0%, #00d2ff 100%);
}
.cover-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding-left: 80px;
}
.cover-title {
  font-size: 72px;
  color: #fff;
  font-family: 'FZLanTingHei', '微软雅黑', sans-serif;
  font-weight: bold;
  letter-spacing: 8px;
  margin-bottom: 16px;
}
.cover-subtitle {
  font-size: 32px;
  color: #e0e0e0;
  letter-spacing: 12px;
  font-family: 'Roboto Mono', monospace;
}
.cover-right {
  flex: 2;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-width: 600px;
}
.cover-card {
  position: absolute;
  width: 180px;
  height: 260px;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
  overflow: hidden;
  background: #fff;
  transition: transform 0.2s;
}
.cover-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
