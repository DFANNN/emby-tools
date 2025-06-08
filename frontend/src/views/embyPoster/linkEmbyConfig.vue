<template>
  <el-dialog v-model="visible" title="Emby连接设置" width="500px" :close-on-click-modal="false" @close="cancel">
    <el-form :model="embyPosterStore.connectionForm" :rules="rules" label-position="top" ref="connectionFormRef">
      <el-form-item label="协议" prop="protocol">
        <el-select v-model="embyPosterStore.connectionForm.protocol" placeholder="请选择协议">
          <el-option label="HTTP" value="http" />
          <el-option label="HTTPS" value="https" />
        </el-select>
      </el-form-item>
      <el-form-item label="服务器地址" prop="ip">
        <el-input v-model="embyPosterStore.connectionForm.ip" placeholder="请输入服务器地址" />
      </el-form-item>
      <el-form-item label="端口" prop="port">
        <el-input v-model="embyPosterStore.connectionForm.port" placeholder="端口号" />
      </el-form-item>
      <el-form-item label="API Token" prop="apiKey">
        <el-input v-model="embyPosterStore.connectionForm.apiKey" placeholder="请输入 API Token" show-password />
      </el-form-item>

      <el-button type="primary" @click="connectToEmby" class="connect-btn">
        {{ embyPosterStore.connectionStatus ? '重新连接' : '连接服务器' }}
      </el-button>
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'

const embyPosterStore = useEmbyPosterStore()

// ref
const connectionFormRef = useTemplateRef<FormInstance>('connectionFormRef')

// dialog开关
const visible = ref(false)

// 连接emby
const connectToEmby = async () => {
  await connectionFormRef.value?.validate()
  await embyPosterStore.connectToEmby()
  cancel()
}

// 取消
const cancel = () => {
  visible.value = false
  connectionFormRef.value?.resetFields()
}

const rules = ref<FormRules>({
  protocol: [{ required: true, message: '请选择协议', trigger: 'blur' }],
  ip: [{ required: true, message: '请输入服务器地址', trigger: 'blur' }],
  port: [{ required: true, message: '请输入端口号', trigger: 'blur' }],
  apiKey: [{ required: true, message: '请输入 API Token', trigger: 'blur' }]
})

const showDialog = () => {
  embyPosterStore.getEmbyUrlAndApiKey()
  visible.value = true
}

defineExpose({ showDialog })
</script>

<style scoped lang="scss">
.connect-btn {
  width: 100%;
  margin-top: 1rem;
}
</style>
