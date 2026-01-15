// API 配置
export const API_BASE_URL = 'http://localhost:8080/api'

// 接口路径
export const API_PATHS = {
  LOGIN: '/auth/login',
  CREATE_BOOKING: '/bookings',
  MY_BOOKINGS: '/bookings/my'
}

// 错误码
export const ERROR_CODES = {
  UNAUTHORIZED: 401,
  BAD_REQUEST: 400,
  INTERNAL_SERVER_ERROR: 500
}

// 默认请求配置
export const DEFAULT_REQUEST_CONFIG = {
  timeout: 10000,
  header: {
    'Content-Type': 'application/json'
  }
}