//create by yjs
let popupOpen = false
let _handlers = {}
let _baiduHandlers = {}
let allMessage = {}

chrome.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener((message, port) => {
    if (message.request.method == 'eth_requestAccounts') {
      handler(message, port)
    }
    if (message.request.method == 'requestAccounts') {
      handler(message, port)
    }
    if (message.request.method == 'eth_sendTransaction') {
      handler(message, port)
    }
    if (message.request.method == 'sendTransaction') {
      handler(message, port)
    }
    if (message.request.method == 'personal_sign') {
      handler(message, port)
    }
    if (message.request.method == 'encryptCrypto_sign') {
      handler(message, port)
    }
    if (message.request.method == 'decryptCrypto_sign') {
      handler(message, port)
    }
    if (message.request.method == 'social_sign') {
      handler(message, port)
    }
    if (message.request.method == 'eth_requestAccounts_publicKey') {
      handler(message, port)
    }
    if (message.request.method == 'invoke_contract') {
      handler(message, port)
    }
    if (message.request.method == 'personal_info') {
      handler(message, port)
    }
  })
})

function handler(MessageTypes, port, portId) {
  const { id, message, request, type } = MessageTypes
  const promise = this.handle(id, message, request, port, portId, type)
  promise.then((response) => {
    port.postMessage({
      id,
      response,
    })
  })
}

async function handle(id, message, request, port, portId, type) {
  switch (request.method) {
    case 'eth_requestAccounts':
      allMessage.request = request
      allMessage.type = type
      return getAccounts(type)
      break
    case 'requestAccounts':
      allMessage.request = request
      allMessage.type = type
      return getAccounts(type)
      break
    case 'eth_sendTransaction':
      allMessage.request = request
      allMessage.type = type
      return sendTransaction(request)
      break
    case 'sendTransaction':
      allMessage.request = request
      allMessage.type = type
      return sendTransaction(request)
      break
    case 'personal_sign':
      allMessage.request = request
      allMessage.type = type
      return sendPersonalSign(request, type, message)
      break
    case 'encryptCrypto_sign':
      allMessage.request = request
      allMessage.type = type
      return sendEncryptCrypto(request, type)
      break
    case 'decryptCrypto_sign':
      allMessage.request = request
      allMessage.type = type
      return sendDecryptptCrypto(request, type)
      break
    case 'social_sign':
      allMessage.request = request
      allMessage.type = type
      return sendSocial(request, type)
      break
    case 'eth_requestAccounts_publicKey':
      allMessage.request = request
      allMessage.type = type
      return getAccountsInfo(request, type)
      break
    case 'invoke_contract':
      allMessage.request = request
      allMessage.type = type
      return sendInvokeContract(request, type)
    case 'personal_info':
      allMessage.request = request
      allMessage.type = type
      return getPersonInfo(type)
    default:
      break
  }
}

function getAccountsInfo(request) {
  closePopup()
  openPopup()
  return new Promise((resolve, reject) => {
    _handlers['eth_requestAccounts_publicKey'] = {
      reject,
      resolve,
    }
  })
}

function sendTransaction(request) {
  closePopup()
  openPopup()
  return new Promise((resolve, reject) => {
    _handlers['eth_sendTransaction'] = {
      reject,
      resolve,
    }
  })
}

// 发送签名方法(这个方法判断了是否每次都要弹窗签名弹窗，可以设置白名单，弹一次就不再弹了，直接签名)
function sendPersonalSign(request, type, message) {
  let whiteUrl = localStorage.getItem('whiteList') || 'https://assemblylabx.com'
  // alert('whiteUrl' + whiteUrl)
  chrome.tabs.query(
    {
      active: true,
    },
    function (tabs) {
      // alert(JSON.stringify(tabs))
      let host = tabs[0].url?.match(/^https?:\/\/[^\/]+/)?.[0]
      // alert('host' + host)
      if (whiteUrl && whiteUrl != 'undefind' && host == whiteUrl) {
        // 不再弹窗签名,直接签名
        chrome.runtime.sendMessage({
          type: 'personal_sign',
          data: request,
        })
      } else {
        // 原来的弹窗签名
        closePopup()
        openPopup()
      }
    }
  )

  return new Promise((resolve, reject) => {
    if (type == 'baidu') {
      _baiduHandlers['xuper_sign'] = {
        reject,
        resolve,
      }
    } else {
      _handlers['personal_sign'] = {
        reject,
        resolve,
      }
    }
  })
}

