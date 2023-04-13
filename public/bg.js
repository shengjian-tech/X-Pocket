//create by yjs
let popupOpen = false
let _handlers = {}
let _baiduHandlers = {}
let allMessage = {}
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

    })
});

function handler(MessageTypes, port, portId) {
    const {
        id,
        message,
        request,
        type
    } = MessageTypes;
    const promise = this.handle(id, message, request, port, portId, type);
    promise.then((response) => {
        port.postMessage({
            id,
            response
        });
    })
}
async function handle(id, message, request, port, portId, type) {

    switch (request.method) {
        case "eth_requestAccounts":
            allMessage.request = request
            allMessage.type = type
            return getAccounts(type)
            break;
        case "requestAccounts":
            allMessage.request = request
            allMessage.type = type
            return getAccounts(type)
            break;
        case "eth_sendTransaction":
            allMessage.request = request
            allMessage.type = type
            return sendTransaction(request)
            break;
        case "sendTransaction":
            allMessage.request = request
            allMessage.type = type
            return sendTransaction(request)
            break;

        default:
            break;
    }
}

function sendTransaction(request) {
    closePopup()
    openPopup()
    return new Promise((resolve, reject) => {
        _handlers['eth_sendTransaction'] = {
            reject,
            resolve
        };

    })
}

function openPopup() {
    getLastFocusWindow().then(win => {
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
    })
}

function closePopup() {
    chrome.windows.getAll(all => {
        // console.log(all)
        all.forEach(element => {
            if (element.type == "popup") {
                chrome.windows.remove(element.id)
            }
        });
    })
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
    closePopup()
    openPopup()
    return new Promise((resolve, reject) => {
        if (type == "baidu") {
            _baiduHandlers['eth_requestAccounts'] = {
                reject,
                resolve
            };
        } else {
            _handlers['eth_requestAccounts'] = {
                reject,
                resolve
            };
        }

    })
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


function changePopupOpen(val) {
    popupOpen = val
}

function md5(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function getLastFocusWindow() {
    return new Promise((resolve, reject) => {
        chrome.windows.getLastFocused((windowObject) => {
            resolve(windowObject);
        });
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