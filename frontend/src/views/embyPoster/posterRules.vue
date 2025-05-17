<template>
  <div class="poster-rules-container">
    <div class="module-header">
      <h2>封面生成规则</h2>
      <div class="header-actions">
        <el-tooltip content="添加规则" placement="top">
          <el-button type="primary" text @click="createUpdateRuleRef?.showDialog()">
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

    <!-- 规则列表 -->
    <div class="rules-list">
      <RuleCard :rules="embyPosterStore.currentGeneratePosterRule" />
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

    <CreateUpdateRule ref="createUpdateRuleRef" />
    <SelectPosterRules ref="selectPosterRulesRef" />
  </div>
</template>

<script setup lang="ts">
import { useEmbyPosterStore } from '@/stores/embyPoster'
import { Plus, Select, Picture } from '@element-plus/icons-vue'
import RuleCard from '@/views/embyPoster/ruleCard.vue'
import CreateUpdateRule from '@/views/embyPoster/createUpdateRule.vue'
import SelectPosterRules from '@/views/embyPoster/selectPosterRules.vue'

const embyPosterStore = useEmbyPosterStore()

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

const createUpdateRuleRef = useTemplateRef('createUpdateRuleRef')
const selectPosterRulesRef = useTemplateRef('selectPosterRulesRef')

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

const currentRuleId = ref<string>('')
const generating = ref(false)

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
  //   ruleDialogVisible.value = true
}

const showSelectRuleDialog = () => {
  //   tempSelectedRuleId.value = currentRuleId.value
  //   selectRuleDialogVisible.value = true
}

// 生成封面
const generatePoster = async () => {
  generating.value = true
  try {
    // TODO: 实现封面生成
    await new Promise(resolve => setTimeout(resolve, 1000)) // 模拟生成过程
    // hasGeneratedPosters.value = true
  } finally {
    generating.value = false
  }
}
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
    border-top: 1px solid var(--el-border-color-lighter);
    display: flex;
    justify-content: center;
    .generate-btn {
      width: 100%;
      height: 40px;
      font-size: 14px;
    }
  }
}
</style>
