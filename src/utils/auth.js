import Cookies from 'js-cookie'

const TokenKey = document.location.host

const getToken = () => {
  return Cookies.get(TokenKey)
}
const setToken = (token) => {
  return Cookies.set(TokenKey, token)
}
const removeToken = () => {
  return Cookies.remove(TokenKey)
}

const getLocalData = () => {
  return JSON.parse(localStorage.getItem(TokenKey))
}
const setLocalData = (data) => {
  return localStorage.setItem(TokenKey, JSON.stringify(data))
}
const removeLocalData = () => {
  return localStorage.removeItem(TokenKey)
}

export { getToken, setToken, removeToken, getLocalData, setLocalData, removeLocalData }
