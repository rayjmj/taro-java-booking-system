import React, { useState, useEffect } from 'react'
import { View, Input, Button, Text, Picker } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { bookingApi, storageService } from '@/services/api'
import { checkLogin } from '@/utils/auth'
import { validator } from '@/utils/validator'
import { TIME_SLOTS } from '@/config/const'
import dayjs from 'dayjs'
import './index.scss'

const CreateBookingPage: React.FC = () => {
  const [serviceName, setServiceName] = useState('')
  const [bookingDate, setBookingDate] = useState('')
  const [timeSlot, setTimeSlot] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    // 检查登录状态
    if (!checkLogin()) return
    
    // 设置默认日期（明天）
    const tomorrow = dayjs().add(1, 'day').format('YYYY-MM-DD')
    setBookingDate(tomorrow)
    
    // 设置默认时间段
    if (TIME_SLOTS.length > 0) {
      setTimeSlot(TIME_SLOTS[0].value)
    }
  }, [])

  const handleDateChange = (e: any) => {
    setBookingDate(e.detail.value)
    // 清除对应错误
    if (errors.bookingDate) {
      setErrors({ ...errors, bookingDate: '' })
    }
  }

  const handleTimeSlotChange = (e: any) => {
    setTimeSlot(TIME_SLOTS[e.detail.value].value)
    // 清除对应错误
    if (errors.timeSlot) {
      setErrors({ ...errors, timeSlot: '' })
    }
  }

  const validateForm = (): boolean => {
    const validationResult = validator.validateForm({
      serviceName: {
        value: serviceName,
        rules: [(v: string) => validator.required(v, '请填写服务名称')]
      },
      bookingDate: {
        value: bookingDate,
        rules: [
          (v: string) => validator.required(v, '请选择日期'),
          (v: string) => validator.date(v)
        ]
      },
      timeSlot: {
        value: timeSlot,
        rules: [(v: string) => validator.required(v, '请选择时间段')]
      }
    })
    
    if (!validationResult.isValid) {
      setErrors(validationResult.errors)
      return false
    }
    
    setErrors({})
    return true
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setLoading(true)
    try {
      // 生成幂等性key
      const idempotentKey = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      await bookingApi.createBooking({
        serviceName: serviceName.trim(),
        bookingDate,
        timeSlot,
        idempotentKey
      })

      Taro.showToast({
        title: '预约创建成功！',
        icon: 'success'
      })

      // 延迟跳转到我的预约页面
      setTimeout(() => {
        Taro.switchTab({ url: '/pages/my-bookings/index' })
      }, 1500)
    } catch (error: any) {
      Taro.showToast({
        title: error.message || '创建失败',
        icon: 'none'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleQuickFill = (service: string) => {
    setServiceName(service)
    if (errors.serviceName) {
      setErrors({ ...errors, serviceName: '' })
    }
  }

  // 获取时间选择器显示值
  const getTimeSlotDisplay = () => {
    const slot = TIME_SLOTS.find(item => item.value === timeSlot)
    return slot ? slot.label : '请选择时间段'
  }

  return (
    <View className="create-booking-container">
      <View className="header">
        <Text className="title">创建新预约</Text>
        <Text className="subtitle">填写预约信息</Text>
      </View>

      <View className="form">
        {/* 服务名称 */}
        <View className="form-group">
          <Text className="label">
            服务名称 <Text className="required">*</Text>
          </Text>
          <Input
            className={`input ${errors.serviceName ? 'error' : ''}`}
            placeholder="请输入服务名称"
            value={serviceName}
            onInput={(e) => {
              setServiceName(e.detail.value)
              if (errors.serviceName) {
                setErrors({ ...errors, serviceName: '' })
              }
            }}
          />
          {errors.serviceName && (
            <Text className="error-text">{errors.serviceName}</Text>
          )}
        </View>

        {/* 日期选择 */}
        <View className="form-group">
          <Text className="label">
            预约日期 <Text className="required">*</Text>
          </Text>
          <Picker
            mode="date"
            value={bookingDate}
            start={dayjs().format('YYYY-MM-DD')}
            onChange={handleDateChange}
          >
            <View className={`picker ${errors.bookingDate ? 'error' : ''}`}>
              <Text className={bookingDate ? '' : 'placeholder'}>
                {bookingDate || '请选择日期'}
              </Text>
            </View>
          </Picker>
          {errors.bookingDate && (
            <Text className="error-text">{errors.bookingDate}</Text>
          )}
        </View>

        {/* 时间段选择 */}
        <View className="form-group">
          <Text className="label">
            时间段 <Text className="required">*</Text>
          </Text>
          <Picker
            mode="selector"
            range={TIME_SLOTS.map(item => item.label)}
            value={TIME_SLOTS.findIndex(item => item.value === timeSlot)}
            onChange={handleTimeSlotChange}
          >
            <View className={`picker ${errors.timeSlot ? 'error' : ''}`}>
              <Text className={timeSlot ? '' : 'placeholder'}>
                {getTimeSlotDisplay()}
              </Text>
            </View>
          </Picker>
          {errors.timeSlot && (
            <Text className="error-text">{errors.timeSlot}</Text>
          )}
        </View>

        {/* 快速填充 */}
        <View className="quick-fill">
          <Text className="quick-fill-title">快速选择：</Text>
          <View className="quick-fill-buttons">
            {['理发服务', '美容护理', '健身指导', '编程教学'].map((service) => (
              <Button
                key={service}
                className="quick-fill-btn"
                onClick={() => handleQuickFill(service)}
              >
                {service}
              </Button>
            ))}
          </View>
        </View>

        {/* 提交按钮 */}
        <Button
          className={`submit-btn ${loading ? 'disabled' : ''}`}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? '创建中...' : '创建预约'}
        </Button>

        {/* 提示信息 */}
        <View className="tips">
          <Text className="tip">提示：</Text>
          <Text className="tip">• 同一时间段不能重复预约相同服务</Text>
          <Text className="tip">• 创建后可以在"我的预约"中查看</Text>
          <Text className="tip">• 系统会自动防止重复提交</Text>
        </View>
      </View>
    </View>
  )
}

export default CreateBookingPage