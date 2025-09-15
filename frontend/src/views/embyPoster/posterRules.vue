<template>
  <div class="poster-rules-container">
    <div class="module-header">
      <h2>封面生成规则</h2>
    </div>

    <!-- 生成封面图规则-->
    <div class="poster-rule-wrap">
      <el-form :model="embyPosterStore.ruleForm" :rules="rules" label-position="top" ref="ruleFormRef">
        <el-form-item label="选择媒体库" prop="ids">
          <el-select v-model="embyPosterStore.ruleForm.ids" multiple placeholder="请选择媒体库">
            <el-option
              :label="item.Name"
              :value="item.Id"
              v-for="item in embyPosterStore.embyMediaLibraryList"
              :key="item.Id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="背景色系（可多选）">
          <el-select v-model="embyPosterStore.ruleForm.palette" multiple clearable placeholder="不选为随机">
            <el-option v-for="opt in paletteOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
          </el-select>
        </el-form-item>

        <el-form-item label="渐变类型">
          <el-select v-model="embyPosterStore.ruleForm.gradientType" clearable placeholder="不选为随机">
            <el-option label="自动" value="auto" />
            <el-option label="线性" value="linear" />
            <el-option label="对角" value="diagonal" />
            <el-option label="径向" value="radial" />
          </el-select>
        </el-form-item>

        <el-form-item label="颜色止点">
          <el-select v-model="embyPosterStore.ruleForm.gradientStops" clearable placeholder="不选为随机">
            <el-option label="两色" :value="2" />
            <el-option label="三色" :value="3" />
          </el-select>
        </el-form-item>

        <el-divider>图片来源</el-divider>
        <el-form-item label="来源">
          <el-select v-model="embyPosterStore.ruleForm.imageSource" clearable placeholder="默认 Emby 随机">
            <el-option label="Emby 随机海报" value="emby" />
            <el-option label="TMDB 发现（按题材）" value="tmdb" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="embyPosterStore.ruleForm.imageSource === 'tmdb'" label="TMDB 类型">
          <el-select v-model="embyPosterStore.ruleForm.tmdbMediaType" clearable placeholder="电影或剧集">
            <el-option label="电影" value="movie" />
            <el-option label="剧集" value="tv" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="embyPosterStore.ruleForm.imageSource === 'tmdb'" label="TMDB 题材（可多选）">
          <el-select v-model="embyPosterStore.ruleForm.tmdbGenres" multiple clearable placeholder="不选为全部题材">
            <el-option v-for="g in tmdbGenreOptions" :key="g.value" :label="g.label" :value="g.value" />
          </el-select>
        </el-form-item>
      </el-form>
    </div>

    <!-- 生成按钮 -->
    <el-button type="primary" @click="generatePoster" class="generate-btn"> 生成封面 </el-button>
  </div>
</template>

<script setup lang="ts">
import { useEmbyPosterStore } from '@/stores/embyPoster'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { nextTick } from 'vue'

const embyPosterStore = useEmbyPosterStore()
const paletteOptions = [
  { label: '冷色（蓝/青/紫）', value: 'cool' },
  { label: '暖色（红/橙/金/粉）', value: 'warm' },
  { label: '中性（灰/蓝灰/棕灰）', value: 'neutral' },
  { label: '蓝色系', value: 'blue' },
  { label: '紫色系', value: 'purple' },
  { label: '青色系', value: 'teal' },
  { label: '绿色系', value: 'green' },
  { label: '金色系', value: 'gold' },
  { label: '橙色系', value: 'orange' },
  { label: '粉色系', value: 'pink' },
  { label: '棕色系', value: 'brown' },
  { label: '随机', value: 'random' }
]
const layoutStore = useLayoutStore()
const tmdbGenreOptions = [
  // 电影/剧集常用题材并集，按中文显示
  { label: '纪录片', value: 99 },
  { label: '真人秀/综艺', value: 10764 },
  { label: '新闻', value: 10763 },
  { label: '脱口秀', value: 10767 },
  { label: '家庭', value: 10751 },
  { label: '儿童', value: 10762 },
  { label: '动画', value: 16 },
  { label: '喜剧', value: 35 },
  { label: '犯罪', value: 80 },
  { label: '剧情', value: 18 },
  { label: '奇幻', value: 14 },
  { label: '恐怖', value: 27 },
  { label: '科幻', value: 878 },
  { label: '悬疑', value: 9648 },
  { label: '历史', value: 36 },
  { label: '战争', value: 10752 },
  { label: '音乐', value: 10402 },
  { label: '冒险', value: 12 },
  { label: '爱情', value: 10749 },
  { label: '西部', value: 37 },
  { label: '电视电影', value: 10770 }
] as const

