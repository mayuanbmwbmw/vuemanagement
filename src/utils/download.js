/**
 * 流文件下载
 * @param {Stream} res     流文件对象，必选
 * @param {string} type    保存的Blob文件格式，必选
 * @param {string} Suffix  保存文件的后缀名，必选
 * @param {string} title   自定义下载文件名，必选
 * @param {string} noDate   自定义下载文件时间戳，可选
 * for example
 * params ={
 *   res: response,
 *   type: "application/vnd.ms-excel",
 *   Suffix: 'xls',
 *   title: '员工信息',
 * }
 */
export function downloadAPI(params) {
  const res = params.res
  const type = params.type
  const Suffix = params.Suffix
  const title = params.title
  const noDate = params.noDate ? params.noDate : false
  // 创建blob
  const blob = new Blob([res], { type: type })
  // 创建时间戳
  let date = new Date().getTime()
  if (noDate) { date = '' }
  // 创建下载的链接
  const downloadElement = document.createElement('a')
  const href = window.URL.createObjectURL(blob)
  // 判断浏览器
  if (myBrowser() === 'IE' || myBrowser() === 'Edge') {
    // IE专属下载方法
    navigator.msSaveBlob(blob, title + date + '.' + Suffix)
  } else {
    downloadElement.href = href
    // 下载后文件名
    downloadElement.download = title + date + '.' + Suffix
    document.body.appendChild(downloadElement)
    //   console.log('下载后文件名',downloadElement)
    // 点击下载
    downloadElement.click()
    //   console.log('点击下载后')
    // 下载完成移除元素
    document.body.removeChild(downloadElement)
    // 释放掉blob对象
    window.URL.revokeObjectURL(href)
  }
}

// 判断浏览器类型
function myBrowser() {
  var userAgent = navigator.userAgent // 取得浏览器的userAgent字符串
  var isOpera = userAgent.indexOf('Opera') > -1
  if (isOpera) {
    return 'Opera'
  } // 判断是否Opera浏览器
  if (userAgent.indexOf('Firefox') > -1) {
    return 'FF'
  } // 判断是否Firefox浏览器
  if (userAgent.indexOf('Chrome') > -1) {
    return 'Chrome'
  }
  if (userAgent.indexOf('Safari') > -1) {
    return 'Safari'
  } // 判断是否Safari浏览器
  if (userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 && !isOpera) {
    return 'IE'
  } // 判断是否IE浏览器
  if (userAgent.indexOf('Trident') > -1) {
    return 'Edge'
  } // 判断是否Edge浏览器
}
