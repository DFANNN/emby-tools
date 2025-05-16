<!-- 创建/编辑规则组件 -->
<template>
  <el-dialog
    v-model="visible"
    :title="embyPosterStore.rulesForm.id ? '编辑规则' : '添加规则'"
    width="600px"
    :close-on-click-modal="false"
  >
    <el-form :model="embyPosterStore.rulesForm" label-position="top" ref="rulesFormRef">
      <el-form-item label="规则名称" required>
        <el-input v-model="embyPosterStore.rulesForm.name" placeholder="请输入规则名称" />
      </el-form-item>

      <el-form-item label="规则描述">
        <el-input
          v-model="embyPosterStore.rulesForm.description"
          type="textarea"
          placeholder="请输入规则描述"
          :rows="2"
        />
      </el-form-item>

      <el-form-item label="布局样式">
        <el-radio-group v-model="embyPosterStore.rulesForm.layout" class="layout-options">
          <el-radio-button :value="item.value" v-for="item in embyPosterStore.layoutList" :key="item.value">{{
            item.name
          }}</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="图片来源">
        <el-radio-group v-model="embyPosterStore.rulesForm.source" class="source-group">
          <el-radio :value="item.value" v-for="item in embyPosterStore.sourceList" :key="item.value">{{
            item.name
          }}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="saveRule"> 保存 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { useEmbyPosterStore } from '@/stores/embyPoster'

const embyPosterStore = useEmbyPosterStore()
const rulesFormRef = useTemplateRef('rulesFormRef')
// dialog开关
const visible = ref(false)

// 保存
const saveRule = () => {}

// 取消
const cancel = () => {
  visible.value = false
  rulesFormRef.value?.resetFields()
}

const showDialog = () => {
  visible.value = true
}

defineExpose({ showDialog })
</script>

<style scoped lang="scss">
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
</style>
