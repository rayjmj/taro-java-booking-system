// 表单验证
export const validator = {
  // 必填字段
  required: (value: string, message: string = '该字段为必填项') => {
    if (!value || value.trim() === '') {
      return message
    }
    return ''
  },
  
  // 手机号验证
  phone: (value: string) => {
    const phoneRegex = /^1[3-9]\d{9}$/
    if (!phoneRegex.test(value)) {
      return '手机号格式不正确'
    }
    return ''
  },
  
  // 日期验证
  date: (value: string) => {
    if (!value) {
      return '请选择日期'
    }
    
    const selectedDate = new Date(value)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (selectedDate < today) {
      return '不能选择过去的日期'
    }
    
    return ''
  },
  
  // 验证所有字段
  validateForm: (fields: Record<string, { value: any; rules: Array<Function> }>) => {
    const errors: Record<string, string> = {}
    
    for (const [fieldName, field] of Object.entries(fields)) {
      for (const rule of field.rules) {
        const error = rule(field.value)
        if (error) {
          errors[fieldName] = error
          break
        }
      }
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  }
}