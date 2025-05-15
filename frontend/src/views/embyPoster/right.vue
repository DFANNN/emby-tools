<template>
  <div class="emby-poster-generator">
    <div class="left-panel">
      <div class="module emby-connection">
        <div class="module-header">
          <h2>Emby 连接设置</h2>
          <el-tag :type="connectionStatus ? 'success' : 'info'" size="small">
            {{ connectionStatus ? '已连接' : '未连接' }}
          </el-tag>
        </div>
        <div class="connection-form">
          <el-form :model="connectionForm" label-position="top">
            <div class="form-row">
              <el-form-item label="协议" class="protocol-item">
                <el-select v-model="connectionForm.protocol" placeholder="请选择协议">
                  <el-option label="HTTP" value="http" />
                  <el-option label="HTTPS" value="https" />
                </el-select>
              </el-form-item>
              <el-form-item label="端口" class="port-item">
                <el-input v-model="connectionForm.port" placeholder="端口号" />
              </el-form-item>
            </div>
            <el-form-item label="服务器地址">
              <el-input v-model="connectionForm.ip" placeholder="请输入服务器地址" />
            </el-form-item>
            <el-form-item label="API Token">
              <el-input v-model="connectionForm.apiKey" placeholder="请输入 API Token" show-password />
            </el-form-item>
            <el-button type="primary" @click="connectToEmby" :loading="connecting" class="connect-btn">
              {{ connectionStatus ? '重新连接' : '连接服务器' }}
            </el-button>
          </el-form>
        </div>
      </div>

      <div class="module poster-rules">
        <div class="module-header">
          <h2>封面生成规则</h2>
          <div class="header-actions">
            <el-tooltip content="添加规则" placement="top">
              <el-button type="primary" text @click="showRuleDialog('add')">
                <el-icon><Plus /></el-icon>
              </el-button>
            </el-tooltip>
            <el-tooltip content="选择规则" placement="top">
              <el-button type="primary" text @click="showSelectRuleDialog">
                <el-icon><Select /></el-icon>
              </el-button>
            </el-tooltip>
          </div>
        </div>

        <!-- 规则列表 -->
        <div class="rules-list">
          <div
            v-for="rule in savedRules"
            :key="rule.id"
            class="rule-item"
            :class="{ active: currentRuleId === rule.id }"
            @click="selectRule(rule)"
          >
            <div class="rule-item-header">
              <span class="rule-name">{{ rule.name }}</span>
              <div class="rule-preview">
                <el-tag size="small" :type="rule.config.layout === 'grid' ? 'success' : 'info'">
                  {{ getLayoutName(rule.config.layout) }}
                </el-tag>
                <el-tag size="small" :type="rule.config.source === 'local' ? 'success' : 'warning'">
                  {{ rule.config.source === 'local' ? '本地媒体' : 'TMDB热门' }}
                </el-tag>
              </div>
            </div>
            <p class="rule-description">{{ rule.description || '暂无描述' }}</p>
          </div>
        </div>

        <!-- 生成按钮 -->
        <div class="generate-action">
          <el-button
            type="primary"
            @click="generatePoster"
            :loading="generating"
            :disabled="!currentRuleId"
            class="generate-btn"
          >
            <el-icon><Picture /></el-icon>生成封面
          </el-button>
        </div>
      </div>
    </div>

    <div class="right-panel">
      <div class="module preview">
        <div class="preview-header">
          <h2>预览效果</h2>
          <el-button type="success" @click="uploadPoster" :disabled="!hasGeneratedPosters">上传到 Emby</el-button>
        </div>
        <div class="preview-container">
          <div class="poster-grid">
            <div v-for="(poster, index) in previewPosters" :key="index" class="poster-card">
              <div class="poster-image">
                <img :src="poster.image" :alt="poster.title" />
                <div class="poster-overlay">
                  <span class="poster-title">{{ poster.title }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 规则编辑对话框 -->
    <el-dialog
      v-model="ruleDialogVisible"
      :title="dialogType === 'add' ? '添加规则' : '编辑规则'"
      width="600px"
      :close-on-click-modal="false"
      destroy-on-close
    >
      <el-form :model="rulesForm" label-position="top" class="rule-form">
        <el-form-item label="规则名称" required>
          <el-input v-model="rulesForm.name" placeholder="请输入规则名称" />
        </el-form-item>

        <el-form-item label="规则描述">
          <el-input v-model="rulesForm.description" type="textarea" placeholder="请输入规则描述" :rows="2" />
        </el-form-item>

        <el-form-item label="布局样式">
          <el-radio-group v-model="rulesForm.layout" class="layout-options">
            <el-radio-button label="grid">网格布局</el-radio-button>
            <el-radio-button label="masonry">瀑布流</el-radio-button>
            <el-radio-button label="carousel">轮播图</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="配色方案">
          <div class="color-pickers">
            <div class="color-item">
              <span>主色调</span>
              <el-color-picker v-model="rulesForm.primaryColor" show-alpha />
            </div>
            <div class="color-item">
              <span>辅助色</span>
              <el-color-picker v-model="rulesForm.secondaryColor" show-alpha />
            </div>
          </div>
        </el-form-item>

        <el-form-item label="文字颜色">
          <el-color-picker v-model="rulesForm.textColor" show-alpha />
        </el-form-item>

        <el-form-item label="特效">
          <el-checkbox-group v-model="rulesForm.effects" class="effects-group">
            <el-checkbox label="gradient">渐变效果</el-checkbox>
            <el-checkbox label="blur">模糊效果</el-checkbox>
            <el-checkbox label="glow">发光效果</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="图片来源">
          <el-radio-group v-model="rulesForm.source" class="source-group">
            <el-radio label="local">本地媒体库</el-radio>
            <el-radio label="tmdb">TMDB 热门</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="ruleDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveRule" :loading="saving"> 保存 </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 选择规则对话框 -->
    <el-dialog
      v-model="selectRuleDialogVisible"
      title="选择规则"
      width="600px"
      :close-on-click-modal="false"
      destroy-on-close
    >
      <div class="select-rule-container">
        <div class="rule-cards">
          <div
            v-for="rule in savedRules"
            :key="rule.id"
            class="rule-card"
            :class="{ active: currentRuleId === rule.id }"
            @click="selectRule(rule)"
          >
            <div class="rule-card-header">
              <span class="rule-name">{{ rule.name }}</span>
              <div class="rule-actions">
                <el-button type="primary" link @click.stop="showRuleDialog('edit', rule)">
                  <el-icon><Edit /></el-icon>
                </el-button>
                <el-button type="danger" link @click.stop="deleteRule(rule)">
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>
            </div>
            <p class="rule-description">{{ rule.description || '暂无描述' }}</p>
            <div class="rule-preview">
              <div class="preview-item" :style="{ backgroundColor: rule.config.primaryColor }"></div>
              <div class="preview-item" :style="{ backgroundColor: rule.config.secondaryColor }"></div>
              <div class="preview-item" :style="{ backgroundColor: rule.config.textColor }"></div>
            </div>
            <div class="rule-tags">
              <el-tag size="small" :type="rule.config.layout === 'grid' ? 'success' : 'info'">
                {{ getLayoutName(rule.config.layout) }}
              </el-tag>
              <el-tag size="small" :type="rule.config.source === 'local' ? 'success' : 'warning'">
                {{ rule.config.source === 'local' ? '本地媒体' : 'TMDB热门' }}
              </el-tag>
              <el-tag v-for="effect in rule.config.effects" :key="effect" size="small" type="info">
                {{ getEffectName(effect) }}
              </el-tag>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="selectRuleDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmSelectRule">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Refresh, Picture, Edit, Delete, Back, Select } from '@element-plus/icons-vue'

