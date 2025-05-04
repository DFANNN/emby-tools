<template>
  <div class="header-container">
    <div class="header-left">
      <div class="icon-wrapper" @click="layoutStore.isCollapse = !layoutStore.isCollapse">
        <el-icon>
          <Expand v-if="layoutStore.isCollapse" />
          <Fold v-else />
        </el-icon>
      </div>
    </div>
    <div>2</div>
  </div>
</template>

<script setup lang="ts">
import { Expand, Fold } from '@element-plus/icons-vue'

const layoutStore = useLayoutStore()
</script>

<style scoped lang="scss">
.header-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .header-left {
    display: flex;
    align-items: center;
    .icon-wrapper {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 20px;
      cursor: pointer;
      &:hover {
        background: #ccc;
      }
    }
  }
}
</style>
