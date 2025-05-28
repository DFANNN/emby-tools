<template>
  <div class="link-emby-container">
    <div class="module-header">
      <h2>Emby 连接设置</h2>
      <el-tag :type="embyPosterStore.connectionStatus ? 'success' : 'info'">
        {{ embyPosterStore.connectionStatus ? '已连接' : '未连接' }}
      </el-tag>
    </div>
    <el-form :model="connectionForm" :rules="rules" label-position="top" ref="connectionFormRef">
      <el-form-item label="协议" prop="protocol">
        <el-select v-model="connectionForm.protocol" placeholder="请选择协议">
          <el-option label="HTTP" value="http" />
          <el-option label="HTTPS" value="https" />
        </el-select>
      </el-form-item>
      <el-form-item label="服务器地址" prop="ip">
        <el-input v-model="connectionForm.ip" placeholder="请输入服务器地址" />
      </el-form-item>
      <el-form-item label="端口" prop="port">
        <el-input v-model="connectionForm.port" placeholder="端口号" />
      </el-form-item>
      <el-form-item label="API Token" prop="apiKey">
        <el-input v-model="connectionForm.apiKey" placeholder="请输入 API Token" show-password />
      </el-form-item>
      <el-button type="primary" @click="connectToEmby" :loading="connecting" class="connect-btn">
        {{ embyPosterStore.connectionStatus ? '重新连接' : '连接服务器' }}
      </el-button>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { setEmbyUrl } from '@/utils/request'
import { linkEmby } from '@/api/embyPoster'
import type { FormInstance, FormRules } from 'element-plus'
import type { IConnectionForm } from '@/types/embyPoster'

const embyPosterStore = useEmbyPosterStore()

const connecting = ref(false)

const connectionFormRef = useTemplateRef<FormInstance>('connectionFormRef')

// 连接emby的表单
const connectionForm = ref<IConnectionForm>({
  protocol: 'http',
  ip: '',
  port: '8096',
  apiKey: ''
})

// 连接emby
const connectToEmby = async () => {
  await connectionFormRef.value?.validate()
  const url = `${connectionForm.value.protocol}://${connectionForm.value.ip}:${connectionForm.value.port}`
  setEmbyUrl(url, connectionForm.value.apiKey)
  const res = await linkEmby()
  if (res.status === 200) {
    // 获取媒体库列表
    embyPosterStore.embyMediaLibraryList = res.data.Items.map((item: any) => {
      return {
        Id: item.Id, // 媒体库id
        Name: item.Name, // 媒体库名称
        CollectionType: item.CollectionType, // 媒体库类型
        ImageUrl: `${url}/Items/${item.Id}/Images/Primary` //封面图片地址
      }
    })
    // 默认全选需要生成封面的媒体库
    embyPosterStore.needGeneratePosterMediaLibraryForm.ids = embyPosterStore.embyMediaLibraryList.map(item => item.Id)
    // 获取需要生成封面的媒体库列表
    embyPosterStore.needGeneratePosterMediaLibraryList = embyPosterStore.embyMediaLibraryList.filter(item =>
      embyPosterStore.needGeneratePosterMediaLibraryForm.ids.includes(item.Id)
    )
    embyPosterStore.connectionStatus = true
  }
}

// 从localStorage中获取emby的url和apiKey,并且设置到connectionForm中
const getEmbyUrlAndApiKey = () => {
  const url = localStorage.getItem('emby_url')
  const apiKey = localStorage.getItem('emby_token')
  if (!url && !apiKey) return
  const embyUrl = new URL(url!)
  connectionForm.value.protocol = embyUrl.protocol.replace(':', '')
  connectionForm.value.ip = embyUrl.hostname
  connectionForm.value.port = embyUrl.port
  connectionForm.value.apiKey = apiKey!
}

const rules = ref<FormRules>({
  protocol: [{ required: true, message: '请选择协议', trigger: 'blur' }],
  ip: [{ required: true, message: '请输入服务器地址', trigger: 'blur' }],
  port: [{ required: true, message: '请输入端口号', trigger: 'blur' }],
  apiKey: [{ required: true, message: '请输入 API Token', trigger: 'blur' }]
})

onMounted(() => {
  getEmbyUrlAndApiKey()
})
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
