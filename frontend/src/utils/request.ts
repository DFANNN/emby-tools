import axios from 'axios'

// 访问nodejs的接口
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000
})

/**
 * 访问emby的接口
 */
const embyRequest = axios.create({
  baseURL: localStorage.getItem('emby_url') || '',
  timeout: 10000,
  headers: {
    'X-Emby-Token': localStorage.getItem('emby_token') || ''
  }
})

// 设置emby的url
const setEmbyUrl = (url: string, token: string) => {
  localStorage.setItem('emby_url', url)
  localStorage.setItem('emby_token', token)
  embyRequest.defaults.baseURL = url
  embyRequest.defaults.headers['X-Emby-Token'] = token

  console.log(embyRequest.defaults.baseURL, embyRequest.defaults.headers['X-Emby-Token'])
}

export { request, embyRequest, setEmbyUrl }
