import router from "@/router";
const background = chrome.extension.getBackgroundPage();
export function transaction(message) {
  router.push({
    path: "/Transfer",
    query: message.request.params,
  });
}
export function sendHash(method, data, type) {
  background.getPopupTransferHash(method, data);
}
/*********签名 **********/
export function signTranstion(message) {
  router.push({
    path: "/signconnect",
    query: message.request.params,
  });
}
export function sendSignHash(method, data, type) {
  background.getPopupTransferHash(method, data);
  background.getPopupExit();
}

export function sendBaiduSignHash(method, data, type) {
  background.getPopupBaiduData(method, data);
  background.getPopupExit();
}

export function sendExit() {
  background.getPopupExit();
  router.push({
    path: "/home",
    query: {},
  });
}

/******加解密 *****/
export function encryptCrypto(message) {
  if (JSON.parse(localStorage.getItem("currentAccont"))) {
    router.push({
      path: "/encrypt",
      query: message.request.params,
    });
  }
}
export function sendEncryptHash(method, data, type) {
  background.getPopupTransferHash(method, data);
  background.getPopupExit();
}
export function decryptCrypto(message) {
  if (JSON.parse(localStorage.getItem("currentAccont"))) {
    router.push({
      path: "/decrypt",
      query: message.request.params,
    });
  }
}
export function sendDecryptHash(method, data, type) {
  background.getPopupTransferHash(method, data);
  background.getPopupExit();
}
/******end *****/

/******签名发布消息****social* */
export function social(message) {
  if (JSON.parse(localStorage.getItem("currentAccont"))) {
    router.push({
      path: "/social",
      query: message.request.params,
    });
  }
}
export function sendSocialHash(method, data, type) {
  background.getPopupTransferHash(method, data);
  background.getPopupExit();
}
/******end *****/
