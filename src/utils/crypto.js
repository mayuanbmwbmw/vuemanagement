import CryptoJS from 'crypto-js/crypto-js'// 加密解密sj
export function encryption(data) {
  let params = []
  for (const i in data) {
    params.push(i + '=' + data[i])
  }
  params.sort() // 数组排序
  params = params.join('&') // 数组变字符串
  //   let endData=params+'&sign='+CryptoJS.MD5(params+'ADfj3kcadc2349akvm1CPFFCD84f')//接口加签名
  const endData = params// 接口不签名

    .toString() // MD5加密
  const key = CryptoJS.enc.Utf8.parse('0880076B18D7EE81') // 加密秘钥
  const iv = CryptoJS.enc.Utf8.parse('CB3EC842D7C69578') //  矢量
  const encryptResult = CryptoJS.AES.encrypt(endData, key, { //  AES加密
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7 // 后台用的是pad.Pkcs5,前台对应为Pkcs7
  })
  return encodeURIComponent(CryptoJS.enc.Base64.stringify(encryptResult.ciphertext)) // Base64加密再 encode;
}
export function decryption(data) {
  const key = CryptoJS.enc.Utf8.parse('0880076B18D7EE81') // 加密秘钥
  const iv = CryptoJS.enc.Utf8.parse('CB3EC842D7C69578') //  矢量
  const baseResult = CryptoJS.enc.Base64.parse(data) // Base64解密
  const ciphertext = CryptoJS.enc.Base64.stringify(baseResult) // Base64解密
  const decryptResult = CryptoJS.AES.decrypt(ciphertext, key, { //  AES解密
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })

  // 解密的是son格式的字符串
  const resData = decryptResult.toString(CryptoJS.enc.Utf8).toString()
  return JSON.parse(resData)

  // 解密的是字符串
  // return CryptoJS.enc.Utf8.stringify(decryptResult)
}
