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
    <div class="header-right">
      <div class="icon-wrapper" @click="openEmbyConfig">
        <el-badge :is-dot="true" :type="layoutStore.linkEmbyStatus ? 'success' : 'danger'">
          <el-icon>
            <EmbyIcon />
          </el-icon>
        </el-badge>
      </div>
      <div class="icon-wrapper" @click="layoutStore.toggleTheme">
        <el-icon>
          <DarkModeIcon v-if="layoutStore.themeMode === 'dark'" />
          <LightModeIcon v-else-if="layoutStore.themeMode === 'light'" />
          <AutoModeIcon v-else />
        </el-icon>
      </div>
      <div class="icon-wrapper" @click="goToGithub">
        <el-icon>
          <GithubIcon />
        </el-icon>
      </div>
      <LinkEmbyConfig ref="linkEmbyConfigRef" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Expand, Fold } from '@element-plus/icons-vue'
import GithubIcon from '@/components/icon/GithubIcon.vue'
import LightModeIcon from '@/components/icon/LightModeIcon.vue'
import DarkModeIcon from '@/components/icon/DarkModeIcon.vue'
import AutoModeIcon from '@/components/icon/AutoModeIcon.vue'
import LinkEmbyConfig from '@/components/linkEmbyConfig.vue'
import EmbyIcon from '@/components/icon/EmbyIcon.vue'

const layoutStore = useLayoutStore()

const linkEmbyConfigRef = useTemplateRef('linkEmbyConfigRef')
const openEmbyConfig = () => {
  // 预加载现有配置，弹出设置对话框
  linkEmbyConfigRef.value?.showDialog()
}

const goToGithub = () => {
  window.open('https://github.com/DFANNN/emby-tools')
}
</script>

<style scoped lang="scss">
.header-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .icon-wrapper {
    padding: 4px 8px 0;
    border-radius: 4px;
    font-size: 20px;
    cursor: pointer;
    &:hover {
      background: #ccc;
    }
  }
  .header-left {
    display: flex;
    align-items: center;
  }
  .header-right {
    display: flex;
    align-items: center;
  }
}
</style>
