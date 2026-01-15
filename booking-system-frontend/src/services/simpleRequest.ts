import Taro from '@tarojs/taro'

const API_BASE = 'http://localhost:8080/api'

export const simpleRequest = {
  async post<T = any>(url: string, data: any): Promise<T> {
    // 获取 token
    const token = Taro.getStorageSync('token')
    const header: any = {
      'Content-Type': 'application/json'
    }
    
    if (token) {
      header['Authorization'] = `Bearer ${token}`
    }
    
    try {
      const response = await Taro.request({
        url: `${API_BASE}${url}`,
        method: 'POST',
        data,
        header,
        timeout: 10000
      })
      
      // 如果 HTTP 状态码是 2xx，返回数据
      if (response.statusCode >= 200 && response.statusCode < 300) {
        return response.data as T
      }
      
      // HTTP 错误，提取错误信息
      let errorMessage = '请求失败'
      if (response.data) {
        if (response.data.message) {
          errorMessage = response.data.message
        } else if (response.data.error) {
          errorMessage = response.data.error
        } else if (typeof response.data === 'string') {
          errorMessage = response.data
        }
      }
      
      throw new Error(errorMessage)
      
    } catch (error: any) {
      console.error('请求失败详情:', {
        error,
        message: error.message,
        errMsg: error.errMsg,
        data: error.data
      })
      
      // 如果是已经抛出的 Error，直接重新抛出
      if (error instanceof Error) {
        throw error
      }
      
      // 处理网络错误
      if (error.errMsg) {
        if (error.errMsg.includes('timeout')) {
          throw new Error('请求超时')
        }
        if (error.errMsg.includes('network')) {
          throw new Error('网络连接失败')
        }
        throw new Error(`网络错误: ${error.errMsg}`)
      }
      
      // 未授权
      if (error.statusCode === 401) {
        // 这里只返回错误，不在请求层处理 UI
        throw new Error('登录已过期')
      }
      
      // 默认错误
      throw new Error('请求失败，请稍后重试')
    }
  }
}