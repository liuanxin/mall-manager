import Vue from 'vue'

import { isBlank, formatDate, formatTime, formatDateTime, centToYuan, toThousands, moneyToChinese } from '@/utils/util'

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
  return isBlank(value) ? '' : centToYuan(value)
})
Vue.filter('thousands', (value) => {
  return isBlank(value) ? '' : toThousands(value)
})
Vue.filter('cent2YuanAndThousands', (value) => {
  return isBlank(value) ? '' : toThousands(centToYuan(value))
})
Vue.filter('money2Chinese', (value) => {
  return isBlank(value) ? '' : moneyToChinese(value)
})
