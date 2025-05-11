<template>
  <div class="common-layout">
    <el-container>
      <AsideComponent />
      <el-container>
        <el-header class="header">
          <HeaderComponent />
        </el-header>
        <el-main>
          <RouterView />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import AsideComponent from '@/layouts/aside.vue'
import HeaderComponent from '@/layouts/header.vue'
</script>

<style scoped lang="scss">
.header {
  border-bottom: 1px solid var(--el-menu-border-color);
}
</style>
