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
  })
})

chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    chrome.storage.local.get(['key'], function (result) {
      console.log(result.key)
      if (result.key) {
        var url = details.url
        var domain = new URL(url).hostname
        const publicResolverAddr = '0x4976fb03c32e5b8cfe2b6ccb31c09ba78ebaba41'
        //解析 域名
        var domainnet = domain.replace(/^www\./i, '')
        var jsonUrl = chrome.extension.getURL('PublicResolver.json')
        fetch(chrome.extension.getURL('PublicResolver.json'))
          .then((response) => response.json())
          .then((jsonData) => {
            var abi = jsonData.abi
            const nodeHash = ethers.utils.namehash(domainnet)
            const key = '@'
            const provider = new ethers.providers.JsonRpcProvider(
              'https://eth.llamarpc.com'
            )
            const PublicResolverController = new ethers.Contract(
              publicResolverAddr,
              abi,
              provider
            )
            try {
              PublicResolverController.functions['text(bytes32,string)'](
                nodeHash,
                key
              ).then((resp) => {
                var newContentUrl = JSON.parse(resp[0])[0].value
                console.log(newContentUrl)
                if (newContentUrl) {
                  var proxyConfig = {
                    mode: 'pac_script',
                    pacScript: {
                      data:
                        "function FindProxyForURL(url, host) { if (host === '" +
                        domain +
                        "') return 'PROXY " +
                        newContentUrl +
                        "'; return { cancel: false }}",
                    },
                  }
                  // 配置代理设置
                  chrome.proxy.settings.set(
                    { value: proxyConfig, scope: 'regular' },
                    function () {
                      // 重新加载代理设置
                      chrome.webRequest.handlerBehaviorChanged()
                    }
                  )
                  return { redirectUrl: newContentUrl }
                } else {
                  return { cancel: false }
                }
              })
            } catch (error) {
              return { cancel: false }
            }
          })
          .catch((error) => {
            return { cancel: false }
          })
      } else {
        return { cancel: false }
      }
    })
  },
  { urls: ['*://*.eth/*', '*://*.hk/*'] }, // 替换为你需要监听的 URL
  ['blocking'] //参数告诉 Chrome 扩展引擎在监听器函数中执行的过程中，要等待监听器函数的结果，然后再决定是否继续处理原始请求
)

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
    // if (type == 'baidu') {
    //   _baiduHandlers['eth_requestAccounts'] = {
    //     reject,
    //     resolve,
    //   }
    // } else {
    //   _handlers['eth_requestAccounts'] = {
    //     reject,
    //     resolve,
    //   }
    // }
  })
}

function getPopupData(method, data) {
  if (_handlers[method]) {
    const _handler = _handlers[method]
    _handler.resolve(data)
  }
}

function getPopupBaiduData(method, data) {
  if (_handlers[method]) {
    const _handler = _handlers[method]
    _handler.resolve(data)
  }
  // if (_baiduHandlers[method]) {
  //   const _handler = _baiduHandlers[method]
  //   _handler.resolve(data)
  // }
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
