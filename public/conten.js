// //create by yjs
// let port = chrome.runtime.connect({
//   name: 'POCKET_PROVIDER',
// })

// function injectCustomJs(jsPath) {
//   jsPath = jsPath || 'inject.js'
//   const container = document.head || document.documentElement
//   var temp = document.createElement('script')
//   temp.setAttribute('type', 'text/javascript')
//   // 获得的地址类似：chrome-extension://ihcokhadfjfchaeagdoclpnjdiokfakg/js/inject.js
//   temp.src = chrome.runtime.getURL(jsPath)
//   temp.onload = function () {
//     this.parentNode.removeChild(this)
//   }
//   container.appendChild(temp)
// }
// injectCustomJs()

// window.addEventListener('message', function (message) {
//   windowListener(message)
// })

// port.onMessage.addListener((message) => {
//   console.log('content-message=',message)
//   window.postMessage({ ...message, origin: 'POCKET_BACKGROUND' }, '*')
// })

// function windowListener(message) {
//   const { data, source } = message
//   if (source !== window || data.origin !== 'POCKET_PROVIDER') {
//     return
//   }
//   console.log('content-data=',data)
//   const postMessage = function (data) {
//     port.postMessage(data)
//   }
//   return postMessage(data)
// }


function injectCustomJs(jsPath) {
  jsPath = jsPath || 'inject.js';
  const container = document.head || document.documentElement;
  var temp = document.createElement('script');
  temp.setAttribute('type', 'text/javascript');
  temp.src = chrome.runtime.getURL(jsPath);
  temp.onload = function () {
    this.parentNode.removeChild(this);
  };
  container.appendChild(temp);
}

injectCustomJs();

// 每次请求时都重新连接 `port`
function createPortConnection() {
  return chrome.runtime.connect({ name: 'POCKET_PROVIDER' });
}

// 监听来自 window 的消息
window.addEventListener('message', function (message) {
  windowListener(message);
});

function windowListener(message) {
  const { data, source } = message;
  console.log('content-message=', message);
  
  // 确保消息来源是预期的
  if (source !== window || data.origin !== 'POCKET_PROVIDER') {
    return;
  }

  // 每次都重新连接
  const port = createPortConnection();

  // 发送消息到 background 页
  port.onMessage.addListener((message) => {
    window.postMessage({ ...message, origin: 'POCKET_BACKGROUND' }, '*');
  });

  const postMessage = function (data) {
    if (port && port.postMessage) {
      port.postMessage(data);
    }
  };

  // 调用消息转发函数
  return postMessage(data);
}

