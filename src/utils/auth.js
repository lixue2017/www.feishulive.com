import Cookies from 'js-cookie'

const TokenKey = 'Live-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

const IM_USER = 'IM_USER'

export function getIMUser() {
  return Cookies.get(IM_USER) ? JSON.parse(Cookies.get(IM_USER)) : { userId: '', userSig: ''}
}

export function setIMUser(user) {
  return Cookies.set(IM_USER, JSON.stringify(user))
}

export function removeIMUser() {
  return Cookies.remove(IM_USER)
}