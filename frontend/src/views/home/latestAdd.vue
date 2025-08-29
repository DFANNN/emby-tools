<template>
  <div class="recent-add-container">
    <div class="header">
      <span class="header-icon">⭐</span>
      <h3>最近添加</h3>
      <el-tag :type="layoutStore.linkEmbyStatus ? 'success' : 'info'" size="small">{{
        layoutStore.linkEmbyStatus ? `${props.recentList.length}项` : '未连接'
      }}</el-tag>
    </div>
    <div class="content">
      <div v-for="item in props.recentList" :key="item.Id" class="latest-item" @click="openItemDetail(item)">
        <div class="item-poster" :class="posterClass(item)">
          <img :src="item.Primary || '/placeholder-poster.jpg'" alt="" />
        </div>
        <div class="item-info">
          <div class="item-name">{{ item.Name }}</div>
          <div class="series-name" v-if="item.Type === 'Episode' && item.SeriesName">{{ item.SeriesName }}</div>
          <div class="series-name" v-if="item.Type === 'Audio' && item.Artists">{{ item.Artists.join('&') }}</div>
          <div class="item-meta">
            <span class="item-type type-movie" v-if="item.Type === 'Movie'">电影</span>
            <span class="item-type type-episode" v-if="item.Type === 'Episode'">剧集</span>
            <span class="item-type type-audio" v-if="item.Type === 'Audio'">音乐</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { EmbyLatestAddItemType } from '@/types/home'

const layoutStore = useLayoutStore()

const props = defineProps({
  recentList: {
    required: true,
    type: Array as PropType<EmbyLatestAddItemType[]>
  }
})

// 根据类型返回不同的容器 class，用于控制宽高比
const posterClass = (item: EmbyLatestAddItemType) => {
  if (item.Type === 'Movie') return 'ratio-2-3'
  if (item.Type === 'Episode') return 'ratio-16-9'
  if (item.Type === 'Audio') return 'ratio-1-1'
  return 'ratio-2-3'
}

// const recentList = ref([
//   {
//     id: '1',
//     name: '沙丘2',
//     type: 'Movie',
//     addedDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
//     posterPath: 'https://image.tmdb.org/t/p/original/kMa1TSDj76zTSleXE7xsuZ4s3i0.jpg'
//   },
//   {
//     id: '2',
//     name: '死侍与金刚狼',
//     type: 'Movie',
//     addedDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
//     posterPath: 'https://image.tmdb.org/t/p/original/by8z9Fe8y7p4jo2YlW2SZDnptyT.jpg'
//   },
//   {
//     id: '3',
//     name: '权力的游戏',
//     type: 'Series',
//     addedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
//     posterPath: 'https://image.tmdb.org/t/p/original/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg'
//   }
// ])

// 打开项目详情
const openItemDetail = (item: any) => {
  console.log('打开项目详情:', item)
  // 这里可以跳转到 Emby 详情页
}
</script>

<style scoped lang="scss">
.recent-add-container {
  background: var(--el-bg-color-overlay);
  border-radius: var(--el-border-radius-base);
  padding: 1.5rem;
  box-shadow: var(--el-box-shadow-lighter);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--el-box-shadow-light);
  }

  .header {
    display: flex;
    align-items: center;
    margin-bottom: 1.5rem;
    .header-icon {
      font-size: 1.5rem;
      margin-right: 0.75rem;
    }
    h3 {
      color: var(--el-text-color-primary);
      font-size: 1.25rem;
      font-weight: 600;
      flex: 1;
    }
  }
  .content {
    // 约容纳5条，超出滚动
    max-height: 420px;
    overflow-y: auto;
    padding-right: 4px; // 预留滚动条占位，避免抖动
    // 隐藏滚动条但保留滚动功能
    scrollbar-width: none; // Firefox
    -ms-overflow-style: none; // IE 10+
    &::-webkit-scrollbar {
      // Chrome/Safari/Opera
      display: none;
      width: 0;
      height: 0;
      background: transparent;
    }

    .latest-item {
      display: flex;
      align-items: center;
      padding: 0.75rem;
      border-radius: 8px;
      cursor: pointer;
      transition: background-color 0.2s ease;

      &:hover {
        background: var(--el-color-info-light-9);
      }

      .item-poster {
        // 基础尺寸统一，保证左侧容器对齐
        width: 64px;
        height: auto;
        margin-right: 1rem;
        border-radius: 6px;
        overflow: hidden;
        position: relative;

        // 通过伪元素占位实现固定宽高比
        &.ratio-2-3 {
          // 2:3 => 高度 = 宽度 * 1.5 => padding-bottom: 150%
          &::before {
            content: '';
            display: block;
            padding-bottom: 150%;
          }
        }
        &.ratio-16-9 {
          // 16:9 => 高度 = 宽度 * 9 / 16 => 56.25%
          &::before {
            content: '';
            display: block;
            padding-bottom: 56.25%;
          }
        }
        &.ratio-1-1 {
          // 1:1 => 100%
          &::before {
            content: '';
            display: block;
            padding-bottom: 100%;
          }
        }

        img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .item-info {
        flex: 1;

        .item-name {
          font-weight: 600;
          color: var(--el-text-color-primary);
          margin-bottom: 0.25rem;
          line-height: 1.3;
        }

        .series-name {
          color: var(--el-text-color-secondary);
          font-size: 0.875rem;
          margin-bottom: 0.25rem;
        }

        .item-meta {
          display: flex;
          gap: 1rem;
          font-size: 0.875rem;
          color: var(--el-text-color-secondary);

          .item-type {
            padding: 0 6px;
            height: 20px;
            line-height: 20px;
            border-radius: 10px;
            background: var(--el-color-info-light-9);
            color: var(--el-text-color-secondary);
          }
          .type-movie {
            background: var(--el-color-primary-light-9);
            color: var(--el-color-primary);
          }
          .type-episode {
            background: var(--el-color-success-light-9);
            color: var(--el-color-success);
          }
          .type-audio {
            background: var(--el-color-warning-light-9);
            color: var(--el-color-warning);
          }
        }
      }
    }
  }
}
</style>
