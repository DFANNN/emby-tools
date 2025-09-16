<template>
  <el-dialog v-model="visible" title="Emby连接设置" width="500px" :close-on-click-modal="false" @close="cancel">
    <el-tabs v-model="active" type="card" class="demo-tabs">
      <el-tab-pane label="Emby连接设置" name="1">
        <el-form
          :model="layoutStore.linkEmbyConfigForm"
          :rules="rules"
          label-position="top"
          ref="linkEmbyConfigFormRef"
          @keyup.enter="connectToEmby"
        >
          <el-form-item label="协议" prop="protocol">
            <el-select v-model="layoutStore.linkEmbyConfigForm.protocol" placeholder="请选择协议">
              <el-option label="HTTP" value="http" />
              <el-option label="HTTPS" value="https" />
            </el-select>
          </el-form-item>
          <el-form-item label="服务器地址" prop="ip">
            <el-input v-model="layoutStore.linkEmbyConfigForm.ip" placeholder="请输入服务器地址，例如：192.168.1.223" />
          </el-form-item>
          <el-form-item label="端口" prop="port">
            <el-input v-model="layoutStore.linkEmbyConfigForm.port" placeholder="请输入端口号，Emby默认8096" />
          </el-form-item>
          <el-form-item label="用户名" prop="Username">
            <el-input v-model="layoutStore.linkEmbyConfigForm.Username" placeholder="请输入Emby用户名" />
          </el-form-item>
          <el-form-item label="密码" prop="Pw">
            <el-input v-model="layoutStore.linkEmbyConfigForm.Pw" placeholder="请输入Emby密码" show-password />
          </el-form-item>

          <el-button type="primary" @click="connectToEmby" class="connect-btn">
            {{ layoutStore.linkEmbyStatus ? '重新连接' : '连接服务器' }}
          </el-button>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="TMDB代理设置" name="2">
        <div class="proxy-form">
          <el-alert
            title="仅影响后端访问 TMDB API 与图片代理。示例：http://127.0.0.1:7890 或 socks5://127.0.0.1:7890"
            type="info"
            class="mb-12"
          />
          <el-input
            v-model="layoutStore.tmdbProxy"
            placeholder="输入代理地址，例如 http://127.0.0.1:7890 或 socks5://127.0.0.1:7890"
            clearable
          />
          <el-button type="primary" class="connect-btn" @click="setTmdbProxy"> 设 置 </el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'

const layoutStore = useLayoutStore()
const homeStore = useHomeStore()

// ref
const linkEmbyConfigFormRef = useTemplateRef<FormInstance>('linkEmbyConfigFormRef')

// dialog开关
const visible = ref(false)
const active = ref('1')

// 连接emby
const connectToEmby = async () => {
  await linkEmbyConfigFormRef.value?.validate()
  const code = await layoutStore.connectToEmby()
  if (code === 200) {
    homeStore.getEmbyAllInfo()
    cancel()
  }
}

// 取消
const cancel = () => {
  visible.value = false
  linkEmbyConfigFormRef.value?.resetFields()
  layoutStore.tmdbProxy = ''
}

// 设置tmdb代理
const setTmdbProxy = async () => {
  const code = await layoutStore.saveProxy()
  if (code === 200) {
    ElMessage.success('代理配置已保存')
    cancel()
  }
}

const rules = ref<FormRules>({
  protocol: [{ required: true, message: '请选择协议', trigger: 'blur' }],
  ip: [{ required: true, message: '请输入服务器地址', trigger: 'blur' }],
  port: [{ required: true, message: '请输入端口号', trigger: 'blur' }],
  apiKey: [{ required: true, message: '请输入 API Token', trigger: 'blur' }],
  Username: [{ required: true, message: '请输入Emby用户名', trigger: 'blur' }],
  Pw: [{ required: true, message: '请输入Emby密码', trigger: 'blur' }]
})

const showDialog = () => {
  const embyConfigInfo = localStorage.getItem('embyConfigInfo')
  const tmdbProxy = localStorage.getItem('tmdbProxy')
  if (embyConfigInfo) {
    layoutStore.linkEmbyConfigForm = JSON.parse(embyConfigInfo)
  }
  if (tmdbProxy) {
    layoutStore.tmdbProxy = tmdbProxy
  }
  visible.value = true
}

onMounted(async () => {
  const embyConfigInfo = localStorage.getItem('embyConfigInfo')
  const tmdbProxy = localStorage.getItem('tmdbProxy')
  if (embyConfigInfo) {
    layoutStore.linkEmbyConfigForm = JSON.parse(embyConfigInfo)
    await layoutStore.connectToEmby()
    await homeStore.getEmbyAllInfo()
  } else {
    visible.value = true
  }

  if (tmdbProxy) {
    layoutStore.tmdbProxy = tmdbProxy
    await layoutStore.saveProxy()
  }
})

defineExpose({ showDialog })
</script>

<style scoped lang="scss">
.connect-btn {
  width: 100%;
  margin-top: 1rem;
}
.proxy-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.mb-12 {
  margin-bottom: 12px;
}
</style>
