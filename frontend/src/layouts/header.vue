<template>
  <div class="header-container">
    <div class="header-left"></div>
    <div class="header-right">
      <div class="icon-wrapper" @click="openEmbyConfig">
        <el-badge :is-dot="true" :type="layoutStore.linkEmbyStatus ? 'success' : 'danger'">
          <el-icon>
            <ConfigIcon />
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
      <div class="icon-wrapper" @click="openEmbyWeb">
        <el-icon>
          <EmbyIcon />
        </el-icon>
      </div>
      <div class="tmdb-wrapper" @click="openTmdb">
        <img :src="TMDBLogo" alt="" />
      </div>
      <LinkEmbyConfig ref="linkEmbyConfigRef" />
    </div>
  </div>
</template>

<script setup lang="ts">
import GithubIcon from '@/components/icon/GithubIcon.vue'
import LightModeIcon from '@/components/icon/LightModeIcon.vue'
import DarkModeIcon from '@/components/icon/DarkModeIcon.vue'
import AutoModeIcon from '@/components/icon/AutoModeIcon.vue'
import LinkEmbyConfig from '@/components/linkEmbyConfig.vue'
import EmbyIcon from '@/components/icon/EmbyIcon.vue'
import ConfigIcon from '@/components/icon/ConfigIcon.vue'
import TMDBLogo from '@/assets/tmdbLogo.svg'
import { ElMessage } from 'element-plus'

const layoutStore = useLayoutStore()

const linkEmbyConfigRef = useTemplateRef('linkEmbyConfigRef')
const openEmbyConfig = () => {
  // 预加载现有配置，弹出设置对话框
  linkEmbyConfigRef.value?.showDialog()
}

// 跳转到emby
const openEmbyWeb = () => {
  if (!layoutStore.linkEmbyStatus) {
    ElMessage.warning('未连接 Emby，请先在设置中完成连接配置')
    return
  }
  window.open(layoutStore.embyUserInfo.EmbyAddress)
}

// 跳转到tmdb
const openTmdb = () => {
  window.open('https://www.themoviedb.org/')
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
  .tmdb-wrapper {
    padding: 4px 8px 0;
    border-radius: 4px;
    font-size: 20px;
    cursor: pointer;
    img {
      width: 25px;
    }
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
