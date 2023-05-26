//create by yjs
let popupOpen = false;
let _handlers = {};
let _baiduHandlers = {};
let allMessage = {};
chrome.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener((message, port) => {
    if (message.request.method == "eth_requestAccounts") {
      handler(message, port);
    }
    if (message.request.method == "requestAccounts") {
      handler(message, port);
    }
    if (message.request.method == "eth_sendTransaction") {
      handler(message, port);
    }
    if (message.request.method == "sendTransaction") {
      handler(message, port);
    }
    if (message.request.method == "personal_sign") {
      handler(message, port);
    }
    if (message.request.method == "encryptCrypto_sign") {
      handler(message, port);
    }
    if (message.request.method == "decryptCrypto_sign") {
      handler(message, port);
    }
    if (message.request.method == "social_sign") {
      handler(message, port);
    }
  });
});

function handler(MessageTypes, port, portId) {
  const { id, message, request, type } = MessageTypes;
  const promise = this.handle(id, message, request, port, portId, type);
  promise.then((response) => {
    port.postMessage({
      id,
      response,
    });
  });
}
async function handle(id, message, request, port, portId, type) {
  switch (request.method) {
    case "eth_requestAccounts":
      allMessage.request = request;
      allMessage.type = type;
      return getAccounts(type);
      break;
    case "requestAccounts":
      allMessage.request = request;
      allMessage.type = type;
      return getAccounts(type);
      break;
    case "eth_sendTransaction":
      allMessage.request = request;
      allMessage.type = type;
      return sendTransaction(request);
      break;
    case "sendTransaction":
      allMessage.request = request;
      allMessage.type = type;
      return sendTransaction(request);
      break;
    case "personal_sign":
      allMessage.request = request;
      allMessage.type = type;
      return sendPersonalSign(request, type);
      break;
    case "encryptCrypto_sign":
      allMessage.request = request;
      allMessage.type = type;
      return sendEncryptCrypto(request, type);
      break;
    case "decryptCrypto_sign":
      allMessage.request = request;
      allMessage.type = type;
      return sendDecryptptCrypto(request, type);
      break;
    case "social_sign":
      allMessage.request = request;
      allMessage.type = type;
      return sendSocial(request, type);
      break;
    default:
      break;
  }
}

function sendTransaction(request) {
  closePopup();
  openPopup();
  return new Promise((resolve, reject) => {
    _handlers["eth_sendTransaction"] = {
      reject,
      resolve,
    };
  });
}

function sendPersonalSign(request, type) {
  closePopup();
  openPopup();
  return new Promise((resolve, reject) => {
    if (type == "baidu") {
      _baiduHandlers["xuper_sign"] = {
        reject,
        resolve,
      };
    } else {
      _handlers["personal_sign"] = {
        reject,
        resolve,
      };
    }
  });
}

//加密方法
function sendEncryptCrypto(request, type) {
  closePopup();
  openPopup();
  return new Promise((resolve, reject) => {
    _handlers["encryptCrypto_sign"] = {
      reject,
      resolve,
    };
  });
}
//解密方法
function sendDecryptptCrypto(request, type) {
  closePopup();
  openPopup();
  return new Promise((resolve, reject) => {
    _handlers["decryptCrypto_sign"] = {
      reject,
      resolve,
    };
  });
}
//签名发布test方法
function sendSocial(request, type) {
  closePopup();
  openPopup();
  return new Promise((resolve, reject) => {
    _handlers["social_sign"] = {
      reject,
      resolve,
    };
  });
}

function openPopup() {
  getLastFocusWindow().then((win) => {
    let top = win.top;
    let left = win.left + (win.width - 460);
    chrome.windows.create({
      url: `index.html`,
      type: "popup",
      width: 460,
      height: 700,
      left: left,
      top: top,
    });
  });
}

function closePopup() {
  chrome.windows.getAll((all) => {
    // console.log(all)
    all.forEach((element) => {
      if (element.type == "popup") {
        chrome.windows.remove(element.id);
      }
    });
  });
}

function getAccounts(type) {
  // if (popupOpen) {
  // return new Promise((resolve, reject) => {
  //     if (type == "baidu") {
  //         chrome.storage.sync.get('baiduAddress', function (data) {
  //             resolve(data['baiduAddress'])
  //         });
  //     } else {
  //         chrome.storage.sync.get('address', function (data) {
  //             resolve(data['address'])
  //         });
  //     }

  // })
  // return new Promise((resolve, reject) => {
  //     if (type == "baidu") {
  //         _baiduHandlers['eth_requestAccounts'] = {
  //             reject,
  //             resolve
  //         };
  //     } else {
  //         _handlers['eth_requestAccounts'] = {
  //             reject,
  //             resolve
  //         };
  //     }

  // })
  // } else {
  closePopup();
  openPopup();
  return new Promise((resolve, reject) => {
    if (type == "baidu") {
      _baiduHandlers["eth_requestAccounts"] = {
        reject,
        resolve,
      };
    } else {
      _handlers["eth_requestAccounts"] = {
        reject,
        resolve,
      };
    }
  });
  // }
}

function getPopupData(method, data) {
  if (_handlers[method]) {
    const _handler = _handlers[method];
    _handler.resolve(data);
  }
}

function getPopupBaiduData(method, data) {
  if (_baiduHandlers[method]) {
    const _handler = _baiduHandlers[method];
    _handler.resolve(data);
  }
}

function getPopupTransferHash(method, data) {
  if (_handlers[method]) {
    const _handler = _handlers[method];
    _handler.resolve(data);
  }
}

function getPopupExit(method, data) {
  allMessage = {};
  closePopup();
}

function changePopupOpen(val) {
  popupOpen = val;
}

function md5(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getLastFocusWindow() {
  return new Promise((resolve, reject) => {
    chrome.windows.getLastFocused((windowObject) => {
      resolve(windowObject);
    });
  });
}

function postPopup() {
  chrome.extension.onConnect.addListener((messagePort) => {
    if (messagePort.name === "POCKET-popup-background") {
      messagePort.postMessage(allMessage);
      messagePort.onMessage.addListener((message) => {
        console.log(message);
      });
    }
  });
}
