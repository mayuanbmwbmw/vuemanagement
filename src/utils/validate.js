
export function isvalidUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/* 合法uri*/
export function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}

/* 小写字母*/
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/* 大写字母*/
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/* 大小写字母*/
export function validatAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}
/* 手机号*/
export function validateTelephone(str) {
  const reg = new RegExp('^((13[0-9])|(14[5|7])|(15([0-9]))|(17[013678])|(18[0-9]))\\d{8}$')
  return reg.test(str)
}
/* 邮箱*/
export function validateEmail(str) {
  const reg = new RegExp('^([a-z0-9A-Z]+[-|_|\\.]?)+[a-z0-9A-Z]@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-zA-Z]{2,}$')
  return reg.test(str)
}
/* 密码  数字或字母或者数字字母组合，符号包括@_ . 三个  最少6位，最长20位 */
export function validatePassword(str) {
  const reg = /^[\w@.]{6,35}$/
  return reg.test(str)
}
/* 字符串去除所有空格验证 且不能都是数字*/
export function validateStringRealy(str, min, max) {
  let newStr = ''
  if (str) {
    newStr = str.replace(/\s+/g, '')
  }
  if (newStr.length >= min && newStr.length <= max) {
    return true
  } else {
    return false
  }
}

/* 字符串去除前后空格验证 */
export function validateStringSide(str, min, max) {
  let newStr = ''
  if (str) {
    newStr = str.replace(/^\s+|\s+$/g, '')
  }
  if (newStr.length >= min && newStr.length <= max) {
    return true
  } else {
    return false
  }
}

