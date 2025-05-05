<template>
  <div class="aside-container">
    <el-menu default-active="2" class="el-menu-vertical-demo" :collapse="layoutStore.isCollapse">
      <el-menu-item class="logo-wrapper">
        <img src="../assets/logo.png" alt="" />
        <template #title>
          <span class="logo-text">emby-tools</span>
        </template>
      </el-menu-item>
      <template v-for="item in menuStore.menuList" :key="item.name">
        <MenuItem :menuItem="item" />
      </template>
    </el-menu>
  </div>
</template>

<script lang="ts" setup>
import MenuItem from '@/layouts/menuItem.vue'

const layoutStore = useLayoutStore()
const menuStore = useMenuStore()

onMounted(() => {
  menuStore.getMenu()
})
</script>

<script setup lang="ts"></script>

<style scoped lang="scss">
.aside-container {
  .logo-wrapper {
    height: 60px;
    margin-left: -20px;
    img {
      width: 63px;
      height: 63px;
    }
    .logo-text {
      font-size: 18px;
      font-weight: 700;
    }
  }
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  height: 100vh;
  overflow-y: auto;
}
.el-menu-vertical-demo {
  height: 100vh;
  overflow-y: auto;
}
</style>
