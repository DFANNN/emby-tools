<template>
  <div class="aside-container">
    <el-menu
      :router="true"
      :default-active="defaultActiveMenuItem"
      :collapse="layoutStore.isCollapse"
      class="el-menu-vertical-demo"
    >
      <!-- logo -->
      <el-menu-item class="logo-wrapper">
        <img src="../assets/logo.png" alt="" />
        <template #title>
          <span class="logo-text">emby-tools</span>
        </template>
      </el-menu-item>

      <!-- 菜单 -->
      <template v-for="item in menuStore.menuList" :key="item.name">
        <MenuItem :menuItem="item" />
      </template>
    </el-menu>

    <!-- aside 最底部折叠按钮（无文字） -->
    <div class="collapse-bottom" @click="layoutStore.isCollapse = !layoutStore.isCollapse">
      <el-icon>
        <Expand v-if="layoutStore.isCollapse" />
        <Fold v-else />
      </el-icon>
    </div>
  </div>
</template>

<script lang="ts" setup>
import MenuItem from '@/layouts/menuItem.vue'
import { Expand, Fold } from '@element-plus/icons-vue'

const layoutStore = useLayoutStore()
const menuStore = useMenuStore()
const route = useRoute()

// 默认激活的菜单
const defaultActiveMenuItem = ref('')

onMounted(() => {
  menuStore.getMenu()
  defaultActiveMenuItem.value = route.path
})
</script>

<script setup lang="ts"></script>

<style scoped lang="scss">
.aside-container {
  position: relative;
  height: 100vh;
  .logo-wrapper {
    height: 60px;
    display: flex;
    align-items: center;
    gap: 8px;
    padding-left: 12px;
    margin-left: -12px;
    img {
      width: 44px;
      height: 44px;
    }
    .logo-text {
      font-size: 18px;
      font-weight: 700;
    }
  }
}
.collapse-trigger {
  .el-icon {
    font-size: 18px;
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
  padding-bottom: 48px;
}

.collapse-bottom {
  position: absolute;
  left: 12px;
  right: 12px;
  bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  height: 36px;
  background: var(--el-fill-color, #f5f5f5);
  border: 1px solid var(--el-border-color, #e5e7eb);
  border-radius: var(--el-border-radius-base, 8px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
  transition: background 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  .el-icon {
    font-size: 20px;
  }
  &:hover {
    background: var(--el-fill-color-dark, #eeeeee);
    border-color: var(--el-border-color-darker, #d1d5db);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
}
</style>