// 发送请求合约方法返回给页面获取合约返回的值（目前是只支持xuper）
function sendInvokeContract(request, type, message) {
  closePopup()
  openPopup()

  return new Promise((resolve, reject) => {
    if (type == 'baidu') {
      _baiduHandlers['xuper_invokeContarct'] = {
        reject,
        resolve,
      }
    }
  })
}

//加密方法
function sendEncryptCrypto(request, type) {
  closePopup()
  openPopup()
  return new Promise((resolve, reject) => {
    _handlers['encryptCrypto_sign'] = {
      reject,
      resolve,
    }
  })
}
//解密方法
function sendDecryptptCrypto(request, type) {
  // closePopup()
  openPopup()
  return new Promise((resolve, reject) => {
    _handlers['decryptCrypto_sign'] = {
      reject,
      resolve,
    }
  })
}
//签名发布test方法
function sendSocial(request, type) {
  closePopup()
  openPopup()
  return new Promise((resolve, reject) => {
    _handlers['social_sign'] = {
      reject,
      resolve,
    }
  })
}

function openPopup() {
  getLastFocusWindow().then((win) => {
    let top = win.top
    let left = win.left + (win.width - 300)
    chrome.windows.create(
      {
        url: `index.html`,
        type: 'popup',
        width: 316,
        height: 639,
        left: left,
        top: top,
      },
      (window) => {
        // let isTrust = localStorage.getItem('isTrust')
        // if (isTrust && isTrust == 1) {
        //   chrome.windows.update(window.id, { state: 'minimized' })
        // }
      }
    )
  })
}

function closePopup() {
  chrome.windows.getAll((all) => {
    // console.log(all)
    all.forEach((element) => {
      if (element.type == 'popup') {
        chrome.windows.remove(element.id)
      }
    })
  })
}

function getAccounts(type) {
  closePopup()
  openPopup()
  return new Promise((resolve, reject) => {
    _handlers['eth_requestAccounts'] = {
      reject,
      resolve,
    }
    if (type == 'baidu') {
      _baiduHandlers['eth_requestAccounts'] = {
        reject,
        resolve,
      }
    } else {
      _handlers['eth_requestAccounts'] = {
        reject,
        resolve,
      }
    }
  })
}
// 获取用户信息
function getPersonInfo(type) {
  closePopup()
  openPopup()

  return new Promise((resolve, reject) => {
    _handlers['personal_info'] = {
      reject,
      resolve,
    }
    if (type == 'baidu') {
      _baiduHandlers['personal_info'] = {
        reject,
        resolve,
      }
    } else {
      _handlers['personal_info'] = {
        reject,
        resolve,
      }
    }
  })
}

function getPopupData(method, data) {
  if (_handlers[method]) {
    const _handler = _handlers[method]
    _handler.resolve(data)
  }
}

function getPopupBaiduData(method, data) {
  if (_baiduHandlers[method]) {
    const _handler = _baiduHandlers[method]
    _handler.resolve(data)
  }
}

function getPopupTransferHash(method, data) {
  if (_handlers[method]) {
    const _handler = _handlers[method]
    _handler.resolve(data)
  }
}

function getPopupExit(method, data) {
  allMessage = {}
  closePopup()
}

function changePopupOpen(val) {
  popupOpen = val
}

function md5(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getLastFocusWindow() {
  return new Promise((resolve, reject) => {
    chrome.windows.getLastFocused((windowObject) => {
      resolve(windowObject)
    })
  })
}

function postPopup() {
  chrome.extension.onConnect.addListener((messagePort) => {
    if (messagePort.name === 'POCKET-popup-background') {
      messagePort.postMessage(allMessage)
      messagePort.onMessage.addListener((message) => {
        console.log(message)
      })
    }
  })
}
