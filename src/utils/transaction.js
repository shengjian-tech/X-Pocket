import router from "@/router";
const background = chrome.extension.getBackgroundPage();
export function transaction(message) {
    router.push({
        path: '/Transfer',
        query: message.request.params
    });
}
export function sendHash(method, data, type) {
    background.getPopupTransferHash(method, data)
}