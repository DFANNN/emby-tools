import axios from 'axios'

// 访问nodejs的接口
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 60000
})

export { request }
