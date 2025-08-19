<template>
  <el-sub-menu v-if="menuItem.children?.length" :index="menuItem.name">
    <template #title>
      <el-icon v-if="menuItem.icon"><component :is="mapIcon[menuItem.icon]" /></el-icon>
      <span>{{ menuItem.name }}</span>
    </template>
    <MenuItem v-for="child in menuItem.children" :key="child.name" :menuItem="child" />
  </el-sub-menu>

  <el-menu-item v-else :index="menuItem.path">
    <el-icon v-if="menuItem.icon"><component :is="mapIcon[menuItem.icon]" /></el-icon>
    <span>{{ menuItem.name }}</span>
  </el-menu-item>
</template>

<script setup lang="ts">
import { VideoCamera, DocumentCopy, DocumentRemove, Picture, EditPen, Guide, Star, Bell } from '@element-plus/icons-vue'

defineProps(['menuItem'])

const mapIcon: Record<string, any> = {
  VideoCamera,
  DocumentCopy,
  DocumentRemove,
  Picture,
  EditPen,
  Guide,
  Star,
  Bell
}
</script>
