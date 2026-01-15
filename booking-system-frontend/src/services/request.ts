import Taro from '@tarojs/taro'
import { API_BASE_URL, ERROR_CODES } from '@/config/api'

interface RequestOptions {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  data?: any
  header?: Record<string, string>
}

class Request {
  private baseURL: string
  
  constructor(baseURL: string) {
    this.baseURL = baseURL
  }
  
  private async request<T>(options: RequestOptions): Promise<T> {
    const { url, method = 'GET', data, header = {} } = options
    
    // 获取 token
    const token = Taro.getStorageSync('token')
    if (token) {
      header['Authorization'] = `Bearer ${token}`
    }
    
    // 设置 Content-Type
    if (!header['Content-Type']) {
      header['Content-Type'] = 'application/json'
    }
    
    try {
      const response = await Taro.request({
        url: `${this.baseURL}${url}`,
        method,
        data,
        header,
        timeout: 10000
      })
      
      if (response.statusCode >= 200 && response.statusCode < 300) {
        return response.data as T
      } else {
        throw this.handleError(response)
      }
    } catch (error: any) {
      console.error('请求失败:', error)
      throw this.handleError(error)
    }
  }
  
  private handleError(error: any): Error {
    // 处理未授权
    if (error.statusCode === ERROR_CODES.UNAUTHORIZED) {
      Taro.removeStorageSync('token')
      Taro.removeStorageSync('userInfo')
      Taro.showToast({
        title: '登录已过期，请重新登录',
        icon: 'none'
      })
      setTimeout(() => {
        Taro.reLaunch({ url: '/pages/login/index' })
      }, 1500)
      return new Error('登录已过期')
    }
    
    // 处理业务错误
    if (error.data && error.data.message) {
      return new Error(error.data.message)
    }
    
    // 处理网络错误
    if (error.errMsg) {
      return new Error(`网络错误: ${error.errMsg}`)
    }
    
    return new Error('请求失败，请稍后重试')
  }
  
  get<T>(url: string, data?: any): Promise<T> {
    return this.request<T>({ url, method: 'GET', data })
  }
  
  post<T>(url: string, data?: any): Promise<T> {
    return this.request<T>({ url, method: 'POST', data })
  }
}

// 创建请求实例
export const request = new Request('http://localhost:8080/api')