const connectionStatus = ref(false)
const connecting = ref(false)
const generating = ref(false)
const hasGeneratedPosters = ref(false)

const connectionForm = reactive({
  protocol: 'http',
  ip: '',
  port: '8096',
  apiKey: ''
})

interface RuleForm {
  name: string
  description: string
  layout: string
  primaryColor: string
  secondaryColor: string
  textColor: string
  effects: string[]
  source: string
}

const rulesForm = reactive<RuleForm>({
  name: '',
  description: '',
  layout: 'grid',
  primaryColor: '#409EFF',
  secondaryColor: '#67C23A',
  textColor: '#FFFFFF',
  effects: ['gradient'],
  source: 'local'
})

// 模拟预览数据
const previewPosters = ref([
  { title: '电影 1', image: 'https://via.placeholder.com/300x450' },
  { title: '电影 2', image: 'https://via.placeholder.com/300x450' },
  { title: '电影 3', image: 'https://via.placeholder.com/300x450' },
  { title: '电影 4', image: 'https://via.placeholder.com/300x450' },
  { title: '电影 5', image: 'https://via.placeholder.com/300x450' },
  { title: '电影 6', image: 'https://via.placeholder.com/300x450' }
])

const connectToEmby = async () => {
  // TODO: 实现 Emby 连接
}

