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
      </el-form>
    </div>

    <!-- 生成按钮 -->
    <el-button type="primary" @click="generatePoster" class="generate-btn"> 生成封面 </el-button>
  </div>
</template>

<script setup lang="ts">
import { useEmbyPosterStore } from '@/stores/embyPoster'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'

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

// ref
const ruleFormRef = useTemplateRef<FormInstance>('ruleFormRef')

// 生成封面
const generatePoster = async () => {
  if (!layoutStore.linkEmbyStatus) {
    ElMessage.warning('请先连接Emby')
    return
  }
  // 整理需要生成封面的媒体库列表
  embyPosterStore.needGeneratePosterMediaLibraryList = embyPosterStore.embyMediaLibraryList.filter(item => {
    return embyPosterStore.ruleForm.ids.includes(item.Id)
  })
  // 整理需要生成封面的数据
  for (const item of embyPosterStore.needGeneratePosterMediaLibraryList) {
    item.imageUrls = await embyPosterStore.getRadomPoster(item.Id)
    item.backgroundGradient = embyPosterStore.getRandomGradient({
      palette: embyPosterStore.ruleForm.palette?.length ? embyPosterStore.ruleForm.palette : undefined,
      type: embyPosterStore.ruleForm.gradientType,
      stops: embyPosterStore.ruleForm.gradientStops
    })
  }
  // 显示预览海报
  embyPosterStore.showPreviewPoster = true
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
