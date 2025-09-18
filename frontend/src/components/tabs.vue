<template>
  <div class="tabs-wrapper">
    <button class="nav-btn left" v-show="showNavButtons" :disabled="!canScrollLeft" @click="scrollBy(-1)">
      <el-icon><ArrowLeft /></el-icon>
    </button>
    <div class="tabs-container" ref="tabsContainerRef">
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
    <button class="nav-btn right" v-show="showNavButtons" :disabled="!canScrollRight" @click="scrollBy(1)">
      <el-icon><ArrowRight /></el-icon>
    </button>
  </div>
</template>

<script setup lang="ts">
import { Picture, EditPen, Guide, Star, Close, ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
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

// 横向滚动控制
const tabsContainerRef = ref<HTMLDivElement | null>(null)
const canScrollLeft = ref<boolean>(false)
const canScrollRight = ref<boolean>(false)
const showNavButtons = ref<boolean>(false)

const updateScrollState = () => {
  const el = tabsContainerRef.value
  if (!el) return

  const isOverflowing = el.scrollWidth > el.clientWidth
  showNavButtons.value = isOverflowing

  if (isOverflowing) {
    canScrollLeft.value = el.scrollLeft > 0
    canScrollRight.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 1
  } else {
    canScrollLeft.value = false
    canScrollRight.value = false
  }
}

const scrollBy = (direction: number) => {
  const el = tabsContainerRef.value
  if (!el) return
  const amount = Math.max(120, Math.floor(el.clientWidth * 0.8))
  el.scrollBy({ left: direction * amount, behavior: 'smooth' })
}

const scrollActiveTabIntoView = () => {
  const el = tabsContainerRef.value
  if (!el) return
  const active = el.querySelector('.tab-pane.active') as HTMLElement | null
  if (active) {
    active.scrollIntoView({ inline: 'nearest', block: 'nearest', behavior: 'smooth' })
  }
}

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
    nextTick(() => {
      scrollActiveTabIntoView()
      updateScrollState()
    })
  },
  { immediate: true }
)

onMounted(() => {
  const el = tabsContainerRef.value
  if (el) {
    el.addEventListener('scroll', updateScrollState)
  }
  window.addEventListener('resize', updateScrollState)
  nextTick(updateScrollState)
})

onBeforeUnmount(() => {
  const el = tabsContainerRef.value
  if (el) {
    el.removeEventListener('scroll', updateScrollState)
  }
  window.removeEventListener('resize', updateScrollState)
})
</script>

<style scoped lang="scss">
.tabs-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

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

.nav-btn {
  border: none;
  background: transparent;
  color: var(--el-text-color-regular);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  cursor: pointer;
  &:disabled {
    opacity: 0.3;
    cursor: default;
  }
}

.nav-btn.left {
  margin-right: 4px;
}
.nav-btn.right {
  margin-left: 4px;
}
</style>
