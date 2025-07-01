import router from '@/router'

export function transaction(message) {
  router.push({
    path: '/Transfer',
    query: { params: JSON.stringify(message.request.params) },
  })
}
export function sendHash(method, data, type) {
  chrome.runtime.sendMessage({
    method,
    data,
    type
  })
}
/*********签名 **********/
export function signTranstion(message) {
  router.push({
    path: '/signconnect',
    query: message.request.params,
  })
}
export function sendSignHash(method, data, type) {
  chrome.runtime.sendMessage({
    method,
    data,
    type
  })
}

export function sendBaiduSignHash(method, data, type) {
  chrome.runtime.sendMessage({
    method,
    data,
    type
  })
}

export function sendBaiduInvokeContract (method, data, type) {
  chrome.runtime.sendMessage({
    method,
    data,
    type
  })
}

export function sendExit() {
  chrome.runtime.sendMessage({
    method:'exit'
  })
}

/******加解密 *****/
export function encryptCrypto (message) {
  console.log('-encryptCrypto-message=', message)
  if (JSON.parse(localStorage.getItem('currentAccont'))) {
    router.push({
      path: '/encrypt',
      query: { params: JSON.stringify(message.request.params) },
    })
  }
}
export function sendEncryptHash(method, data, type) {
  chrome.runtime.sendMessage({
    method,
    data,
    type
  })
}
export function decryptCrypto(message) {
  if (JSON.parse(localStorage.getItem('currentAccont'))) {
    router.push({
      path: '/decrypt',
      query: { params: JSON.stringify(message.request.params) },
    })
  }
}
export function sendDecryptHash(method, data, type) {
  chrome.runtime.sendMessage({
    method,
    data,
    type
  })
}
/******end *****/

/******签名发布消息****social* */
export function social(message) {
  if (JSON.parse(localStorage.getItem('currentAccont'))) {
    router.push({
      path: '/social',
      query: message.request.params,
    })
  }
}
export function sendSocialHash(method, data, type) {
  chrome.runtime.sendMessage({
    method,
    data,
    type
  })
}
/******end *****/

// 请求合约
export function invokeContract(message) {
  router.push({
    path: '/invokecontract',
    query: message.request.params,
  })
}