const generatePoster = async () => {
  generating.value = true
  try {
    // TODO: 实现封面生成
    await new Promise(resolve => setTimeout(resolve, 1000)) // 模拟生成过程
    hasGeneratedPosters.value = true
  } finally {
    generating.value = false
  }
}

const uploadPoster = async () => {
  // TODO: 实现封面上传
}

// 规则管理相关
interface Rule {
  id: string
  name: string
  description: string
  config: {
    layout: string
    primaryColor: string
    secondaryColor: string
    textColor: string
    effects: string[]
    source: string
  }
}

const currentRuleId = ref<string>('')

// 默认规则
const defaultRules: Rule[] = [
  {
    id: '1',
    name: '默认网格布局',
    description: '使用网格布局展示本地媒体库内容，适合电影和剧集展示',
    config: {
      layout: 'grid',
      primaryColor: '#409EFF',
      secondaryColor: '#67C23A',
      textColor: '#FFFFFF',
      effects: ['gradient'],
      source: 'local'
    }
  },
  {
    id: '2',
    name: '瀑布流布局',
    description: '使用瀑布流布局展示TMDB热门内容，适合展示海报墙',
    config: {
      layout: 'masonry',
      primaryColor: '#E6A23C',
      secondaryColor: '#F56C6C',
      textColor: '#FFFFFF',
      effects: ['gradient', 'blur'],
      source: 'tmdb'
    }
  },
  {
    id: '3',
    name: '轮播图布局',
    description: '使用轮播图展示精选内容，适合展示推荐内容',
    config: {
      layout: 'carousel',
      primaryColor: '#909399',
      secondaryColor: '#303133',
      textColor: '#FFFFFF',
      effects: ['gradient', 'glow'],
      source: 'local'
    }
  }
]

// 初始化规则列表
const savedRules = ref<Rule[]>([...defaultRules])

const showRuleDialog = (type: string, rule?: Rule) => {
  if (type === 'add') {
    rulesForm.name = ''
    rulesForm.description = ''
    rulesForm.layout = 'grid'
    rulesForm.primaryColor = '#409EFF'
    rulesForm.secondaryColor = '#67C23A'
    rulesForm.textColor = '#FFFFFF'
    rulesForm.effects = ['gradient']
    rulesForm.source = 'local'
  } else if (type === 'edit') {
    if (rule) {
      rulesForm.name = rule.name
      rulesForm.description = rule.description
      rulesForm.layout = rule.config.layout
      rulesForm.primaryColor = rule.config.primaryColor
      rulesForm.secondaryColor = rule.config.secondaryColor
      rulesForm.textColor = rule.config.textColor
      rulesForm.effects = rule.config.effects
      rulesForm.source = rule.config.source
    }
  }
  ruleDialogVisible.value = true
}

const saving = ref(false)

// 监听规则选择变化
watch(currentRuleId, newId => {
  if (newId) {
    const selectedRule = savedRules.value.find(rule => rule.id === newId)
    if (selectedRule) {
      Object.assign(rulesForm, selectedRule.config)
    }
  }
})

