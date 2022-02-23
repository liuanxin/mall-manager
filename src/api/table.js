import request from '@/utils/request'

// params 是 { name: 'xxx', sex: 1 } 格式的对象
const getList = (params) => {
  return request({
    url: '/table/list',
    method: 'get',
    // data: params
    params: params
  })
}

export { getList }

// 如果是 params 将使用表单发送请求, 如果是 data 则会使用 RequestBody 的方式进行请求
// method 如果是 delete 无法使用表单发送请求, 只能使用 RequestBody 或者使用 PathVariable
