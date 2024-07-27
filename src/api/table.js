import request from '@/utils/request'

// params 是 { name: 'xxx', sex: 1 } 格式的对象
const getList = (params) => {
  return request({
    url: '/table/list',
    method: 'get',
    // data: params,
    params: params,
  })
}

export { getList }

// params 将会把数据拼在 url 的后面(k1=v1&k2=v2), data 则会使用 RequestBody 的方式进行请求