// 保存规则
const saveRule = async () => {
  if (!rulesForm.name.trim()) {
    ElMessage.warning('请输入规则名称')
    return
  }

  saving.value = true
  try {
    // 模拟保存过程
    await new Promise(resolve => setTimeout(resolve, 500))

    const newRuleData: Rule = {
      id: Date.now().toString(),
      name: rulesForm.name,
      description: rulesForm.description,
      config: { ...rulesForm }
    }

    savedRules.value.push(newRuleData)
    currentRuleId.value = newRuleData.id
    ruleDialogVisible.value = false

    ElMessage.success('规则保存成功')
  } finally {
    saving.value = false
  }
}

// 重置规则时也重置规则选择
const resetRules = () => {
  Object.assign(rulesForm, {
    layout: 'grid',
    primaryColor: '#409EFF',
    secondaryColor: '#67C23A',
    textColor: '#FFFFFF',
    effects: ['gradient'],
    source: 'local'
  })
  currentRuleId.value = ''
}

// 选择规则
const selectRule = (rule: Rule) => {
  currentRuleId.value = rule.id
  Object.assign(rulesForm, rule.config)
  ruleDialogVisible.value = false
}

// 删除规则
const deleteRule = (rule: Rule) => {
  // TODO: 实现删除规则
}

// 获取布局名称
const getLayoutName = (layout: string) => {
  switch (layout) {
    case 'grid':
      return '网格布局'
    case 'masonry':
      return '瀑布流'
    case 'carousel':
      return '轮播图'
    default:
      return '未知布局'
  }
}

const ruleDialogVisible = ref(false)
const dialogType = ref('')

// 选择规则对话框相关
const selectRuleDialogVisible = ref(false)
const tempSelectedRuleId = ref('')

const showSelectRuleDialog = () => {
  tempSelectedRuleId.value = currentRuleId.value
  selectRuleDialogVisible.value = true
}

const confirmSelectRule = () => {
  if (tempSelectedRuleId.value) {
    const selectedRule = savedRules.value.find(rule => rule.id === tempSelectedRuleId.value)
    if (selectedRule) {
      selectRule(selectedRule)
      ElMessage.success('规则选择成功')
    }
  }
  selectRuleDialogVisible.value = false
}

// 获取特效名称
const getEffectName = (effect: string) => {
  switch (effect) {
    case 'gradient':
      return '渐变效果'
    case 'blur':
      return '模糊效果'
    case 'glow':
      return '发光效果'
    default:
      return '未知特效'
  }
}
</script>

<style scoped>
.emby-poster-generator {
  width: 100%;
  display: flex;
  gap: 2rem;
  padding: 2rem;
  height: 100vh;
  background-color: var(--el-bg-color);
}

