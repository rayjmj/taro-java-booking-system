import React, { useEffect, useState } from 'react'
import { View, Text, Button, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { storageService } from '@/services/api'
import { logout } from '@/utils/auth'
import './index.scss'

const HomePage: React.FC = () => {
  const [userInfo, setUserInfo] = useState<any>(null)

  useEffect(() => {
    // 检查登录状态
    if (!storageService.isLoggedIn()) {
      Taro.reLaunch({ url: '/pages/login/index' })
      return
    }
    
    const info = storageService.getUserInfo()
    setUserInfo(info.userInfo)
  }, [])

  const handleNavigate = (url: string) => {
    Taro.switchTab({ url })
  }

  const handleLogout = () => {
    Taro.showModal({
      title: '退出登录',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          logout()
        }
      }
    })
  }

  return (
    <View className="home-container">
      {/* 用户信息区域 */}
      <View className="user-card">
        <Image
          className="avatar"
          src="https://img.icons8.com/ios-filled/100/000000/user-male-circle.png"
        />
        <View className="user-info">
          <Text className="nickname">{userInfo?.nickname || '用户'}</Text>
          <Text className="phone">{userInfo?.phone || ''}</Text>
        </View>
        <Button className="logout-btn" onClick={handleLogout}>
          退出
        </Button>
      </View>

      {/* 功能入口 */}
      <View className="function-grid">
        <View className="function-item" onClick={() => handleNavigate('/pages/create-booking/index')}>
          <View className="function-icon create">
            <Text className="icon-text">+</Text>
          </View>
          <Text className="function-title">新建预约</Text>
          <Text className="function-desc">创建新的服务预约</Text>
        </View>
        
        <View className="function-item" onClick={() => handleNavigate('/pages/my-bookings/index')}>
          <View className="function-icon list">
            <Text className="icon-text">📋</Text>
          </View>
          <Text className="function-title">我的预约</Text>
          <Text className="function-desc">查看和管理预约</Text>
        </View>
      </View>

      {/* 提示信息 */}
      <View className="tips">
        <Text className="tips-title">使用说明：</Text>
        <View className="tips-list">
          <Text className="tip-item">1. 点击"新建预约"创建新的服务预约</Text>
          <Text className="tip-item">2. 填写服务名称、选择日期和时间段</Text>
          <Text className="tip-item">3. 在"我的预约"中查看和管理所有预约</Text>
          <Text className="tip-item">4. 同一时间段不能重复预约相同服务</Text>
        </View>
      </View>
    </View>
  )
}

export default HomePage