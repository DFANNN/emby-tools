<template>
  <div class="recent-add-container">
    <div class="header">
      <span class="header-icon">⏱️</span>
      <h3>最近添加</h3>
      <el-tag type="info" size="small">{{ props.recentList.length }}项</el-tag>
    </div>
    <div class="content">
      <div v-for="item in props.recentList" :key="item.Id" class="latest-item" @click="openItemDetail(item)">
        <div class="item-poster">
          <img :src="item.Primary || '/placeholder-poster.jpg'" alt="" />
        </div>
        <div class="item-info">
          <div class="item-name">{{ item.Name }}</div>
          <div class="item-meta">
            <span class="item-type" v-if="item.Type === 'Movie'">电影</span>
            <span class="item-date" v-if="item.Type === 'Episode'">剧集</span>
            <span class="item-date" v-if="item.Type === 'Audio'">音乐</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { EmbyLatestAddItemType } from '@/types/home'

const props = defineProps({
  recentList: {
    required: true,
    type: Array as PropType<EmbyLatestAddItemType[]>
  }
})

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
        width: 50px;
        height: 75px;
        margin-right: 1rem;
        border-radius: 6px;
        overflow: hidden;

        img {
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

        .item-meta {
          display: flex;
          gap: 1rem;
          font-size: 0.875rem;
          color: var(--el-text-color-secondary);

          .item-type {
            color: var(--el-color-primary);
          }
        }
      }
    }
  }
}
</style>
