export default {
  pages: [
    'pages/login/index',
    'pages/home/index',
    'pages/create-booking/index',
    'pages/my-bookings/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#1890ff',
    navigationBarTitleText: '预约系统',
    navigationBarTextStyle: 'white'
  },
  tabBar: {
    color: '#7A7E83',
    selectedColor: '#1890ff',
    backgroundColor: '#ffffff',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页',
        // 使用系统图标或空字符串
        iconPath: '',
        selectedIconPath: ''
      },
      {
        pagePath: 'pages/create-booking/index',
        text: '预约',
        iconPath: '',
        selectedIconPath: ''
      },
      {
        pagePath: 'pages/my-bookings/index',
        text: '我的',
        iconPath: '',
        selectedIconPath: ''
      }
    ]
  }
}