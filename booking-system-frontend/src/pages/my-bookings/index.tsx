import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { bookingApi, storageService } from '@/services/api'
import { checkLogin } from '@/utils/auth'
import dayjs from 'dayjs'
import './index.scss'

interface Booking {
  id: number
  serviceName: string
  bookingDate: string
  timeSlot: string
  createdAt: string
}

const MyBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [userInfo, setUserInfo] = useState<any>(null)

  useEffect(() => {
    // 检查登录状态
    if (!checkLogin()) return
    
    // 获取用户信息
    const info = storageService.getUserInfo()
    setUserInfo(info.userInfo)
    
    // 加载预约数据
    handleRefresh()
  }, [])

  const loadBookings = async () => {
    try {
      setLoading(true)
      const data = await bookingApi.getMyBookings()
      setBookings(data)
    } catch (error: any) {
      Taro.showToast({
        title: error.message || '加载失败',
        icon: 'none'
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    loadBookings()
  }

  const handleCreateNew = () => {
    Taro.switchTab({ url: '/pages/create-booking/index' })
  }

  const formatDate = (dateStr: string) => {
    return dayjs(dateStr).format('YYYY-MM-DD')
  }

  const formatDateTime = (dateStr: string) => {
    return dayjs(dateStr).format('MM-DD HH:mm')
  }

  // 判断预约状态
  const getBookingStatus = (bookingDate: string) => {
    const today = dayjs().startOf('day')
    const bookingDay = dayjs(bookingDate).startOf('day')
    
    if (bookingDay.isBefore(today)) {
      return { text: '已过期', className: 'expired' }
    } else if (bookingDay.isSame(today)) {
      return { text: '今天', className: 'today' }
    } else {
      return { text: '待进行', className: 'upcoming' }
    }
  }

  if (loading && !refreshing) {
    return (
      <View className="loading-container">
        <Text>加载中...</Text>
      </View>
    )
  }

  return (
    <View className="my-bookings-container">
      {/* 头部 */}
      <View className="header">
        <Text className="title">我的预约</Text>
        <Text className="subtitle">共 {bookings.length} 个预约</Text>
      </View>

      {/* 刷新和新建按钮 */}
      <View className="actions">
        <Button className="refresh-btn" onClick={handleRefresh} disabled={refreshing}>
          {refreshing ? '刷新中...' : '🔄 刷新'}
        </Button>
        <Button className="create-btn" onClick={handleCreateNew}>
          ➕ 新建预约
        </Button>
      </View>

      {/* 预约列表 */}
      <ScrollView className="booking-list" scrollY>
        {bookings.length === 0 ? (
          <View className="empty-state">
            <Text className="empty-text">暂无预约记录</Text>
            <Button className="empty-btn" onClick={handleCreateNew}>
              去创建第一个预约
            </Button>
          </View>
        ) : (
          bookings.map((booking) => {
            const status = getBookingStatus(booking.bookingDate)
            
            return (
              <View key={booking.id} className="booking-card">
                <View className="booking-header">
                  <Text className="service-name">{booking.serviceName}</Text>
                  <View className={`status-badge ${status.className}`}>
                    <Text className="status-text">{status.text}</Text>
                  </View>
                </View>
                
                <View className="booking-details">
                  <View className="detail-item">
                    <Text className="detail-label">📅 预约日期：</Text>
                    <Text className="detail-value">{formatDate(booking.bookingDate)}</Text>
                  </View>
                  
                  <View className="detail-item">
                    <Text className="detail-label">⏰ 时间段：</Text>
                    <Text className="detail-value">{booking.timeSlot}</Text>
                  </View>
                  
                  <View className="detail-item">
                    <Text className="detail-label">🕒 创建时间：</Text>
                    <Text className="detail-value">{formatDateTime(booking.createdAt)}</Text>
                  </View>
                </View>
                
                <View className="booking-id">
                  <Text className="id-label">预约号：</Text>
                  <Text className="id-value">{booking.id.toString().padStart(6, '0')}</Text>
                </View>
              </View>
            )
          })
        )}
      </ScrollView>

      {/* 用户信息 */}
      <View className="user-info-card">
        <Text className="user-info-title">当前用户</Text>
        <Text className="user-info-item">👤 {userInfo?.nickname}</Text>
        <Text className="user-info-item">📱 {userInfo?.phone}</Text>
        <Text className="user-info-item">📊 预约总数：{bookings.length}</Text>
      </View>
    </View>
  )
}

export default MyBookingsPage