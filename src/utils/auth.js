import Cookies from 'js-cookie'

const token_key = document.location.host

const getToken = () => {
  return Cookies.get(token_key)
}
const setToken = (token) => {
  return Cookies.set(token_key, token)
}
const removeToken = () => {
  return Cookies.remove(token_key)
}

const getLocalData = () => {
  return JSON.parse(localStorage.getItem(token_key))
}
const setLocalData = (data) => {
  return localStorage.setItem(token_key, JSON.stringify(data))
}
const removeLocalData = () => {
  return localStorage.removeItem(token_key)
}

export { getToken, setToken, removeToken, getLocalData, setLocalData, removeLocalData }
