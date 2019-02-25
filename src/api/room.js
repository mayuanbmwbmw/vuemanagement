import request from '@/utils/request'
import qs from 'qs'

export function getList(params) {
  return request({
    url: '/liveRoom/1_0/query',
    method: 'post',
    data: qs.stringify(params)
  })
}

export function getListAll(params) {
  return request({
    url: '/liveRoom/1_0/queryAll',
    method: 'post',
    data: qs.stringify(params)
  })
}

export function payOrder(params) {
  return request({
    url: '/payOrder/1_0/add',
    method: 'post',
    data: qs.stringify(params)
  })
}

export function checkOrder(orderId) {
  return request({
    url: '/payOrder/1_0/queryById',
    method: 'post',
    data: qs.stringify({ orderId })
  })
}

export function getRoom(id) {
  return request({
    url: '/liveRoom/1_0/queryById',
    method: 'post',
    data: qs.stringify({ id })
  })
}

export function updateRoomStatus(id, status, userId) {
  return request({
    url: '/liveRoom/1_0/updateStatus',
    method: 'post',
    data: qs.stringify({ id, status, userId })
  })
}

// 获取并发量列表
export function getPayRecharge() {
  return request({
    url: '/payRecharge/1_0/query',
    method: 'post'
  })
}

// 获取时长列表
export function getPayDuration() {
  return request({
    url: '/payDuration/1_0/query',
    method: 'post'
  })
}

// 续费直播间时长
export function addRenew(params) {
  return request({
    url: '/payOrder/1_0/addRenew',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 检查主播是否可以进入直播间页面
export function checkAnchorLiveRoom(liveRoomId) {
  return request({
    url: '/liveRoom/1_0/checkAnchorLiveRoom',
    method: 'post',
    data: qs.stringify({ liveRoomId })
  })
}