// ref
const ruleFormRef = useTemplateRef<FormInstance>('ruleFormRef')

// 生成封面
const generatePoster = async () => {
  if (!layoutStore.linkEmbyStatus) {
    ElMessage.warning('请先连接Emby')
    return
  }
  try {
    // 开启 loading（简化为单一提示即可）
    embyPosterStore.loadingText = '正在获取图片…'
    embyPosterStore.loading = true

    // 整理需要生成封面的媒体库列表
    embyPosterStore.needGeneratePosterMediaLibraryList = embyPosterStore.embyMediaLibraryList.filter(item => {
      return embyPosterStore.ruleForm.ids.includes(item.Id)
    })

    // 逐个媒体库拉取图片并生成背景
    for (const item of embyPosterStore.needGeneratePosterMediaLibraryList) {
      // 选择图片来源
      if (embyPosterStore.ruleForm.imageSource === 'tmdb') {
        const mediaType = embyPosterStore.ruleForm.tmdbMediaType || (item.CollectionType === 'movies' ? 'movie' : 'tv')
        const withGenres = (embyPosterStore.ruleForm.tmdbGenres || []).join(',')
        item.imageUrls = await embyPosterStore.getTmdbDiscover(mediaType, withGenres)
      } else {
        item.imageUrls = await embyPosterStore.getRadomPoster(item.Id)
      }
      item.backgroundGradient = embyPosterStore.getRandomGradient({
        palette: embyPosterStore.ruleForm.palette?.length ? embyPosterStore.ruleForm.palette : undefined,
        type: embyPosterStore.ruleForm.gradientType,
        stops: embyPosterStore.ruleForm.gradientStops
      })
    }

    // 显示预览海报
    embyPosterStore.showPreviewPoster = true

    // 在此等待预览区域内图片加载完成再关闭 loading
    embyPosterStore.loadingText = '正在渲染预览…'
    await nextTick()
    await new Promise<void>(resolve => {
      const container = document.querySelector('.preview-container')
      if (!container) return resolve()
      const imgs = container.querySelectorAll('.poster-jpg img')
      if (!imgs.length) return resolve()

      let done = 0
      const total = imgs.length
      const onOne = () => {
        done++
        if (done >= total) resolve()
      }
      const timeout = setTimeout(() => resolve(), 20000)
      imgs.forEach(node => {
        const img = node as HTMLImageElement
        if (img.complete && img.naturalWidth > 0) onOne()
        else {
          img.addEventListener('load', onOne, { once: true })
          img.addEventListener('error', onOne, { once: true })
        }
      })
      const stopWhenResolved = () => clearTimeout(timeout)
      // 轻量：当 resolve 被调用时，微任务后清理 timeout
      Promise.resolve().then(stopWhenResolved)
    })
  } finally {
    // 关闭 loading
    embyPosterStore.loading = false
    embyPosterStore.loadingText = ''
  }
}

const rules = ref<FormRules>({
  ids: [{ required: true, message: '请选择媒体库', trigger: 'blur' }]
})
</script>

<style scoped lang="scss">
.poster-rules-container {
  background: var(--el-bg-color-overlay);
  border-radius: var(--el-border-radius-base);
  padding: 1.5rem;
  box-shadow: var(--el-box-shadow-light);

  .module-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    h2 {
      margin: 0;
      font-size: 1.25rem;
      color: var(--el-text-color-primary);
    }
  }

  .poster-rule-wrap {
    height: calc(100vh - 59px - 40px - 48px - 29px - 24px - 32px - 1px);
    overflow-y: auto;
  }

  .generate-btn {
    width: 100%;
    font-size: 14px;
  }
}
</style>
