<template>
  <div class="index-container">
    <HeaderComponent />
    <FooterComponent />
  </div>
</template>

<script setup lang="ts">
import HeaderComponent from '@/views/home/header.vue'
import FooterComponent from '@/views/home/footer.vue'
</script>

<style scoped lang="scss">
.index-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
