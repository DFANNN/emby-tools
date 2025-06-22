<template>
  <div class="poster-rules-container">
    <div class="module-header">
      <h2>封面生成规则</h2>
      <div>
        <el-tooltip content="Emby连接设置" placement="top">
          <el-button size="small" type="success" text @click="linkEmbyConfigRef?.showDialog()">
            <el-icon style="font-size: 16px"><Link /></el-icon>
          </el-button>
        </el-tooltip>

        <el-tag :type="embyPosterStore.connectionStatus ? 'success' : 'info'">
          {{ embyPosterStore.connectionStatus ? 'Emby已连接' : 'Emby未连接' }}
        </el-tag>
      </div>
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
        <el-form-item label="封面图模版" prop="posterTemplate">
          <div class="poster-template-grid">
            <div
              v-for="item in templateList"
              :key="item.value"
              :class="{ 'template-card': true, active: embyPosterStore.ruleForm.posterTemplate === item.value }"
              @click="embyPosterStore.ruleForm.posterTemplate = item.value"
            >
              <img :src="item.img" :alt="item.label" />
              <div class="template-label">{{ item.label }}</div>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="图片来源" required prop="pictureSource">
          <el-radio-group v-model="embyPosterStore.ruleForm.pictureSource">
            <el-radio value="local">本地媒体库</el-radio>
            <el-radio value="tmdb">TMDB</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>

    <!-- 生成按钮 -->
    <el-button type="primary" @click="generatePoster" class="generate-btn"> 生成封面 </el-button>

    <LinkEmbyConfig ref="linkEmbyConfigRef" />
  </div>
</template>

<script setup lang="ts">
import { useEmbyPosterStore } from '@/stores/embyPoster'
import { Link } from '@element-plus/icons-vue'
import LinkEmbyConfig from '@/views/embyPoster/linkEmbyConfig.vue'
import posterOneImg from '@/assets/poster_one.png'
import posterTwoImg from '@/assets/poster_two.png'
import posterThreeImg from '@/assets/poster_three.png'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'

const embyPosterStore = useEmbyPosterStore()

// ref
const linkEmbyConfigRef = useTemplateRef('linkEmbyConfigRef')
const ruleFormRef = useTemplateRef<FormInstance>('ruleFormRef')

// 生成封面
const generatePoster = async () => {
  // 验证表单
  await ruleFormRef.value?.validate()
  // 验证emby连接状态
  if (!embyPosterStore.connectionStatus) {
    ElMessage.warning('请先连接Emby')
    return
  }
  // 整理需要生成封面的媒体库列表
  embyPosterStore.needGeneratePosterMediaLibraryList = embyPosterStore.embyMediaLibraryList.filter(item => {
    return embyPosterStore.ruleForm.ids.includes(item.Id)
  })
  // 整理需要生成封面的数据
  for (const item of embyPosterStore.needGeneratePosterMediaLibraryList) {
    item.imageUrls = await embyPosterStore.generatePreviewImageUrls(item.Id)
    item.backgroundGradient = embyPosterStore.getRandomGradient()
  }
  // 显示预览海报
  embyPosterStore.showPreviewPoster = true
}

const rules = ref<FormRules>({
  ids: [{ required: true, message: '请选择媒体库', trigger: 'blur' }]
})

const templateList = [
  { value: '1', label: '模版一', img: posterOneImg },
  { value: '2', label: '模版二', img: posterTwoImg },
  { value: '3', label: '模版三', img: posterThreeImg }
]
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
    .poster-template-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      width: 100%;
      .template-card {
        cursor: pointer;
        &.active {
          img {
            border-color: var(--el-color-primary);
            box-shadow: 0 4px 16px rgba(64, 158, 255, 0.18);
          }
          .template-label {
            color: var(--el-color-primary);
          }
        }
        img {
          width: 100%;
          aspect-ratio: 16/9;
          object-fit: cover;
          display: block;
          border-radius: 4px;
          border: 2px solid transparent;
          transition: border-color 0.2s;
        }
        .template-label {
          text-align: center;
          font-size: var(--el-radio-font-size);
          color: var(--el-text-color-regular);
          font-weight: 500;
          transition: color 0.2s;
        }
      }
    }
  }

  .generate-btn {
    width: 100%;
    font-size: 14px;
  }
}
</style>
