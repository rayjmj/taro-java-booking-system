import React, { useEffect } from 'react'
import { Provider } from 'react-redux'
import Taro from '@tarojs/taro'
import { storageService } from './services/api'
import './app.scss'

// 应用配置
const App = (props) => {
  useEffect(() => {
    // 初始化检查
    const init = () => {
      // 检查登录状态
      const isLoggedIn = storageService.isLoggedIn()
      const currentPage = Taro.getCurrentPages()
      
      // 如果未登录且不在登录页，跳转到登录页
      if (!isLoggedIn && (!currentPage.length || !currentPage[0].route.includes('login'))) {
        setTimeout(() => {
          Taro.reLaunch({ url: '/pages/login/index' })
        }, 100)
      }
      
      // 如果已登录且在登录页，跳转到首页
      if (isLoggedIn && currentPage.length && currentPage[0].route.includes('login')) {
        setTimeout(() => {
          Taro.reLaunch({ url: '/pages/home/index' })
        }, 100)
      }
    }
    
    init()
  }, [])

  return props.children
}

export default App