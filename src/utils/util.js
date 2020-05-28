/** 为空则返回 true */
const isBlank = (str) => {
  if (str === undefined || str === null) {
    return true
  }
  const tmp = String(str).trim().toLowerCase()
  return tmp === '' || tmp === 'undefined' || tmp === 'null'
}
/** 不为空则返回 true */
const isNotBlank = (str) => {
  return !isBlank(str)
}

/** 参数是 true, 或者是不区分大小写的 true 字符串就返回 true */
const isTrue = (str) => {
  return isNotBlank(str) && (str === true || String(str).trim().toLowerCase() === 'true')
}
/** 参数不是 true 且不是区分大小写的 true 字符串就返回 true */
const isNotTrue = (str) => {
  return !isTrue(str)
}

/** 转换成整数, 失败则转换成 0 */
const toInt = (str) => {
  return isBlank(str) || isNaN(str) ? 0 : parseInt(str, 10)
}
/** 转换成浮点数, 失败则转换成 0 */
const toFloat = (str) => {
  return isBlank(str) || isNaN(str) ? 0 : parseFloat(str)
}
/** 传入的值大于 0 就返回 true */
const greater0 = (str) => {
  return toFloat(str) > 0
}
/** 传入的值小于等于 0 就返回 true */
const less0 = (str) => {
  return toFloat(str) <= 0
}

/** 参数转换为对象. 如 http://abc.xyz.com?id=123&name=tom 返回 { id: '123', name: 'tom' } */
const param2Obj = (url) => {
  const search = String(url).split('?')[1]
  const obj = {}
  if (isNotBlank(search)) {
    search.split('&').forEach(function(e) {
      const arr = e.split('=')
      if (arr.length === 2) {
        obj[arr[0]] = arr[1]
      }
    })
  }
  return obj
}
/** 将对象转换成参数. 如 { id: '123', name: 'tom' } 返回 id=123&name=tom */
const obj2Param = (obj) => {
  if (isNotBlank(obj)) {
    const arr = []
    Object.keys(obj).forEach(function(k) {
      const v = obj[k]
      if (isNotBlank(k) && isNotBlank(v)) {
        arr.push(k + '=' + v)
      }
    })
    return arr.join('&')
  } else {
    return ''
  }
}

/**
 * <pre>
 * 从指定对象(不包括数组)中获取属性, 属性层级以 英文点(.) 隔开
 *
 * 比如有 const data = { p1: 1, p2: { list: [11, 21, 31], size: 10 } }
 * 使用 getData(data, 'p1') 会返回 1
 * 使用 getData(data, 'p2.list') 会返回 [11, 21, 31]
 * 使用 getData(data, 'p10'|'p10.list'|'p2.number') 会返回 null
 *
 * 如果直接使用 data.p10.number 将会抛出类型错误: Uncaught TypeError: Cannot read property 'number' of undefined
 * 使用当前方法获取属性时, 数据没有相应的属性将会返回 null, 当后端的序列化策略将 null 值忽略时此方法就有很大的用处
 *
 * 之前是用 returnData.data.list 获取属性, 现在用 getData(returnData, 'data.list') 即可
 * </pre>
 */
const getData = (data, properties) => {
  if (isBlank(data)) {
    return null
  }
  if (isBlank(properties)) {
    return data
  }

  let tmp = data
  const arr = properties.split('.')
  for (let i in arr) {
    const property = arr[i]
    if (isNotBlank(tmp) && tmp.hasOwnProperty(property)) {
      tmp = tmp[property]
    } else {
      return null
    }
  }
  return tmp
}
/**
 * 将列表中的 undefined 或 null 值去掉后返回, 项是 0、{}、[]、'' 都会保留
 * removeNull(['abc', null, 1, 0, undefined, {}, '', []]) 会返回 ['abc', 1, 0, {}, '', []]
 */
const removeNull = (list) => {
  return Array.isArray(list) ? list.filter((obj) => { return obj !== undefined && obj !== null }) : list
}
/**
 * 使用 const v = x.y || false 时, 期望的是当 x.z 为 undefined 或 null 时将 v 赋值为 false
 * 但是此时会当成 或运算, 所以赋值是有问题的
 * 使用当前方法
 */
const defaultValue = (obj, value) => {
  return isBlank(obj) ? value : obj
}

