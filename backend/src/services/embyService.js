import axios from 'axios'
import embyStore from '../store/embyStore.js'

// emby登录获取用户信息接口
export function embyUserInfo(data) {
  const url = `${embyStore.url}/Users/AuthenticateByName`
  return axios.post(url, data, {
    headers: {
      'X-Emby-Client': 'emby-tools',
      'X-Emby-Device-Name': 'browser',
      'X-Emby-Device-Id': 'emby-tools-web',
      'X-Emby-Client-Version': '1.0.0'
    }
  })
}

// emby获取媒体库概览（统计电影、剧集、音乐数量）
export function embyMediaCount() {
  const url = `${embyStore.url}/Items/Counts?userId=${embyStore.user.Id}`
  return axios.get(url, {
    headers: {
      'X-Emby-Token': embyStore.accessToken
    }
  })
}

// emby获取最近添加
export function embyLatestAdd() {
  const url = `${embyStore.url}/Users/${embyStore.user.Id}/Items?IncludeItemTypes=Episode,Movie,Audio&SortBy=DateCreated&Recursive=true&Limit=10&SortOrder=Descending&Fields=DateCreated,DateLastMediaAdded`
  console.log('url', url)
  return axios.get(url, {
    headers: {
      'X-Emby-Token': embyStore.accessToken
    }
  })
}

/**
 * emby获取存储占用空间
 * type: Movie（电影）、Episode（剧集分集）、Audio（音乐）
 * */
export function embyStorage(type) {
  const url = `${embyStore.url}/Items?IncludeItemTypes=${type}&Recursive=true&Fields=Size`
  return axios.get(url, {
    headers: {
      'X-Emby-Token': embyStore.accessToken
    }
  })
}

/**
 * emby获取播放时间
 * @param {*} type 类型：Movie（电影）、Episode（剧集分集）、Audio（音乐）
 */
export function embyPlayTime(type) {
  const url = `${embyStore.url}/Users/${embyStore.user.Id}/Items?IncludeItemTypes=${type}&Recursive=true&Fields=RunTimeTicks,UserData,DateLastPlayed&Limit`
  return axios.get(url, {
    headers: {
      'X-Emby-Token': embyStore.accessToken
    }
  })
}
