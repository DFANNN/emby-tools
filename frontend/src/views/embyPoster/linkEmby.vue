<template>
  <div class="link-emby-container">
    <div class="module-header">
      <h2>Emby 连接设置</h2>
      <el-tag :type="connectionStatus ? 'success' : 'info'">
        {{ connectionStatus ? '已连接' : '未连接' }}
      </el-tag>
    </div>
    <el-form :model="connectionForm" label-position="top">
      <div class="form-row">
        <el-form-item label="协议" class="protocol-item">
          <el-select v-model="connectionForm.protocol" placeholder="请选择协议">
            <el-option label="HTTP" value="http" />
            <el-option label="HTTPS" value="https" />
          </el-select>
        </el-form-item>
        <el-form-item label="服务器地址">
          <el-input v-model="connectionForm.ip" placeholder="请输入服务器地址" />
        </el-form-item>
        <el-form-item label="端口" class="port-item">
          <el-input v-model="connectionForm.port" placeholder="端口号" />
        </el-form-item>
      </div>
      <el-form-item label="API Token">
        <el-input v-model="connectionForm.apiKey" placeholder="请输入 API Token" show-password />
      </el-form-item>
      <el-button type="primary" @click="connectToEmby" :loading="connecting" class="connect-btn">
        {{ connectionStatus ? '重新连接' : '连接服务器' }}
      </el-button>
    </el-form>
  </div>
</template>

<script setup lang="ts">
const connecting = ref(false)
const connectionStatus = ref(false)

const connectionForm = ref({
  protocol: 'http',
  ip: '',
  port: '8096',
  apiKey: ''
})

const connectToEmby = async () => {
  // TODO: 实现 Emby 连接
}
</script>

<style scoped lang="scss">
.link-emby-container {
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
  .connect-btn {
    width: 100%;
    margin-top: 1rem;
  }
}
</style>
