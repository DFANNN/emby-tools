<template>
  <div class="tabs-container">
    <div
      :class="{ 'tab-pane': true, active: item.name === currentPathName }"
      v-for="(item, index) in tabsStore.tabList"
      @click="router.push(item.name)"
    >
      <el-icon>
        <component :is="mapIcon[item.icon]" />
      </el-icon>
      <div class="tab-pane-title">{{ item.title }}</div>
      <el-icon class="close" v-if="item.name !== 'home'" @click.stop="close(item, index)"><Close /></el-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Picture, EditPen, Guide, Star, Close } from '@element-plus/icons-vue'
import type { RouteRecordNameGeneric } from 'vue-router'
import type { ITabType } from '@/types/components/tabs'

const route = useRoute()
const router = useRouter()
const tabsStore = useTabsStore()

const mapIcon: Record<string, any> = {
  Guide,
  EditPen,
  Picture,
  Star
}

const currentPathName = ref<RouteRecordNameGeneric>('')

const close = (item: ITabType, currentIndex: number) => {
  if (currentPathName.value === item.name) {
    router.push(tabsStore.tabList[currentIndex - 1].name)
  }
  tabsStore.tabList.splice(currentIndex, 1)
  tabsStore.keepAliveComponentName = tabsStore.tabList.map(item => item.name)
}

watch(
  route,
  newRoute => {
    currentPathName.value = newRoute.name
    const pathNames = new Set(tabsStore.tabList.map(item => item.name))
    if (!pathNames.has(newRoute.name as string)) {
      tabsStore.tabList.push({
        path: newRoute.path,
        name: newRoute.name as string,
        icon: newRoute.meta.icon as string,
        title: newRoute.meta.title as string
      })
      tabsStore.keepAliveComponentName = tabsStore.tabList.map(item => item.name)
    }
  },
  { immediate: true }
)
</script>

<style scoped lang="scss">
.tabs-container {
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  display: flex;
  gap: 4px;
  font-size: 14px;
  scrollbar-width: none; // Firefox
  -ms-overflow-style: none; // IE 10+
  &::-webkit-scrollbar {
    // Chrome/Safari/Edge (Chromium)
    display: none;
  }
  .tab-pane {
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    flex-shrink: 0;
    .tab-pane-title {
      margin: 0 12px;
    }
    .close {
      &:hover {
        color: var(--el-color-danger);
      }
    }
    &:hover {
      color: var(--el-color-white);
      background: var(--el-color-primary);
    }
    &.active {
      color: var(--el-color-white);
      background: var(--el-color-primary);
    }
  }
}
</style>
