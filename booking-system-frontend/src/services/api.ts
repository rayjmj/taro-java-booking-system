import { request } from './request'
import { API_PATHS } from '@/config/api'
import Taro from '@tarojs/taro'
import { simpleRequest } from './simpleRequest'

// 认证接口
export const authApi = {
  // 登录
  login: async (phone: string, verificationCode: string) => {
    return request.post<{
      token: string
      user: {
        id: number
        phone: string
        nickname: string
      }
    }>(API_PATHS.LOGIN, {
      phone,
      verificationCode
    })
  }
}

// 预约接口
export const bookingApi = {
  // 创建预约
  createBooking: async (data: any) => {
    return simpleRequest.post('/bookings', data)
  },
  
  // 获取我的预约列表
  getMyBookings: async () => {
    return request.get<Array<{
      id: number
      serviceName: string
      bookingDate: string
      timeSlot: string
      createdAt: string
    }>>(API_PATHS.MY_BOOKINGS)
  }
}

// 存储服务
export const storageService = {
  // 保存用户信息
  saveUserInfo: (token: string, userInfo: any) => {
    Taro.setStorageSync('token', token)
    Taro.setStorageSync('userInfo', userInfo)
  },
  
  // 获取用户信息
  getUserInfo: () => {
    return {
      token: Taro.getStorageSync('token'),
      userInfo: Taro.getStorageSync('userInfo')
    }
  },
  
  // 清除用户信息
  clearUserInfo: () => {
    Taro.removeStorageSync('token')
    Taro.removeStorageSync('userInfo')
  },
  
  // 检查是否登录
  isLoggedIn: () => {
    const token = Taro.getStorageSync('token')
    return !!token
  }
}