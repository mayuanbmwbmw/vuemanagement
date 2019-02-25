import request from '@/utils/request'
import qs from 'qs'

export function login(username, password, clientIp) {
  return request({
    url: '/user/1_0/login',
    method: 'post',
    data: qs.stringify({
      username,
      password,
      clientIp
    })
  })
}

export function getInfo(userId) {
  return request({
    url: '/user/1_0/queryById',
    method: 'post',
    data: qs.stringify({ userId })
  })
}

export function logout(token) {
  return request({
    url: '/user/1_0/logout',
    method: 'post',
    data: qs.stringify({ token })
  })
}

export function register(params) {
  return request({
    url: '/user/1_0/register',
    method: 'post',
    data: qs.stringify(params)
  })
}
export function registerPhone(phoneNumber) {
  return request({
    url: '/system/1_0/code',
    method: 'post',
    data: qs.stringify({ phoneNumber })
  })
}

export function platformLogin(userId, userToken) {
  return request({
    url: '/user/1_0/loginPlatform',
    method: 'post',
    data: qs.stringify({
      userId,
      userToken
    })
  })
}

