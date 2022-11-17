//监听window消息，并发送给插件bg.js
function isJsonString(str) {
  try {
    if (typeof JSON.parse(str) == "object") {
      return true;
    }
  } catch (e) {}
  return false;
}

window.addEventListener(
  "message",
  function (event) {
    console.log(isJsonString(event.data));
    if (isJsonString(event.data)) {
      let data = JSON.parse(event.data);
      if (
        data &&
        (data.message === "OpenNFT_transfer" ||
          data.message === "OpenNFT_demand")
      ) {
        chrome.runtime.sendMessage(event.data);
      }
    }
  },
  false
);
