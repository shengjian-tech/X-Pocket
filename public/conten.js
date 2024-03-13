//create by yjs
let port = chrome.runtime.connect({
  name: 'POCKET_PROVIDER',
})

function injectCustomJs(jsPath) {
  jsPath = jsPath || 'inject.js'
  const container = document.head || document.documentElement
  var temp = document.createElement('script')
  temp.setAttribute('type', 'text/javascript')
  // 获得的地址类似：chrome-extension://ihcokhadfjfchaeagdoclpnjdiokfakg/js/inject.js
  temp.src = chrome.extension.getURL(jsPath)
  temp.onload = function () {
    this.parentNode.removeChild(this)
  }
  container.appendChild(temp)
}
injectCustomJs()

window.addEventListener('message', function (message) {
  windowListener(message)
})

port.onMessage.addListener((message) => {
  window.postMessage({ ...message, origin: 'POCKET_BACKGROUND' }, '*')
})

function windowListener(message) {
  const { data, source } = message
  if (source !== window || data.origin !== 'POCKET_PROVIDER') {
    return
  }

  const postMessage = function (data) {
    port.postMessage(data)
  }
  return postMessage(data)
}
