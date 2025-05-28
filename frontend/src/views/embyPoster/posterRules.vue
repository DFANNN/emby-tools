<template>
  <div class="poster-rules-container">
    <div class="module-header">
      <h2>封面生成规则</h2>
      <div class="header-actions">
        <el-tooltip content="添加规则" placement="top">
          <el-button type="primary" text @click="createUpdateRuleRef?.showDialog('create')">
            <el-icon><Plus /></el-icon>
          </el-button>
        </el-tooltip>
        <el-tooltip content="选择规则" placement="top">
          <el-button
            type="primary"
            text
            @click="selectPosterRulesRef?.showDialog(embyPosterStore.currentGeneratePosterRule.id)"
          >
            <el-icon><Select /></el-icon>
          </el-button>
        </el-tooltip>
      </div>
    </div>

    <!-- 选择需要生成封面的媒体库列表 -->
    <el-form
      :model="embyPosterStore.needGeneratePosterMediaLibraryForm"
      :rules="rules"
      label-position="top"
      ref="needGeneratePosterMediaLibraryFormRef"
    >
      <el-form-item label="选择媒体库" prop="ids">
        <el-select v-model="embyPosterStore.needGeneratePosterMediaLibraryForm.ids" multiple placeholder="请选择媒体库">
          <el-option
            :label="item.Name"
            :value="item.Id"
            v-for="item in embyPosterStore.embyMediaLibraryList"
            :key="item.Id"
          />
        </el-select>
      </el-form-item>
    </el-form>

    <!-- 规则列表 -->
    <div class="rules-list">
      <RuleCard :rules="embyPosterStore.currentGeneratePosterRule" />
    </div>

    <!-- 生成按钮 -->
    <div class="generate-action">
      <el-button type="primary" @click="generatePoster" class="generate-btn"> 生成封面 </el-button>
    </div>

    <CreateUpdateRule ref="createUpdateRuleRef" />
    <SelectPosterRules ref="selectPosterRulesRef" />
  </div>
</template>

<script setup lang="ts">
import { useEmbyPosterStore } from '@/stores/embyPoster'
import { Plus, Select } from '@element-plus/icons-vue'
import RuleCard from '@/views/embyPoster/ruleCard.vue'
import CreateUpdateRule from '@/views/embyPoster/createUpdateRule.vue'
import SelectPosterRules from '@/views/embyPoster/selectPosterRules.vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'

const embyPosterStore = useEmbyPosterStore()

const createUpdateRuleRef = useTemplateRef('createUpdateRuleRef')
const selectPosterRulesRef = useTemplateRef('selectPosterRulesRef')
const needGeneratePosterMediaLibraryFormRef = useTemplateRef<FormInstance>('needGeneratePosterMediaLibraryFormRef')

// 生成封面
const generatePoster = async () => {
  // 验证表单
  await needGeneratePosterMediaLibraryFormRef.value?.validate()
  // 验证emby连接状态
  if (!embyPosterStore.connectionStatus) {
    ElMessage.warning('请先连接Emby')
    return
  }
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
  .generate-action {
    margin-top: 24px;
    padding-top: 16px;
    display: flex;
    justify-content: center;
    .generate-btn {
      width: 100%;
      font-size: 14px;
    }
  }
}
</style>
