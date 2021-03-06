import Vue from 'vue'

import { isBlank, formatDate, formatTime, formatDateTime, cent2Yuan, thousands, money2Chinese } from '@/utils/util'

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
  return isBlank(value) ? '' : cent2Yuan(value)
})
Vue.filter('thousands', (value) => {
  return isBlank(value) ? '' : thousands(value)
})
Vue.filter('cent2YuanAndThousands', (value) => {
  return isBlank(value) ? '' : thousands(cent2Yuan(value))
})
Vue.filter('money2Chinese', (value) => {
  return isBlank(value) ? '' : money2Chinese(value)
})