/** 将字符串中指定位数的值模糊成 * 并返回. 索引位从 0 开始. 如: foggy('13012345678', 3, 7) 返回 130****5678 */
const foggy = (str, start, end) => {
  if (isBlank(str)) {
    return ''
  }
  const s = toInt(start)
  const e = toInt(end)
  if (s < 0 || e < s || e > str.length) {
    return str
  }
  return str.substring(0, s) + str.substring(s, e).replace(/./g, '*') + str.substring(e)
}
/** 是手机号就返回 true */
const checkPhone = (str) => {
  return isNotBlank(str) && /^1[0-9]{10}$/.test(str)
}
/** 是邮件就返回 true */
const checkEmail = (str) => {
  return isNotBlank(str) && /^\w[\w\-]*@([\w\-]+\.\w+)+$/.test(str)
}
/** 是图片后缀就返回 true */
const checkImage = (str) => {
  return isNotBlank(str) && /\.(gif|jpeg|jpg|bmp|png)$/i.test(str)
}
/** 有中文就返回 true */
const checkChinese = (str) => {
  return isNotBlank(str) && /[\u4e00-\u9fa5]/.test(str)
}

/** 使用 base64 编码 */
const base64Encode = (str) => {
  return window.btoa(unescape(encodeURIComponent(str)))
}
/** 使用 base64 解码 */
const base64Decode = (str) => {
  return decodeURIComponent(escape(window.atob(str)))
}
/** 将 url 进行编码 */
const encode = (url) => {
  return isBlank(url) ? '' : encodeURIComponent(url)
}
/** 将 url 进行解码 */
const decode = (url) => {
  return isBlank(url) ? '' : decodeURIComponent(url)
}

/** 在 url 后面拼接 ? 或 & */
const appendUrl = (url) => {
  return isBlank(url) ? '' : url + (url.includes('?') ? '&' : '?')
}
/** 在 path 前面加 / 返回 */
const addPrefix = (path) => {
  if (isBlank(path)) {
    return '/'
  }
  if (path.startsWith('/')) {
    return path
  }
  return '/' + path
}
/** 在 path 后面加 / 返回 */
const addSuffix = (path) => {
  if (isBlank(path)) {
    return '/'
  }
  if (path.endsWith('/')) {
    return path
  }
  return path + '/'
}
/** 返回文件后缀. 如 id.png 返回 .png */
const getSuffix = (fileName) => {
  return isNotBlank(fileName) && fileName.includes('.') ? fileName.substring(fileName.lastIndexOf('.')) : ''
}
/** 生成 uuid */
const uuid = () => {
  let now = new Date().getTime()
  return 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (now + Math.random() * 16) % 16 | 0
    now = Math.floor(now / 16)
    return (c === 'x' ? r : (r & 0x7) | 0x8).toString(16)
  })
}

/** 转义 */
const escapeHtml = (html) => {
  if (isBlank(html)) {
    return null
  } else {
    return html
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
  }
}
/** 反转义 */
const unescapeHtml = (html) => {
  if (isBlank(html)) {
    return null
  } else {
    return html
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, "'")
      .replace(/&#039;/g, "'")
  }
}
/** 用两个空格来格式化 json */
const formatJson = (json) => {
  if (isBlank(json)) {
    return ''
  }
  try {
    return JSON.stringify(JSON.parse(json), null, '  ')
  } catch (e) {
    return json
  }
}

