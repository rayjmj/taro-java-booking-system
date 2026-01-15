import React, { useState } from 'react'
import { View, Input, Button, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { authApi, storageService } from '@/services/api'
import { validatePhone } from '@/utils/auth'
import { FIXED_VERIFICATION_CODE } from '@/config/const'
import './index.scss'

const LoginPage: React.FC = () => {
  const [phone, setPhone] = useState('')
  const [verificationCode, setVerificationCode] = useState(FIXED_VERIFICATION_CODE)
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    // 验证手机号
    if (!phone) {
      Taro.showToast({
        title: '请输入手机号',
        icon: 'none'
      })
      return
    }

    if (!validatePhone(phone)) {
      Taro.showToast({
        title: '手机号格式不正确',
        icon: 'none'
      })
      return
    }

    // 验证验证码
    if (!verificationCode) {
      Taro.showToast({
        title: '请输入验证码',
        icon: 'none'
      })
      return
    }

    setLoading(true)
    try {
      const response = await authApi.login(phone, verificationCode)
      
      // 保存用户信息
      storageService.saveUserInfo(response.token, response.user)
      
      Taro.showToast({
        title: '登录成功',
        icon: 'success'
      })
      
      // 跳转到首页
      setTimeout(() => {
        Taro.reLaunch({ url: '/pages/home/index' })
      }, 1000)
    } catch (error: any) {
      Taro.showToast({
        title: error.message || '登录失败',
        icon: 'none'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = () => {
    setPhone('13800138000')
    setVerificationCode(FIXED_VERIFICATION_CODE)
  }

  return (
    <View className="login-container">
      <View className="header">
        <Text className="title">预约系统</Text>
        <Text className="subtitle">简单快捷的预约服务</Text>
      </View>
      
      <View className="form">
        <View className="form-group">
          <Text className="label">手机号</Text>
          <Input
            className="input"
            type="number"
            placeholder="请输入手机号"
            value={phone}
            onInput={(e) => setPhone(e.detail.value)}
            maxlength={11}
          />
        </View>
        
        <View className="form-group">
          <Text className="label">验证码</Text>
          <Input
            className="input"
            type="text"
            placeholder="请输入验证码"
            value={verificationCode}
            onInput={(e) => setVerificationCode(e.detail.value)}
          />
          <Text className="hint">演示验证码: {FIXED_VERIFICATION_CODE}</Text>
        </View>
        
        <Button
          className={`login-btn ${loading ? 'disabled' : ''}`}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? '登录中...' : '登录'}
        </Button>
        
        <View className="demo-section">
          <Text className="demo-text">演示账号：</Text>
          <Button className="demo-btn" onClick={handleDemoLogin}>
            一键填充演示账号
          </Button>
        </View>
      </View>
      
      <View className="footer">
        <Text className="footer-text">© 2026 预约系统演示版</Text>
      </View>
    </View>
  )
}

export default LoginPage