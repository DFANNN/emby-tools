<template>
  <div class="rename-rules-container">
    <h2>emby重命名规则</h2>
    <div class="rename-rule-wrap">
      <div class="rename-path-wrap">
        <el-input v-model="renameStore.path" clearable placeholder="请选择或输入文件夹路径" @keydown.enter="searchPath">
          <template #append>
            <el-button :icon="FolderAdd" @click="renameStore.showDialog()" />
          </template>
        </el-input>
      </div>
      <div>
        <el-form :model="renameStore.ruleForm" :rules="rules" label-position="top" ref="ruleFormRef">
          <el-form-item label="选择模式" prop="model">
            <el-radio-group v-model="renameStore.ruleForm.model">
              <el-radio value="tv">
                电视剧集
                <el-tooltip :content="tvModelTooltip" placement="top">
                  <el-icon><QuestionFilled /></el-icon>
                </el-tooltip>
              </el-radio>
              <el-radio value="replace">替换文本</el-radio>
              <el-radio value="insert">插入文本</el-radio>
            </el-radio-group>
          </el-form-item>

          <div v-if="renameStore.ruleForm.model === 'tv'">
            <el-form-item label="电视剧名称" prop="newFileName">
              <el-input v-model="renameStore.ruleForm.newFileName" clearable placeholder="请输入剧集名称" />
            </el-form-item>
            <el-form-item label="默认季号（可选）" help="123" prop="seasonNumber">
              <el-input-number
                v-model="renameStore.ruleForm.seasonNumber"
                :min="0"
                placeholder="留空则自动解析"
                class="number-input"
              />
              <div class="form-tip">留空时自动解析，填写后将优先生效并覆盖文件名中的季数。</div>
            </el-form-item>
          </div>

          <div v-if="renameStore.ruleForm.model === 'replace'">
            <el-form-item label="查找文本" prop="targetName">
              <el-input v-model="renameStore.ruleForm.targetName" clearable placeholder="请输入查找文本" />
            </el-form-item>
            <el-form-item label="替换文本" prop="replaceName">
              <el-input v-model="renameStore.ruleForm.replaceName" clearable placeholder="请输入替换文本" />
            </el-form-item>
          </div>

          <div v-if="renameStore.ruleForm.model === 'insert'">
            <el-form-item label="插入规则" prop="insertPosition">
              <el-select v-model="renameStore.ruleForm.insertPosition" placeholder="请选择">
                <el-option label="插入到文件名开头" value="start" />
                <el-option label="插入到文件名结尾" value="end" />
              </el-select>
            </el-form-item>
            <el-form-item label="插入文本" prop="insertText">
              <el-input v-model="renameStore.ruleForm.insertText" clearable placeholder="请输入插入文本" />
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>

    <el-button type="primary" class="preview-btn" @click="previewRename">预览重命名结果</el-button>
    <SelectFolder />
  </div>
</template>

<script setup lang="ts">
import SelectFolder from '@/views/rename/selectFolder.vue'
import { FolderAdd } from '@element-plus/icons-vue'
import { getSeriesNameFromPath } from '@/utils/utils'
import { QuestionFilled } from '@element-plus/icons-vue'
import { type FormRules, type FormInstance, ElMessage } from 'element-plus'

const renameStore = useRenameStore()
const ruleFormRef = ref<FormInstance>()

const tvModelTooltip =
  '该模式适用于批量重命名电视剧集文件。会自动识别文件名中的季、集信息，并按统一格式进行规范化重命名，适合整理 Emby、Jellyfin 等媒体库的剧集文件。'

const searchPath = () => {
  // 截取文件路径中的名字
  renameStore.ruleForm.newFileName = getSeriesNameFromPath(renameStore.path) || ''
  renameStore.getRenameFileList()
}

// 预览重命名结果
const previewRename = async () => {
  if (!renameStore.path) {
    ElMessage.warning('请先选择文件夹')
    return
  }
  // 验证表单
  await ruleFormRef.value?.validate()
  await renameStore.getRenameFileList()
  if (renameStore.ruleForm.model === 'tv') renameStore.reanalyzeFiles()
  if (renameStore.ruleForm.model === 'replace') renameStore.previewReplace()
  if (renameStore.ruleForm.model === 'insert') renameStore.previewInsert()
}

const rules = ref<FormRules>({
  model: [{ required: true, message: '请选择模式', trigger: 'blur' }],
  newFileName: [{ required: true, message: '请输入电视剧名称', trigger: 'blur' }],
  targetName: [{ required: true, message: '请输入查找文本', trigger: 'blur' }],
  replaceName: [{ required: true, message: '请输入替换文本', trigger: 'blur' }],
  insertPosition: [{ required: true, message: '请选择插入位置', trigger: 'blur' }],
  insertText: [{ required: true, message: '请输入插入文本', trigger: 'blur' }]
})
</script>

<style scoped lang="scss">
.rename-rules-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: var(--el-bg-color-overlay);
  border-radius: var(--el-border-radius-base);
  padding: 1.5rem;
  box-shadow: var(--el-box-shadow-light);
  h2 {
    margin: 0;
    font-size: 1.25rem;
    color: var(--el-text-color-primary);
    margin-bottom: 1.5rem;
  }
  .rename-rule-wrap {
    height: calc(100vh - 59px - 40px - 48px - 29px - 24px - 32px - 1px);
    overflow-y: auto;
    .rename-path-wrap {
      border: 2px dashed var(--el-border-color);
      border-radius: 8px;
      padding: 1.5rem 1rem;
      margin-bottom: 1.5rem;
    }
    .number-input {
      width: 100%;
    }
    .form-tip {
      font-size: 12px;
      color: var(--el-text-color-secondary);
      margin-top: 4px;
      line-height: 1.2;
    }
  }

  .preview-btn {
    width: 100%;
    font-size: 14px;
  }
}
</style>