.left-panel {
  width: 400px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.right-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.module {
  background: var(--el-bg-color-overlay);
  border-radius: var(--el-border-radius-base);
  padding: 1.5rem;
  box-shadow: var(--el-box-shadow-light);
}

.preview {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.preview-container {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  background: var(--el-bg-color);
  border-radius: var(--el-border-radius-base);
}

.poster-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  padding: 1rem;
}

.poster-card {
  width: 320px;
  height: 180px;
  position: relative;
  transition: transform 0.3s ease;
}

.poster-card:hover {
  transform: scale(1.05);
}

.poster-image {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: var(--el-border-radius-base);
  overflow: hidden;
  box-shadow: var(--el-box-shadow-light);
}

.poster-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.poster-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0.75rem;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.poster-card:hover .poster-overlay {
  opacity: 1;
}

.poster-title {
  color: var(--el-color-white);
  font-size: 0.9rem;
  font-weight: 500;
}

h2 {
  margin: 0;
  color: var(--el-text-color-primary);
  font-size: 1.5rem;
}

.connection-form,
.rules-form {
  max-width: 100%;
}

.module-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.module-header h2 {
  margin: 0;
  font-size: 1.25rem;
  color: var(--el-text-color-primary);
}

.form-row {
  display: flex;
  gap: 1rem;
}

.protocol-item {
  flex: 1;
}

.port-item {
  width: 120px;
}

.connect-btn {
  width: 100%;
  margin-top: 1rem;
}

.layout-options {
  display: flex;
  width: 100%;
}

.layout-options :deep(.el-radio-button) {
  flex: 1;
}

.layout-options :deep(.el-radio-button__inner) {
  width: 100%;
}

.color-pickers {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.color-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.color-item span {
  width: 60px;
  color: var(--el-text-color-regular);
}

.effects-group {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.source-group {
  display: flex;
  gap: 2rem;
}

:deep(.el-form-item) {
  margin-bottom: 1.5rem;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  padding-bottom: 0.5rem;
  color: var(--el-text-color-regular);
}

:deep(.el-input__wrapper),
:deep(.el-select) {
  width: 100%;
}

.preview-actions {
  display: flex;
  gap: 1rem;
}

.header-actions {
  display: flex;
  gap: 4px;
  align-items: center;
}

.header-actions :deep(.el-button) {
  padding: 4px;
  height: auto;
}

.header-actions :deep(.el-icon) {
  font-size: 18px;
}

.header-actions :deep(.el-button:hover) {
  background-color: var(--el-color-primary-light-9);
  border-radius: 4px;
}

.rule-selector {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.rule-select {
  flex: 1;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--el-border-color-lighter);
}

:deep(.el-dialog__body) {
  padding-top: 1rem;
}

:deep(.el-dialog__header) {
  margin-right: 0;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.rule-management {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  background: var(--el-bg-color-page);
  border-radius: var(--el-border-radius-base);
}

.rule-selector {
  width: 100%;
}

.rule-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.generate-action {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid var(--el-border-color-lighter);
  display: flex;
  justify-content: center;
}

.generate-btn {
  width: 100%;
  height: 40px;
  font-size: 14px;
}

.generate-btn :deep(.el-icon) {
  margin-right: 8px;
}

:deep(.el-button.is-link) {
  padding: 0;
  height: auto;
  font-size: 0.9rem;
}

:deep(.el-button.is-link .el-icon) {
  margin-right: 0.25rem;
}

.rules-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.rule-item {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  background: var(--el-bg-color-page);
  border-radius: var(--el-border-radius-base);
  cursor: pointer;
  transition: background-color 0.3s ease;
  border: 1px solid var(--el-border-color-lighter);
}

.rule-item:hover {
  background-color: var(--el-bg-color-overlay);
}

.rule-item.active {
  border-color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
}

.rule-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.rule-name {
  font-size: 1rem;
  font-weight: 500;
}

.rule-description {
  font-size: 0.9rem;
  color: var(--el-text-color-secondary);
}

.rule-preview {
  display: flex;
  gap: 0.5rem;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.form-header h3 {
  margin: 0;
  font-size: 1.25rem;
  color: var(--el-text-color-primary);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.rule-form {
  max-height: 60vh;
  overflow-y: auto;
  padding-right: 1rem;
}

.rule-form::-webkit-scrollbar {
  width: 6px;
}

.rule-form::-webkit-scrollbar-thumb {
  background-color: var(--el-border-color-darker);
  border-radius: 3px;
}

.rule-form::-webkit-scrollbar-track {
  background-color: var(--el-border-color-lighter);
  border-radius: 3px;
}

/* 选择规则对话框样式 */
.select-rule-container {
  padding: 16px;
}

.rule-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
  max-height: 60vh;
  overflow-y: auto;
}

.rule-card {
  background: var(--el-bg-color-overlay);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.rule-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: var(--el-color-primary);
}

.rule-card.active {
  border-color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
}

.rule-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.rule-name {
  font-size: 16px;
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.rule-description {
  font-size: 13px;
  color: var(--el-text-color-secondary);
  margin: 8px 0;
  line-height: 1.4;
}

.rule-preview {
  display: flex;
  gap: 8px;
  margin: 12px 0;
}

.preview-item {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border: 1px solid var(--el-border-color);
}

.rule-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

/* 滚动条样式 */
.rule-cards::-webkit-scrollbar {
  width: 6px;
}

.rule-cards::-webkit-scrollbar-thumb {
  background-color: var(--el-border-color-darker);
  border-radius: 3px;
}

.rule-cards::-webkit-scrollbar-track {
  background-color: var(--el-border-color-lighter);
  border-radius: 3px;
}
</style>
