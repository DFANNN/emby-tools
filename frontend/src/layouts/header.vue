<template>
  <div class="header-container">
    <div class="header-right">
      <el-tooltip content="TMDB 代理设置" placement="bottom">
        <div class="icon-wrapper" @click="openProxyDialog">
          <el-icon>
            <ConfigIcon />
          </el-icon>
        </div>
      </el-tooltip>
      <el-tooltip content="Emby 连接配置" placement="bottom">
        <div class="icon-wrapper" @click="openEmbyConfig">
          <el-badge :is-dot="true" :type="layoutStore.linkEmbyStatus ? 'success' : 'danger'">
            <el-icon>
              <ConfigIcon />
            </el-icon>
          </el-badge>
        </div>
      </el-tooltip>
      <el-tooltip
        :content="
          layoutStore.themeMode === 'dark'
            ? '切换到浅色模式'
            : layoutStore.themeMode === 'light'
            ? '切换到深色模式'
            : '切换到自动模式'
        "
        placement="bottom"
      >
        <div class="icon-wrapper" @click="layoutStore.toggleTheme">
          <el-icon>
            <DarkModeIcon v-if="layoutStore.themeMode === 'dark'" />
            <LightModeIcon v-else-if="layoutStore.themeMode === 'light'" />
            <AutoModeIcon v-else />
          </el-icon>
        </div>
      </el-tooltip>
      <el-tooltip content="访问 GitHub 仓库" placement="bottom">
        <div class="icon-wrapper" @click="goToGithub">
          <el-icon>
            <GithubIcon />
          </el-icon>
        </div>
      </el-tooltip>
      <el-tooltip content="打开 Emby 网页版" placement="bottom">
        <div class="icon-wrapper" @click="openEmbyWeb">
          <el-icon>
            <EmbyIcon />
          </el-icon>
        </div>
      </el-tooltip>
      <el-tooltip content="访问 The Movie Database" placement="bottom">
        <div class="tmdb-wrapper" @click="openTmdb">
          <img :src="TMDBLogo" alt="" />
        </div>
      </el-tooltip>
      <LinkEmbyConfig ref="linkEmbyConfigRef" />
      <el-dialog v-model="showProxyDialog" title="TMDB 代理设置" width="520px">
        <div class="proxy-form">
          <el-alert
            title="仅影响后端访问 TMDB API 与图片代理。示例：http://127.0.0.1:7890 或 socks5://127.0.0.1:7890"
            type="info"
            :closable="false"
            class="mb-12"
          />
          <el-input
            v-model="proxyInput"
            placeholder="输入代理地址，例如 http://127.0.0.1:7890 或 socks5://127.0.0.1:7890"
            clearable
          />
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="showProxyDialog = false">取消</el-button>
            <el-button type="primary" :loading="saving" @click="saveProxy">保存</el-button>
          </span>
        </template>
      </el-dialog>
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
import { getTmdbProxy, setTmdbProxy } from '@/api/theMovieDB'

const layoutStore = useLayoutStore()

const linkEmbyConfigRef = useTemplateRef('linkEmbyConfigRef')
const openEmbyConfig = () => {
  // 预加载现有配置，弹出设置对话框
  linkEmbyConfigRef.value?.showDialog()
}

// TMDB 代理设置
const showProxyDialog = ref(false)
const proxyInput = ref('')
const saving = ref(false)

const openProxyDialog = async () => {
  try {
    const { data } = await getTmdbProxy()
    proxyInput.value = data?.data?.proxy || ''
  } catch (e) {
    // 忽略错误，保持空
  }
  showProxyDialog.value = true
}

const saveProxy = async () => {
  try {
    saving.value = true
    await setTmdbProxy(proxyInput.value.trim())
    ElMessage.success('代理配置已保存')
    showProxyDialog.value = false
  } catch (e) {
    ElMessage.error('保存失败')
  } finally {
    saving.value = false
  }
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
  justify-content: end;
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
  .header-right {
    display: flex;
    align-items: center;
  }
}
.mb-12 {
  margin-bottom: 12px;
}
.proxy-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
