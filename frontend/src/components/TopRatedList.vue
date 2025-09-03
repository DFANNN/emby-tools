<template>
  <div class="top-rated-list">
    <div v-for="item in list" :key="item.id" class="grid-card" @click="$emit('select', item)">
      <img :src="item.poster_path" :alt="item.title || item.name || item.original_name" />
      <div class="name">{{ item.title || item.name || item.original_name }}</div>
      <div class="meta">
        <span class="date">{{ item.release_date || item.first_air_date }}</span>
        <span class="score">⭐ {{ (item.vote_average || 0).toFixed(1) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ITrendItem } from '@/types/dailyRecommendation'

defineProps<{ list: ITrendItem[] }>()
</script>

<style scoped lang="scss">
.top-rated-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 16px;

  .grid-card {
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 8px;
    background: #0e0e0e;
    border-radius: 10px;
    padding: 10px;
    color: #eee;
    transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
      background: #141414;
    }

    img {
      width: 100%;
      aspect-ratio: 2 / 3;
      object-fit: cover;
      border-radius: 8px;
    }

    .name {
      font-weight: 700;
      font-size: 14px;
      line-height: 1.35;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .meta {
      display: flex;
      justify-content: space-between;
      color: #aaa;
      font-size: 12px;

      .score {
        color: #ffd700;
        font-weight: 700;
      }
    }
  }
}
</style>
