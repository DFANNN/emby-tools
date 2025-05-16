<template>
  <el-dialog v-model="visible" title="选择规则" width="600px" :close-on-click-modal="false" destroy-on-close>
    <div class="select-rule-container">
      <RuleCard
        :is-selected="embyPosterStore.currentGeneratePosterRule.id === item.id"
        :is-update-or-delete="true"
        :rules="item"
        v-for="item in embyPosterStore.allRuleList"
        :key="item.id"
      />
    </div>
    <template #footer>
      <span>
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import RuleCard from '@/views/embyPoster/ruleCard.vue'
import { useEmbyPosterStore } from '@/stores/embyPoster'

const embyPosterStore = useEmbyPosterStore()

const visible = ref(false)

const confirm = () => {}

const showDialog = () => {
  visible.value = true
}

defineExpose({ showDialog })
</script>

<style scoped lang="scss">
.select-rule-container {
  padding: 1rem 0;
  display: grid;
  gap: 2rem;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
}
</style>
