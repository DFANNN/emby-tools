<template>
  <div class="left-container">
    <div class="emby-warp">
      <el-form label-width="auto" :model="linkEmbyForm">
        <el-form-item label="服务器地址" label-position="left">
          <el-input v-model="linkEmbyForm.ip" />
        </el-form-item>
        <el-form-item label="端口" label-position="left">
          <el-input v-model="linkEmbyForm.port" />
        </el-form-item>
        <el-form-item label="Token" label-position="left">
          <el-input v-model="linkEmbyForm.token" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="link-button" @click="linkEmbyHandler">连接</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="rule-warp">
      <div class="rule-warp-title">生成规程</div>
      <div>
        <el-form label-width="auto" :model="posterRuleForm">
          <el-form-item label="媒体库" label-position="left">
            <el-select v-model="posterRuleForm.a" multiple placeholder="Select">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="样式" label-position="left">
            <el-radio-group v-model="posterRuleForm.b">
              <el-radio-button label="样式一" value="New York" />
              <el-radio-button label="样式二" value="Washington" />
              <el-radio-button label="样式三" value="Los Angeles" />
            </el-radio-group>
          </el-form-item>
          <el-form-item label="规则" label-position="left">
            <el-radio-group v-model="posterRuleForm.c">
              <el-radio :value="3">默认</el-radio>
              <el-radio :value="6">自定义</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="link-button">生成预览</el-button>
            <el-button type="primary" class="link-button">替换媒体库图片</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { linkEmby } from '@/api/embyPoster'
const linkEmbyForm = ref({
  ip: '',
  port: '',
  token: ''
})

const posterRuleForm = ref({
  a: '',
  b: '',
  c: ''
})

const options = [
  {
    value: 'Option1',
    label: 'Option1'
  },
  {
    value: 'Option2',
    label: 'Option2'
  },
  {
    value: 'Option3',
    label: 'Option3'
  },
  {
    value: 'Option4',
    label: 'Option4'
  },
  {
    value: 'Option5',
    label: 'Option5'
  }
]

const linkEmbyHandler = async () => {
  const data = await linkEmby(linkEmbyForm.value)
}

onMounted(() => {
  console.log(import.meta.env)
})
</script>

<style scoped lang="scss">
.left-container {
  padding: 20px;
  .emby-warp {
    .link-button {
      width: 100%;
    }
  }
  .rule-warp {
    .rule-warp-title {
      font-size: 18px;
      margin-bottom: 20px;
    }
  }
}
</style>
