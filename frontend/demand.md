# Emby 信息看板需求文档

## 项目概述

### 项目名称

Emby 信息看板 (Emby Dashboard)

### 项目目标

为 Emby 媒体服务器创建一个简洁实用的信息看板，展示媒体库的核心统计信息和状态，帮助用户快速了解媒体库状况。

### 项目背景

用户需要一个快速了解 Emby 媒体库状态的入口页面，包括数量统计、存储空间、最新添加内容等关键信息。

---

## 功能需求

### 1. 基础数量统计

#### 功能描述

显示媒体库中电影、剧集、音乐的数量统计信息。

#### 具体需求

- 显示电影总数
- 显示剧集总数
- 显示音乐总数
- 显示媒体库总项目数

#### 技术要求

- 数据来源：Emby API `/Users/{UserId}/Items/Counts`
- 刷新频率：页面加载时获取，可手动刷新
- 显示格式：数字 + 单位（如：1,234 部）

#### 数据结构

```typescript
interface LibraryCounts {
  movies: number // 电影数量
  tvShows: number // 剧集数量
  music: number // 音乐数量
  total: number // 总数
}
```

---

### 2. 存储空间统计

#### 功能描述

显示媒体库占用的存储空间信息，包括已用空间、总空间、剩余空间等。

#### 具体需求

- 显示总占用空间
- 显示当前总空间大小
- 显示剩余可用空间
- 显示空间使用百分比
- 可选：显示电影、剧集、音乐各自占用的空间

#### 技术要求

- 数据来源：Emby API
- 空间单位：自动转换（B, KB, MB, GB, TB）
- 精度要求：保留 2 位小数

#### 数据结构

```typescript
interface StorageInfo {
  totalUsed: string // 总占用空间
  totalSpace: string // 总空间大小
  freeSpace: string // 剩余空间
  usagePercentage: number // 使用百分比

  // 可选：分类统计
  movies?: {
    count: number
    size: string
    percentage: number
  }
  tvShows?: {
    count: number
    size: string
    percentage: number
  }
  music?: {
    count: number
    size: string
    percentage: number
  }
}
```

---

### 3. 最新添加模块

#### 功能描述

显示最近添加到媒体库的最新内容，帮助用户了解媒体库的最新变化。

#### 具体需求

- 显示最新添加的电影、剧集、音乐
- 支持横向滑动浏览
- 显示添加时间
- 显示内容类型和基本信息

#### 技术要求

- 数据来源：Emby API `/Users/{UserId}/Items/Latest`
- 显示数量：默认显示 10-20 个项目
- 支持分页加载更多

#### 数据结构

```typescript
interface LatestItem {
  id: string
  name: string
  type: 'Movie' | 'Series' | 'Audio'
  addedDate: string // 添加时间
  posterPath?: string // 海报路径
  backdropPath?: string // 背景图路径
  releaseYear?: number // 发行年份
  rating?: number // 评分
  overview?: string // 简介
}
```

#### 展示要求

- 使用横向滑动卡片布局
- 每个卡片显示海报、名称、类型、添加时间
- 支持点击跳转到 Emby 详情页

---

### 4. 观看时长统计

#### 功能描述

统计和显示用户的观看时长信息，包括总体统计和分类统计。

#### 具体需求

- 显示总观看时长
- 显示已观看项目总数
- 显示分类观看时长（电影、剧集、音乐）
- 显示时间维度统计（本月、本周、今日）
- 显示观看习惯分析

#### 技术要求

- 数据来源：Emby API `/Users/{UserId}/Items` + 播放记录
- 时间计算：基于播放记录计算实际观看时长
- 数据精度：小时级别

#### 数据结构

```typescript
interface WatchStats {
  // 总体统计
  totalWatchTime: string // 总观看时长
  totalWatchedItems: number // 已观看项目总数

  // 分类统计
  movies: {
    count: number
    watchTime: string
    percentage: number
  }
  tvShows: {
    count: number
    watchTime: string
    percentage: number
    completedSeasons: number
  }
  music: {
    count: number
    listenTime: string
    percentage: number
  }

  // 时间统计
  thisMonth: string // 本月观看时长
  thisWeek: string // 本周观看时长
  today: string // 今日观看时长

  // 观看习惯
  averageWatchTime: string // 平均每次观看时长
  mostWatchedGenre: string // 最常观看类型
  mostWatchedTime: string // 最常观看时间段
}
```

---

## 非功能需求

### 性能要求

- 页面加载时间：< 3 秒
- 数据刷新频率：5 分钟
- 支持 1000+媒体项目的快速加载

### 兼容性要求

- 支持 Emby 4.x 版本
- 支持主流浏览器（Chrome、Firefox、Safari、Edge）
- 响应式设计，支持桌面和移动端

### 可用性要求

- 界面简洁清晰，信息层次分明
- 支持数据刷新和手动更新
- 错误状态友好提示

---

## 技术实现

### 技术栈

- 前端框架：Vue 3 + TypeScript
- UI 组件库：Element Plus
- 状态管理：Pinia
- HTTP 客户端：Axios

### 数据获取

- Emby API 调用
- 定时刷新机制
- 错误重试机制
- 数据缓存策略

### 界面设计

- 卡片式布局
- 响应式网格系统
- 统一的设计语言
- 清晰的信息层次

---

## 开发计划

### 第一阶段（1-2 周）

- 基础数量统计
- 基础存储空间统计
- 页面基础框架

### 第二阶段（2-3 周）

- 最新添加模块
- 详细存储空间统计
- 界面优化

### 第三阶段（3-4 周）

- 观看时长统计
- 性能优化
- 测试和部署

---

## 验收标准

### 功能验收

- 所有统计信息正确显示
- 数据刷新机制正常工作
- 界面响应式设计正常

### 性能验收

- 页面加载时间符合要求
- 大量数据下性能稳定
- API 调用频率合理

### 用户体验验收

- 界面简洁美观
- 信息展示清晰
- 操作简单直观
