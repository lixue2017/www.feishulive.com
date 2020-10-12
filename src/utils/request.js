import axios from 'axios'
import qs from 'qs'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    if (config.method === 'post') {
      config.data = Object.assign({apipkg: "live_h5",appVersion: "1.0",channel: "live_h5",osName: "h5"}, config.data)
      config.data = qs.stringify(config.data);
    }else{
      config.params = Object.assign({apipkg: "live_h5",appVersion: "1.0",channel: "live_h5",osName: "h5"}, config.params)
    }
    if (store.getters.token) {
      config.headers['token'] = getToken()    
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data
    if(res.code != '200'){    
      store.commit('showMessage', {
        message: res.message || 'Error',
        type: 'error'
      })
      if(res.code == '10086' || res.code == "1008611") {
        store.dispatch('user/logout')
      }
      return Promise.reject(new Error(res.message || 'Error'))
    }
    return res.data
  },
  error => {
    store.commit('showMessage', {
      message: error.message,
      type: 'error'
    })
    return Promise.reject(error)
  }
)

class http {
  static async get(url, params) {
    return await service.get(url, {params})
  }
  static async post(url, params) {
    return await service.post(url, params);
  }
}

export default http