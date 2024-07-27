import request from '@/utils/request'

const login = (data) => {
  return request({
    url: '/user/login',
    method: 'post',
    params: data,
  })
}

const getInfo = () => {
  return request({
    url: '/user/info',
    method: 'get',
  })
}

const logout = () => {
  return request({
    url: '/user/logout',
    method: 'get',
  })
}

export { login, getInfo, logout }
