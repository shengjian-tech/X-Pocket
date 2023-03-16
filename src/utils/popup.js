import {
    setStorage
} from "@/utils/setStorage";
import router from "@/router";
const background = chrome.extension.getBackgroundPage();
let PopupToBackgroundPort = chrome.extension.connect({
    name: 'POCKET-popup-background'
})
let _handlers = {}
export function sendAccont(method, data, type) {
    if (type == "baidu") {
        background.getPopupBaiduData(method, data)
        setStorage("baiduAddress", data)
    } else {
        background.getPopupData(method, data)
        setStorage("address", data)
    }

}

export function getLocalAccont() {
    // let AccList = JSON.parse(localStorage.getItem("acc"))
    let connectList = JSON.parse(localStorage.getItem("connectList"))
    getTab().then(res => {
        let ifFast = connectList.find(item => {
            return item.url == res.url
        })
        if (JSON.stringify(_handlers) != "{}") {
            if (ifFast) {
                ifFast.accountList.forEach(item => {
                    switch (item.type) {
                        case 'xuper':
                            sendAccont('eth_requestAccounts', item.address, "baidu")
                            break;
                        case 'eth':
                            sendAccont('eth_requestAccounts', item.address)
                            break;

                        default:
                            break;
                    }
                });
            } else {
                router.push("/connect")
            }
        }

    })
    // console.log(background)
    // console.log(AccList)

}

export function setOpen(val) {
    background.changePopupOpen(val)
}
export function haveRequest() {
    return background.haveRequest()
}
export async function getTab() {
    return new Promise((resolve, reject) => {
        chrome.tabs.query({
            active: true
        }, function (tabs) {
            console.log(tabs)
            // const host = tab.url?.match(/^https?:\/\/[^\/]+/)?.[0];
            resolve(tabs[0])
        })
    })
}
export async function createdMessage() {
    background.postPopup()
    PopupToBackgroundPort.onMessage.addListener((message) => {
        console.log("message--------")
        console.log(message)
        if (message.request) {
            routerPush()
            switch (message.request.method) {
                case "eth_requestAccounts":
                    postMessage(message.request.method)
                    break;

                default:
                    break;
            }
        }


    })
}
export async function routerPush() {
    let connectList = JSON.parse(localStorage.getItem("connectList"))
    let acc = JSON.parse(localStorage.getItem("currentAccont"));
    if (JSON.stringify(_handlers) != "{}") {
        if (acc) {
            if (!connectList || connectList.length == 0) {
                router.push("/connect")
            } else {
                getTab().then(res => {
                    let ifFast = connectList.find(item => {
                        return item.url == res.url
                    })
                    if (!ifFast) {
                        router.push("/connect")
                    }
                })
            }
        } else {
            router.push("/Login");
        }
    }

}
export function postMessage(method) {
    return new Promise((resolve, reject) => {
        _handlers[method] = {
            reject,
            resolve
        }
    })
}