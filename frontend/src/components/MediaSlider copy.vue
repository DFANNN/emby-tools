<template>
  <div class="media-slider">
    <!-- 标题区域 -->
    <div class="slider-header">
      <h3 class="slider-title">{{ title }}</h3>
    </div>

    <!-- 使用 el-scrollbar 实现滑动 -->
    <el-scrollbar class="slider-scrollbar">
      <div class="media-list">
        <div v-for="item in mediaList" :key="item.id" class="media-card" @click="handleCardClick(item)">
          <!-- 背景图片 -->
          <div class="media-background">
            <img
              :src="item.backdrop_path || item.poster_path"
              :alt="item.name || item.title"
              @error="handleImageError"
            />
          </div>

          <!-- 媒体信息 - 放在图片下面 -->
          <div class="media-info">
            <h4 class="media-name">{{ item.name || item.title || item.original_name }}</h4>
            <div class="media-date" v-if="item.release_date || item.first_air_date">
              {{ formatDate(item.release_date || item.first_air_date) }}
            </div>
          </div>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import type { ITrendItem } from '@/types/home'

interface Props {
  /** 标题 */
  title: string
  /** 媒体列表 */
  mediaList: ITrendItem[]
}

interface Emits {
  (e: 'card-click', item: ITrendItem): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 卡片点击
const handleCardClick = (item: ITrendItem) => {
  emit('card-click', item)
}

// 图片加载失败处理
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/placeholder-movie.jpg'
}

// 格式化日期
const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.getFullYear().toString()
}
</script>

<style scoped lang="scss">
.media-slider {
  margin: 2rem 0;

  .slider-header {
    margin-bottom: 1rem;
    padding: 0 1rem;

    .slider-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #333;
      margin: 0;
    }
  }

  .slider-scrollbar {
    padding: 0 1rem;

    .media-list {
      display: flex;
      gap: 1rem;
      padding-bottom: 1rem;

      .media-card {
        flex-shrink: 0;
        width: 280px;
        cursor: pointer;
        transition: transform 0.2s ease, box-shadow 0.2s ease;

        &:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .media-background {
          width: 100%;
          height: 180px;
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 0.75rem;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }

        .media-info {
          padding: 0 0.5rem;

          .media-name {
            font-size: 1rem;
            font-weight: 600;
            color: #333;
            margin: 0 0 0.5rem 0;
            line-height: 1.3;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .media-date {
            font-size: 0.875rem;
            color: #666;
            margin: 0;
          }
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .media-slider {
    .slider-header {
      padding: 0 0.5rem;

      .slider-title {
        font-size: 1.25rem;
      }
    }

    .slider-scrollbar {
      padding: 0 0.5rem;

      .media-list {
        gap: 0.75rem;

        .media-card {
          width: 240px;

          .media-background {
            height: 150px;
          }
        }
      }
    }
  }
}
</style>
