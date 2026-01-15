import Taro from '@tarojs/taro'

// 检查登录状态
export const checkLogin = (): boolean => {
  const token = Taro.getStorageSync('token')
  if (!token) {
    Taro.showToast({
      title: '请先登录',
      icon: 'none'
    })
    Taro.reLaunch({ url: '/pages/login/index' })
    return false
  }
  return true
}

// 验证手机号
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^1[3-9]\d{9}$/
  return phoneRegex.test(phone)
}

// 登出
export const logout = () => {
  Taro.removeStorageSync('token')
  Taro.removeStorageSync('userInfo')
  Taro.reLaunch({ url: '/pages/login/index' })
}