/** 补全, 默认是不足 2 位就在前面补 0, 如 completionString(3) ==> 03, completionString(8, 3) ==> 008 */
const completionString = (str, len, completion) => {
  if (isBlank(str)) {
    return ''
  }

  if (isBlank(len)) {
    len = 2
  }
  const s = String(str)
  if (s.length >= len) {
    return s
  }

  if (isBlank(completion)) {
    completion = '0'
  }
  let r = ''
  const loop = len - s.length
  for (let i = 0; i < loop; i++) {
    r += completion
  }
  return r + s
}
/** 将毫秒格式化为可读性更强的, 如: 刚刚、3 分钟前、5 小时后、昨天、前天、明天、后天、10 天前、200 天后、2 年前 */
const msToHuman = (ms) => {
  if (ms === 0) { return '刚刚' }

  const flag = (ms < 0)
  const absMs = flag ? -ms : ms

  const second = Math.floor(absMs / 1000)
  if (second < 60) { return '刚刚' }

  const state = flag ? '后' : '前'
  const minute = Math.floor(second / 60)
  if (minute < 60) { return minute + ' 分钟' + state }

  const hour = Math.floor(minute / 60)
  if (hour < 24) { return hour + ' 小时' + state }

  const day = Math.floor(hour / 24)
  if (day === 1) { return flag ? '明天' : '昨天' }
  if (day === 2) { return flag ? '后天' : '前天' }
  if (day < 365) { return day + ' 天' + state }

  return Math.floor(day / 365) + ' 年' + state
}
/** 格式化 时间 或 时间戳 成 年-月-日 时:分:秒 毫秒, 无参数则默认返回当前时间, 格式: yyyy-MM-dd HH:mm:ss SSS aaa */
const formatDateTimeMs = (date, format) => {
  let datetime
  if (date instanceof Date) {
    datetime = date
  } else if (typeof datetime === 'number') {
    datetime = new Date(date)
  } else {
    datetime = new Date()
  }

  if (isBlank(format)) {
    format = 'yyyy-MM-dd HH:mm:ss SSS'
  }
  const year = datetime.getFullYear(),
    month = datetime.getMonth(),
    day = datetime.getDate(),
    hour = datetime.getHours(),
    minute = datetime.getMinutes(),
    second = datetime.getSeconds(),
    milliSecond = datetime.getMilliseconds(),

    yyyy = String(year),
    yy = yyyy.substr(2, 2),
    M = String(month + 1),
    MM = completionString(month + 1),
    dd = completionString(day),
    h = String(hour % 12),
    hh = completionString(h),
    HH = completionString(hour),
    mm = completionString(minute),
    ss = completionString(second),
    aaa = hour < 12 ? 'AM' : 'PM'

  // 补全毫秒, 不足 3 位的在前面补 0
  const ms = completionString(milliSecond, 3)

  return format.trim()
    .replace('yyyy', yyyy).replace('YYYY', yyyy).replace('yy', yy).replace('YY', yy).replace('y', yy).replace('Y', yy)
    .replace('MM', MM).replace('M', M)
    .replace('dd', dd).replace('DD', dd).replace('D', dd).replace('d', String(day))

    .replace('hh', hh).replace('HH', HH).replace('h', h).replace('H', String(hour))
    .replace('mm', mm).replace('MI', mm).replace('mi', mm).replace('m', String(minute))
    .replace('ss', ss).replace('s', String(second))

    .replace('SSS', String(ms)).replace('aaa', aaa).replace('a', aaa)
}
/** 格式化 时间 或 时间戳 成: 年-月-日 */
const formatDate = (date) => {
  return formatDateTimeMs(date, 'yyyy-MM-dd')
}
/** 格式化 时间 或 时间戳 成: 时:分:秒 */
const formatTime = (date) => {
  return formatDateTimeMs(date, 'HH:mm:ss')
}
/** 格式化 时间 或 时间戳 成: 年-月-日 时:分:秒 */
const formatDateTime = (date) => {
  return formatDateTimeMs(date, 'yyyy-MM-dd HH:mm:ss')
}


/** 分显示成元 */
const cent2Yuan = (cent) => {
  if (isBlank(cent)) {
    return ''
  }

  let money
  const v = (typeof cent)
  if (v === 'number') {
    money = String(cent)
  } else if (v === 'string') {
    money = String(Number.parseInt(cent))
  } else {
    return ''
  }
  const len = money.length
  return (len < 2) ? ('0.' + money) : (money.substring(0, len - 2) + '.' + money.substring(len - 2))
}
/** 将数字转换成千分位, 如 12345678.123 返回 12,345,678.123 */
const thousands = (num) => {
  if (isBlank(num)) {
    return ''
  }
  if (isNaN(num)) {
    return num
  }

  const number = String(num)
  let first, second
  const pointIndex = number.indexOf('.')
  if (pointIndex >= 0) {
    first = number.substring(0, pointIndex)
    second = number.substring(pointIndex)
  } else {
    first = number
    second = ''
  }
  return first.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') + second
}
/**
 * 按下了回车键则返回 true, 用在 keydown 事件上, 如
 *
 * $('...').keydown(function(e) {
 *     const enter = hasEnter(e)
 *     if (enter) {
 *         // do something
 *     }
 * }
 */
const hasEnter = (event) => {
  if (event.defaultPrevented) {
    return
  }

  let handled
  if (event.key !== undefined) {
    handled = event.key.toUpperCase() === 'ENTER'
  } else if (event.keyIdentifier !== undefined) {
    handled = event.keyIdentifier.toUpperCase() === 'ENTER'
  } else if (event.keyCode !== undefined) {
    handled = event.keyCode === 13 || event.keyCode === '13'
  } else {
    handled = false
  }
  if (handled) {
    event.preventDefault()
  }
  return handled
}

export { isBlank, isNotBlank, isTrue, isNotTrue }
export { toInt, toFloat, greater0, less0 }
export { param2Obj, obj2Param, getData, removeNull, defaultValue }
export { foggy, checkPhone, checkEmail, checkImage, checkChinese }
export { base64Encode, base64Decode, encode, decode }
export { appendUrl, addPrefix, addSuffix, getSuffix, uuid }
export { escapeHtml, unescapeHtml, formatJson }
export { completionString, msToHuman, formatDateTimeMs, formatDate, formatTime, formatDateTime }
export { cent2Yuan, thousands, hasEnter }
