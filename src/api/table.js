import request from '@/utils/request'

const getList = (params) => {
  return request({
    url: '/table/list',
    method: 'get',
    params
  })
}

export { getList }
