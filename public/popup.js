// let PopupToBackgroundPort = chrome.extension.connect({
//     name: 'POCKET-popup-background'
// })
// const background = chrome.extension.getBackgroundPage();
// background.postPopup()
// PopupToBackgroundPort.onMessage.addListener((message) => {
//     switch (request.method) {
//         case "eth_requestAccounts":
//             break;

//         default:
//             break;
//     }
// })
// PopupToBackgroundPort.postMessage({
//     toBackground: 'popup发送请求->background'
// })