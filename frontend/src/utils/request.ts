import axios, { type AxiosError } from 'axios'
import { ElMessage } from 'element-plus'

// 访问nodejs的接口
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 60000
})

request.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code === 500) {
      ElMessage.error(res.message)
    }
    return response
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

export { request }
