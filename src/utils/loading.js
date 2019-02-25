// 全屏数据加载遮罩

import { Loading } from 'element-ui'
let loading
function startLoading() {
  loading = Loading.service({
    lock: false,
    text: '加载中',
    background: 'rgba(0, 0, 0, 0.7)'
  })
}

function endLoading() {
  loading.close()
}

let needLoadingRequestCount = 0

// 显示遮罩
export function showFullScreenLoading() {
  if (needLoadingRequestCount === 0) {
    startLoading()
  }
  needLoadingRequestCount++
}

// 隐藏遮罩
export function tryHideFullScreenLoading() {
  if (needLoadingRequestCount <= 0) return
  needLoadingRequestCount--
  if (needLoadingRequestCount === 0) {
    endLoading()
  }
}
