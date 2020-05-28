import Vue from 'vue'

import { isBlank, isNotBlank, isTrue, isNotTrue, formatDate, formatTime, formatDateTime, cent2Yuan, thousands } from '@/utils/util'

Vue.filter('isBlank', (value) => {
  return isBlank(value)
})
Vue.filter('isNotBlank', (value) => {
  return isNotBlank(value)
})

Vue.filter('isTrue', (value) => {
  return isTrue(value)
})
Vue.filter('isNotTrue', (value) => {
  return isNotTrue(value)
})

Vue.filter('formatDate', (value) => {
  return isBlank(value) ? '' : formatDate(value)
})
Vue.filter('formatTime', (value) => {
  return isBlank(value) ? '' : formatTime(value)
})
Vue.filter('formatDateTime', (value) => {
  return isBlank(value) ? '' : formatDateTime(value)
})

Vue.filter('cent2Yuan', (value) => {
  return cent2Yuan(value)
})
Vue.filter('thousands', (value) => {
  return thousands(value)
})
Vue.filter('cent2YuanAndFormatThousand', (value) => {
  return thousands(cent2Yuan(value))
})
