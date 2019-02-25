
/**
 * 存储sessionStorage
 */
export const setSession = (name, content) => {
  if (!name) return
  // sessionStorage只能存字符串，如果是对象需要先序列化
  if (typeof content !== 'string') {
    content = JSON.stringify(content)
  }
  window.sessionStorage.setItem(name, content)
}

/**
 * 获取sessionStorage
 */
export const getSession = name => {
  if (!name) return
  return window.sessionStorage.getItem(name)
}

/* *
 * 删除sessionStorage
 */
export const removeSession = name => {
  if (!name) return
  window.sessionStorage.removeItem(name)
}

// 存储localStorage
export const setLocal = (name, content) => {
  if (!name) return
  // sessionStorage只能存字符串，如果是对象需要先序列化
  if (typeof content !== 'string') {
    content = JSON.stringify(content)
  }
  window.localStorage.setItem(name, content)
}

/**
 * 获取localStorage
 */
export const getLocal = name => {
  if (!name) return
  return window.localStorage.getItem(name)
}

/* *
 * 删除localStorage
 */
export const removeLocal = name => {
  if (!name) return
  window.localStorage.removeItem(name)
}

// 获取cookie
export function getCookie(name) {
  var arr
  var reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
  if (arr === document.cookie.match(reg)) { return (arr[2]) } else { return null }
}

// 设置cookie
export function setCookie(c_name, value, expiredays = 30) {
  var exdate = new Date()
  exdate.setDate(exdate.getDate() + expiredays)
  document.cookie = c_name + '=' + escape(value) + ((expiredays == null) ? '' : ';expires=' + exdate.toGMTString())
}

// 删除cookie
export function delCookie(name) {
  setCookie(name, '', -1)
}

